var app = angular.module('controllers', []);

app.controller('inexController', function($scope, $ionicHistory){
  $scope.myGoBack = function() {
   $ionicHistory.goBack();
 };
});

app.controller('homeController', function($scope, $rootScope, $ionicPopup, $window, $ionicLoading, $timeout, $location, $state, $cordovaGeolocation, store){

    $scope.$on('$ionicView.beforeEnter', function() {
      $rootScope.viewColor = '#00BFFF';
    });



    //$scope.reLoadState();

    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true
    });

    $scope.platform = ionic.Platform;
    $scope.showAddPickUp = true;
    $scope.showAddDestination = false;
    $scope.showQuote = false;
    $scope.showAddPickUpSearch = true;
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
    var options = {timeout: 10000, enableHighAccuracy: true};
    var infobox, currentLatLong;

    $cordovaGeolocation.getCurrentPosition(options).then(function(position){

      var currentLatLong = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
       mapOtions = {
        zoom : 16,
        center: currentLatLong,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      $scope.map = new google.maps.Map(document.getElementById("map"), mapOtions);

      $scope.geocoder.geocode({'latLng' : currentLatLong}, function(results, status){

        if(status == google.maps.GeocoderStatus.OK){

          $scope.marker = new google.maps.Marker({
            map: $scope.map,
            position: currentLatLong,
            title: 'Pick Up Location'
          });

          $scope.chosenPickUp = results[0].formatted_address;

            infobox = new InfoBox({
              content: document.getElementById("infobox"),
              disableAutoPan: false,
              maxWidth: 150,
              pixelOffset: new google.maps.Size(-140, 0),
              zIndex: null,
              boxStyle: {
                background: "url('http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/examples/tipbox.gif') no-repeat",
                opacity: 0.75,
                width: "280px"
              },
              closeBoxMargin: "12px 4px 2px 2px",
              closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
              infoBoxClearance: new google.maps.Size(1, 1)
        });

          infobox.open($scope.map, $scope.marker);
          $scope.map.panTo(currentLatLong);
          $ionicLoading.hide();
        }else{

          window.alert('Geocoder faid due to ' + status);
        }
      });

      console.log($scope.infoWindow);
    }, function(error){

      alert("unable to get geolocation");
    });

    $scope.notKeepLocation = function(){
      $scope.chosenPickUp = "";
      $scope.showAddPickUp = true;
      infobox.close();
      $scope.marker.setMap(null);
    };

    $scope.addPickUpAddress = function(chosenPickUp){

      infobox.close();
      $scope.marker.setMap(null);

      var alertOn = 0;

      if(!$scope.showAddPickUp){
        infobox.close();
        $scope.marker.setMap(null);
      }

      console.log(chosenPickUp);

      if(chosenPickUp.length < 10){

        console.log("no");
      }else{

        $scope.geocoder.geocode({'address' : chosenPickUp}, function(results, status){

          pickUpResults = results;

          if(status == google.maps.GeocoderStatus.OK){

            $scope.marker = new google.maps.Marker({
              map: $scope.map,
              position: results[0].geometry.location
            });

            infobox = new InfoBox({
              content: document.getElementById("infobox2"),
              disableAutoPan: false,
              maxWidth: 150,
              pixelOffset: new google.maps.Size(-140, 0),
              zIndex: null,
              boxStyle: {
                background: "url('http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/examples/tipbox.gif') no-repeat",
                opacity: 0.75,
                width: "280px"
              },
              closeBoxMargin: "12px 4px 2px 2px",
              closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
              infoBoxClearance: new google.maps.Size(1, 1)
        });

          console.log($scope.map);
          infobox.open($scope.map, $scope.marker);
          $scope.map.panTo(currentLatLong);

            store.set('pickUp', chosenPickUp);
          }else{

            window.alert('Geocoder faid due to ' + status);
            alertOn = 1;
          }
        });

        if (alertOn == 0) {
          $scope.showAddDestination = true;
          $scope.showAddPickUp = false;
          $scope.showAddPickUpSearch = false;
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
          destinatonResults = results;
          console.log(results);

          if(status == google.maps.GeocoderStatus.OK){
            $scope.marker = new google.maps.Marker({
              position: results[0].geometry.location,
              map: $scope.map
            });
            infobox.close();
            infobox = new InfoBox({
              content: document.getElementById("infobox3"),
              disableAutoPan: false,
              maxWidth: 150,
              pixelOffset: new google.maps.Size(-140, 0),
              zIndex: null,
              boxStyle: {
                background: "url('http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/examples/tipbox.gif') no-repeat",
                opacity: 0.75,
                width: "280px"
              },
              closeBoxMargin: "12px 4px 2px 2px",
              closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
              infoBoxClearance: new google.maps.Size(1, 1)
        });

          $scope.map.setZoom(9);
          infobox.open($scope.map, $scope.marker);
          $scope.map.panTo(currentLatLong);

            store.set('destination', chosenDestination);
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
      console.log(destinatonResults);
      $scope.distanceMatrix.getDistanceMatrix({
        origins: [pickUpResults[0].geometry.location],
        destinations: [destinatonResults[0].geometry.location],
        travelMode: google.maps.TravelMode.DRIVING
      }, function(result, status){

          if(status ==  "OK"){

            var confirmQuotePopup = $ionicPopup.confirm({
              title: 'Details',
              template: '<b>Pick up location</b> : '+ chosenPickUp +'<br/><br/> <b>Destination Location : </b>'+ chosenDestination +'<br/><br/> <b>Distance : </b>' + result.rows[0].elements[0].distance.text + '<br/><br/> <b>Time : </b>' + result.rows[0].elements[0].duration.text,
              cancelType: 'button-assertive',
              okType: 'button-calm',
              okText: 'Add Items'
            });

            confirmQuotePopup.then(function(res){
              if(res){
                store.set('time', result.rows[0].elements[0].duration.text);
                store.set('distance', result.rows[0].elements[0].distance.text);
                store.set('pickUp', chosenPickUp);
                store.set('destination', chosenDestination);
                $location.path('/tab/categories');
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

      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true
      });

      $scope.platform = ionic.Platform;
      $scope.showAddPickUp = true;
      $scope.showAddDestination = false;
      $scope.showAddPickUpSearch = true;
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

      $cordovaGeolocation.getCurrentPosition(options).then(function(position){

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
      }, function(error){

        alert("unable to get geolocation");
      });

    };

});

app.controller('loginController', function(store, $scope, $location, auth, $http){

});

app.controller('listController', function($scope, $state, $ionicHistory, $ionicPopup, itemAdded, checkoutList){

  console.log(itemAdded.getItemAdded());

  $scope.checkoutList = checkoutList.getCheckoutList();

  if($scope.checkoutList.length == 10){
    var alertPopup = $ionicPopup.alert({
      title: 'Too Many Items',
      template: 'You have 10 items, you can not add anymore items'
    });
  }else{

    $scope.checkoutList.push({item: itemAdded.getItemAdded()});
    checkoutList.setCheckoutList($scope.checkoutList);

    console.log($scope.checkoutList);
  }

  $scope.addMoreItems = function(){
    if($scope.checkoutList.length == 10){
      var alertPopup = $ionicPopup.alert({
        title: 'Too Many Items',
        template: 'You have 10 items, you can not add anymore items'
      });
    }else{
        $ionicHistory.goBack(-2);
    }
  };

  $scope.removeItem = function(index){

    if($scope.checkoutList.length == 1){
        var confirmPopup = $ionicPopup.confirm({
          title: 'Are you sure?',
          template: 'Are you sure you want to delete the last item?',
          okText: 'Yes',
          okType: 'button-calm',
          cancelType: 'button-assertive'
        });

        confirmPopup.then(function(res) {
          if(res){
            $scope.checkoutList.splice(index, 1);
            checkoutList.setCheckoutList($scope.checkoutList);
            $scope.checkoutList = checkoutList.getCheckoutList();
            $ionicHistory.goBack(-2);
          }else{
            console.log('You are not sure');
          }
        });
      }else{
        $scope.checkoutList.splice(index, 1);
        checkoutList.setCheckoutList($scope.checkoutList);
        $scope.checkoutList = checkoutList.getCheckoutList();
    }

    console.log($scope.checkoutList);
  };

  $scope.checkOut = function(){
    $state.go('tab.quote');
  };
});

app.controller('categoriesController', function($scope, $state, $ionicLoading, categories, selectedCategory, store){

  $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true
  });

  $scope.categories = categories;

  $scope.categories.$loaded().then(function(x){
    console.log($scope.categories);
    $ionicLoading.hide();
  });

  $scope.selectCategory = function(name){
    var selected = "";
    console.log(name);

    for(var x=0; x<$scope.categories.length; x++){
      if(name == $scope.categories[x].name){
        selected = $scope.categories[x].name;
        selectedCategory.setSelected(selected);
        $state.go('tab.selectedCategory')
      }
    }
  };
});

app.controller('selectedCategoryController', function($scope, $ionicLoading, $state,$ionicHistory, items, selectedCategory, itemAdded){

  $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true
  });

  console.log(selectedCategory.getSelected());
  $scope.items = items;
  var selected = selectedCategory.getSelected();
  $scope.categoryItems = [];

  $scope.items.$loaded().then(function(x){
    console.log($scope.items);

    for(var x=0; x<$scope.items.length; x++){
      if($scope.items[x].Category_Name == selected){
        $scope.categoryItems.push($scope.items[x]);
      }
    }

    console.log($scope.categoryItems);
    $ionicLoading.hide();
  });

  $scope.addItem = function(item){

    itemAdded.setItemAdded(item);
    $state.go('tab.list');
  }

});

app.controller('profileController', function($scope, store, $ionicLoading, $timeout){

  $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true
  });

  $scope.profile = store.get('profile');

  $timeout(function(){
    $ionicLoading.hide();
  }, 2000);
  console.log($scope.profile);


});

