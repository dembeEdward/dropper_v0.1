var app = angular.module('controllers', []);

app.controller('homeController', function($scope, $ionicPopup, $window, $ionicLoading, $timeout, $location){

    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true
    });

    $scope.platform = ionic.Platform;
    $scope.showAddPickUp = true;
    $scope.showAddDestination = false;
    $scope.showQuote = false;
    $scope.gPlace;
    $scope.map;
    $scope.chosenPickUp = "";
    $scope.chosenDestination = "";
    $scope.geocoder = new google.maps.Geocoder;
    $scope.infoWindow = new google.maps.InfoWindow;
    $scope.distanceMatrix = new google.maps.DistanceMatrixService();
    $scope.currentLocationString = "";
    var pickUpResults = [];
    var destinatonResults = [];

    var success = function(position){

      var currentLatLong = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      var mapOtions = {
        zoom : 16,
        center: currentLatLong,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      $scope.map = new google.maps.Map(document.getElementById("map"), mapOtions);
      var geoLatLng = {lat: position.coords.latitude, lng: position.coords.longitude};

      $timeout(function(){
        $ionicLoading.hide();
      }, 7000);

      console.log($scope.infoWindow);

    //console.log(position.coords.latitude);
    };

    navigator.geolocation.getCurrentPosition(success);

    $scope.addPickUpAddress = function(chosenPickUp){

      var alertOn = 0;

      console.log(chosenPickUp);

      if(chosenPickUp.length < 10){

        console.log("no");
      }else{

        $scope.geocoder.geocode({'address' : chosenPickUp}, function(results, status){

          if(status == google.maps.GeocoderStatus.OK){

            $scope.marker = new google.maps.Marker({
              map: $scope.map,
              position: results[0].geometry.location
            });

            $scope.infoWindow.setContent(results[0].formatted_address);
            $scope.infoWindow.open($scope.map, $scope.marker);
            pickUpResults = results;
          }else{

            window.alert('Geocoder faid due to ' + status);
            alertOn = 1;
          }
        });

        if (alertOn == 0) {
          $scope.showAddDestination = true;
          $scope.showAddPickUp = false;
        }
      }
    };

    $scope.addDestinationAddress = function(chosenDestination){

      var alertOn = 0;

      if(chosenDestination.length < 10){
        console.log("no");

      }else{

        $scope.geocoder.geocode({'address' : chosenDestination}, function(results, status){

          alertOn = 0;

          console.log(results);

          if(status == google.maps.GeocoderStatus.OK){
            $scope.marker = new google.maps.Marker({
              position: results[0].geometry.location,
              map: $scope.map
            });

            $scope.map.setZoom(9);
            $scope.infoWindow.setContent(results[0].formatted_address);
            $scope.infoWindow.open($scope.map, $scope.marker);
            destinatonResults = results;

          }else{

            window.alert('Geocoder failed due to : ' + status);
            alertOn = 1;
          }
        });

        if(alertOn == 0){
          $scope.showAddDestination = false;
          $scope.showQuote = true;
        }
      }
    };

    $scope.showConfirmQuote = function(chosenPickUp, chosenDestination){

      $scope.distanceMatrix.getDistanceMatrix({
        origins: [pickUpResults[0].geometry.location],
        destinations: [destinatonResults[0].geometry.location],
        travelMode: google.maps.TravelMode.DRIVING
      }, function(result, status){

          if(status ==  "OK"){

            var confirmQuotePopup = $ionicPopup.confirm({
              title: 'Quote',
              template: 'Pick up location : '+ chosenPickUp +'<br/> Destination Location : '+ chosenDestination +'<br/> Distance : ' + result.rows[0].elements[0].distance.text + '<br/> Time : ' + result.rows[0].elements[0].duration.text
            });

            confirmQuotePopup.then(function(res){
              if(res){
                $location.path('/tab/list');
              }
            });

          }else{

            window.alert('Unable to load time and distance');
          }
      });
    };

    $scope.showLoader = function(){

      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true
      });
    };

    $scope.hideLoader = function(){

      $ionicLoading.hide();
    }

    $scope.reLoadState = function(){

      $window.location.reload(true);
    };




});

app.controller('loginController', function(store, $scope, $location, auth, $http){

  $scope.login = function() {
   auth.signin({
     authParams: {
       scope: 'openid offline_access',
       device: 'Mobile device'
     }
   }, function(profile, token, accessToken, state, refreshToken) {
     // Success callback
     store.set('profile', profile);
     store.set('token', token);
     store.set('refreshToken', refreshToken);
     $location.path('/tab/home');
   }, function() {
     // Error callback
   });
 }
 $scope.login();
});

app.controller('listController', function($scope, $firebaseArray, $location, store, $ionicModal, $ionicPopup, $ionicLoading){

  $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true
  });

  $scope.itemsAdded = [];
  var results = [];
  $scope.selected = {};
  $scope.selectedFilter = "";
  $scope.showCheckout = false;

  var ref = new Firebase("https://fugazzidropper.firebaseio.com/items");
  $scope.items = $firebaseArray(ref);

  $scope.items.$loaded()
    .then(function(x) {
      $ionicLoading.hide();
    }).catch(function(error) {
    console.log("Error:", error);
  });

  $scope.addItem = function(index, item){

    var duplicates = false;
    $scope.selected = item;

    if($scope.itemsAdded.length < 10){

      for(var x=0; x<$scope.itemsAdded.length; x++){
        if($scope.selected.Item == $scope.itemsAdded[x].Item){

          var alertPopup = $ionicPopup.alert({
            title: 'Sorry',
            template: 'You have already added ' + $scope.selected.Item
          });
          duplicates = true;

          alertPopup.then(function(res){
            $scope.closeModal();
          });

          break;
        }
      }

      if(!duplicates){
        $scope.itemsAdded.push($scope.selected);

        if($scope.itemsAdded.length > 0){
          $scope.showCheckout = true;
        }else{
          $scope.showCheckout = false;
        }

        $scope.closeModal();
      }

    }else{

      var alertPopup = $ionicPopup.alert({
        title: 'Sorry',
        template: 'You can not add more than 10 items'
      });

      alertPopup.then(function(res){
        $scope.closeModal();
      });
    }
  };

  $scope.removeItem = function(index){

    $scope.itemsAdded.splice(index, 1);

    if($scope.itemsAdded.length > 0){
      $scope.showCheckout = true;
    }else{
      $scope.showCheckout = false;
    }
  };

  $ionicModal.fromTemplateUrl('../templates/list-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal){
    $scope.modal = modal;
  });

  $scope.openModal = function(){
    $scope.selectedFilter = "";

    if($scope.itemsAdded.length > 0){
      $scope.showCheckout = true;
    }else{
      $scope.showCheckout = false;
    }

    $scope.modal.show();
  };

  $scope.closeModal = function(){
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function(){
    $scope.modal.remove();
  });

});

app.controller('profileController', function($scope, store){

  $scope.profile = store.get('profile');
  console.log($scope.profile);


});
