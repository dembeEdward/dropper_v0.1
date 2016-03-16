var app = angular.module('directives', []);

app.directive('googleplace', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, model) {
            var options = {
                types: [],
                componentRestrictions: {}
            };
            scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

            google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
                scope.$apply(function() {
                    model.$setViewValue(element.val());
                });
            });
        }
    };
});

app.directive('disabletap', function($timeout) {
  return {
    link: function() {
      $timeout(function() {
        container = document.getElementsByClassName('pac-container');
        // disable ionic data tab
        angular.element(container).attr('data-tap-disabled', 'true');
        // leave input field if google-address-entry is selected
        angular.element(container).on("click", function(){
            document.getElementById('type-selector').blur();
        });

      },500);

    }
  };
});

app.factory('categories', function($firebaseArray){

  var categoriesRef = new Firebase("https://fugazzidropper.firebaseio.com/categories");
  var categories = $firebaseArray(categoriesRef);

  return categories;
});

app.factory('prices', function($firebaseArray){

  var pricesRef = new Firebase("https://fugazzidropper.firebaseio.com/prices");
  var prices = $firebaseArray(pricesRef);

  return prices;
});

app.service('selectedCategory', function(){

  this.setSelected = function(selected){
    this.selectedCategory = selected;
  };

  this.getSelected = function(){
    return this.selectedCategory;
  };
});

app.factory('items', function($firebaseArray){
  var itemsRef = new Firebase("https://fugazzidropper.firebaseio.com/items");
  var items = $firebaseArray(itemsRef);

  return items;
});

app.service('itemAdded', function(){

  this.setItemAdded = function(item){
    this.itemAdded = item;
  };

  this.getItemAdded = function(){
    return this.itemAdded;
  };
});

app.service('checkoutList',function(){

  this.checkoutList = [];

  this.setCheckoutList = function(list){
    this.checkoutList = list;
  };

  this.getCheckoutList = function(){
    return this.checkoutList;
  };
});

app.service('payment', function(){

  this.setDisplaymessage = function(message){
    this.displayMessage = message;
  };

  this.setPrice = function(price){
    this.price = price;
  };

  this.setReference = function(ref){
    this.reference = ref;
  };

  this.getDisplayMessage = function(){
    return this.displayMessage;
  };

  this.getPrice = function(){
    return this.price;
  };

  this.getReference = function(){
    return this.reference;
  };
});
