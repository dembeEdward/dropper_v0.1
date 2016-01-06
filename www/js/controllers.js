var app = angular.module('controllers', ['directives']);

app.controller('homeController', function($scope, $ionicPopup){

    $scope.showQuote = false;
    $scope.gPlace;
    $scope.map;
    $scope.chosenPlace = "";
    $scope.geocoder = new google.maps.Geocoder;
    $scope.infoWindow = new google.maps.InfoWindow;
    $scope.currentLocationString = "";

    var success = function(position){

      var currentLatLong = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      var mapOtions = {
        zoom : 16,
        center: currentLatLong,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      $scope.map = new google.maps.Map(document.getElementById("map"), mapOtions);
      var geoLatLng = {lat: position.coords.latitude, lng: position.coords.longitude};

      console.log($scope.infoWindow);

      $scope.geocoder.geocode({'location': geoLatLng}, function(results, status){

        if(status == google.maps.GeocoderStatus.OK){
          if(results[1]){
            $scope.marker = new google.maps.Marker({
              position: currentLatLong,
              map: $scope.map,
            });

            $scope.currentLocationString = results[1].formatted_address;
            $scope.infoWindow.setContent(results[1].formatted_address);
            $scope.infoWindow.open($scope.map, $scope.marker);
          }else{
            window.alert('no results found');
          }
        }else{
          window.alert('Geocoder faild due to : ' + status);
        }
      });
    //console.log(position.coords.latitude);
    };

    navigator.geolocation.getCurrentPosition(success);

    $scope.addDestinationAddress = function(){

      var alertOn = 0;

      if($scope.chosenPlace.length < 10){
        console.log("no");

      }else{

        $scope.geocoder.geocode({'address' : $scope.chosenPlace}, function(results, status){

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

          }else{

            window.alert('Geocoder failed due to : ' + status);
            alertOn = 1;
          }
        });

        if(alertOn == 0){
          $scope.showQuote = true;
        }
      }
    };

    $scope.showConfirmQuote = function(){

      console.log('yes');
      var confirmQuotePopup = $ionicPopup.confirm({
        title: 'Quote',
        template: 'Pick up location : '+ $scope.currentLocationString +'<br/> Destination Location : '+ $scope.chosenPlace+'<br/> Distance : '
      });
    };
});
