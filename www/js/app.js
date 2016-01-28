// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova','controllers', 'directives','auth0', 'angular-storage', 'angular-jwt', 'firebase', 'ion-autocomplete'])

.run(function($ionicPlatform, auth) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

  auth.hookEvents();
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, authProvider, $httpProvider, jwtInterceptorProvider){

  $ionicConfigProvider.navBar.alignTitle('center');

  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'loginController'
    })
    .state('tab',{
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })
    .state('tab.home',{
      url:'/home',
  /*    data: {
        requiresLogin: true
      }, */
      views: {
        'tab-home':{
          templateUrl: 'templates/tabs-home.html',
          controller: 'homeController'
        }
      }
    })
    .state('tab.list',{
      url: '/list',
      views: {
        'tab-home': {
          controller: 'listController',
          templateUrl: 'templates/list.html'
        }
      }
    })
    .state('tab.profile', {
      url: '/profile',
      views: {
        'tab-profile': {
          templateUrl: 'templates/tabs-profile.html',
          controller: 'profileController'
        }
      }
    })
    .state('tab.quote',{
      url: '/quote',
      views: {
        'tab-home': {
          templateUrl: 'templates/checkout.html',
          controller: 'checkoutController'
        }
      }
    });

    $urlRouterProvider.otherwise('/');

  jwtInterceptorProvider.tokenGetter = function(store) {
    return store.get('token');
  }

  // Add a simple interceptor that will fetch all requests and add the jwt token to its authorization header.
  $httpProvider.interceptors.push('jwtInterceptor');
})
.run(function($rootScope, auth, store, jwtHelper, $timeout, $state){

  Auth0Lock('XUfJmQqde9MB9Y5JezxpptospCG34clu', 'fugazzi.auth0.com').show({
    connections: ['google-oauth2', 'facebook'],
    icon: 'http://tryimg.com/7/2016/01/25/TiBv.png',
    dict: {
    signin: {
      title: "Login"
    }
  }
  }, function(err, profile, token){

    console.log(profile);
    store.set('profile', profile);
    store.set('token', token);


    //store.set('refreshToken', refreshToken)
    $timeout(function() {
        $state.go('tab.home');
    });
  });



});