app.controller('checkoutController', function($scope, store, $ionicPopup, $ionicLoading, $state, prices, checkoutList, $http, $window, $cordovaInAppBrowser, $httpParamSerializerJQLike, $timeout, $rootScope, $state, payment, $ionicHistory){

  $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true
  });

  $scope.pickUp = store.get('pickUp');
  $scope.destination = store.get('destination');
  $scope.time = store.get('time');
  $scope.distance = store.get('distance');
  $scope.items = checkoutList.getCheckoutList();
  $scope.itemsNo = $scope.items.length;
  $scope.discountRate = 0;
  $scope.totalPriceRate = 0;
  $scope.categorySum = 0;
  $scope.courier=true;
  $scope.categorySumResult = 0;

  var ref = "";

  var price = prices;

  price.$loaded().then(function(x){
    console.log(prices);
    console.log($scope.items[0].item);

    for(var x=0; x<$scope.items.length; x++){

     for(var y=0; y<price.length; y++){

       if($scope.items[x].item.Category == price[y].category){

         $scope.categorySumResult+=parseInt($scope.items[x].item.Category);


         $scope.items[x].rate = prices[y].category_rate;

         if($scope.courier==true && parseInt($scope.items[x].item.Category) ==1){
             $scope.courier=true
         }
         else{
           $scope.courier=false;
         }
       }

       if($scope.items[x].item.Category >5){

         $scope.items[x].rate = 0.2;
       }
     }
   }

   for(var x=0; x<$scope.items.length; x++){
     $scope.categorySum += (parseFloat($scope.items[x].rate));
   }

   if(parseInt($scope.distance) <3){
         $scope.discountRate = 5.5;
     }else if(parseInt($scope.distance) >=3 && parseInt($scope.distance) <= 4){
         $scope.discountRate = 4;
     }else if(parseInt($scope.distance) >=5 && parseInt($scope.distance) <= 9){
         $scope.discountRate = 2.5;
     }else if(parseInt($scope.distance) >= 10 && parseInt($scope.distance) <= 19){
         $scope.discountRate = 1.5;
     }else if(parseInt($scope.distance) >= 20 && parseInt($scope.distance) <= 29){
         $scope.discountRate = 1;
     }else if(parseInt($scope.distance) >= 30 && parseInt($scope.distance)<= 40){
         $scope.discountRate = 0.9;
     }else{
         $scope.discountRate = 0.8;
     }


     $scope.totalPrice = ((parseFloat($scope.distance)) *  20 * (1 + $scope.categorySum)) * $scope.discountRate;


     if($scope.courier==true){

       console.log("inside courier pricing");
       $scope.totalPrice =(parseFloat($scope.totalPrice)*0.2);

     }

     if(parseInt($scope.categorySumResult)<=10){

       $scope.totalPrice =(parseFloat($scope.totalPrice)*0.8);
     }

      $ionicLoading.hide();

      $scope.showItemsPopUp = function(){

        var popUpTemplate = "";

        for(var x=0; x<$scope.items.length; x++){
          popUpTemplate += $scope.items[x].item.Item + '<br/>';
        }

        var alertPopup = $ionicPopup.alert({
          title: 'Items',
          okType: 'button-calm',
          template: popUpTemplate
        });
    };

    $scope.reLoadState = function(){

      $ionicHistory.goBack(-4);
    };



    $scope.makePayment = function(){

      $ionicLoading.show({
        content: 'Loading our payment system',
        animation: 'fade-in',
        showBackdrop: true
      });

      /*var options = {
        location: 'yes',
        clearcache: 'no',
        toolbar: 'no'
      };*/

      var payuPrice = $scope.totalPrice * 100;
      console.log(payuPrice.toFixed(0).toString());
      var payuPriceString = payuPrice.toFixed(0).toString();
      var myData = {
        price : payuPriceString
      }
      var resultRef = {};
      var ref = "";

          $http({
                method  : 'POST',
                url     : 'http://104.131.71.253:3002/PayUAPI',
                data    : $httpParamSerializerJQLike(myData),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
              })
              .then(function(res) {

                console.log(res.data);
                ref = res.data.substring(232, 243);
                //alert(ref);
                console.log(ref);

                var options = {
                  location: 'no',
                  clearcache: 'no',
                  toolbar: 'no'
                };

                $cordovaInAppBrowser.open('https://staging.payu.co.za/rpp.do?PayUReference=' + ref, '_blank', options)
                  .then(function(event) {
                    // success
                  })
                  .catch(function(event) {
                    // error
                });

                $rootScope.$on('$cordovaInAppBrowser:loadstart', function(e, event){

                  // alert(event.url);
                   var url27 = event.url.substring(0,27);

                   if(url27 == "http://104.131.71.253:3003/"){

                     resultRef = {ref : event.url.substring(42,53)};
                     console.log(resultRef);
                     $cordovaInAppBrowser.close();
                   }
                });

                $rootScope.$on('$cordovaInAppBrowser:exit', function(e, event){

                  //console.log(resultRef);
                  $http({
                        method  : 'POST',
                        url     : 'http://104.131.71.253:3002/payuResult',
                        data    : $httpParamSerializerJQLike(resultRef),  // pass in data as strings
                        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
                      }).then(function(res){



                          var price = parseInt(res.data.substring(195,(205 - res.data.substring(195, 205).indexOf("<")))) / 100;
                          var payuRef = res.data.substring(393, 404);
                          var displayMessage = res.data.substring(305, 316);
                          displayMessage = displayMessage.substr(1);
                          //alert(displayMessage.substr(1));
                          //if (displayMessage == "successfull")
                          payment.setDisplaymessage(displayMessage);
                          payment.setPrice(price);
                          payment.setReference(payuRef);
                          //alert(displayMessage);
                          if(displayMessage == "You chose " || displayMessage == "Successful"){

                            $state.go('tab.payment');
                            $ionicLoading.hide();
                          }else{
                            $ionicLoading.hide();
                          }

                      });
                });

              });
      };
  //  };

  });
});

app.controller('paymentController', function($scope, payment, $ionicLoading){

  $scope.displayMessage = payment.getDisplayMessage();
  $scope.price = payment.getPrice();
  $scope.reference = payment.getReference();
  $scope.result = true;

  if($scope.displayMessage == "Successful"){
    $scope.result = true;
  }else if($scope.displayMessage == "You chose "){
    $scope.result = false;
  }

  $ionicLoading.hide();

});
