'use strict';

angular.module('restaurantGradeApp')
  .controller('MainCtrl', function ($scope, $http, yelpAPI, getGrades, geolocation, uiGmapGoogleMapApi) {
    var main = this;
    geolocation.getLocation()
      .then(function (data) {
        main.latitude = data.coords.latitude;
        main.longitude = data.coords.longitude;
        main.map = { center: { latitude: main.latitude, longitude: main.longitude }, zoom: 14 }; // Map object
      });
    uiGmapGoogleMapApi.then(function(maps) {

    });
    main.searched=false;
    $scope.searchLoc='Las+Vegas'; //TODO varName sux, and value needs to be
    $scope.searchRadius = 1600; // TODO accuracy/range for location search
    $scope.yelpSearch = function () {
      main.loading=true;
      main.searched=false;
      yelpAPI.locSearch(main.latitude, main.longitude, $scope.searchRadius, function(data) {
        main.searched = true;
        main.loading = false;
        $scope.yelp = data.businesses;
        console.dir(data.businesses); //TODO Delete for production
      });
    };
    $scope.locSearch = function () {
      main.markers = [];
      main.loading=true;
      main.searched=false;
      getGrades.locSearch(main.latitude, main.longitude, $scope.searchRadius, function(data) {
        main.searched = true;
        main.loading = false;
        main.restaurants = data;
        for (var i=0;i< main.restaurants.length;i++){ // Make array of map markers
          var marker = {
            id: i+1,
            latitude: main.restaurants[i].latitude,
            longitude: main.restaurants[i].longitude,
            title: main.restaurants[i].restaurant_name
          };
          main.markers.push(marker);
        }
        console.dir(main.restaurants); //TODO Delete for production
      });

    };
    $scope.nameSearch = function(terms){
      main.loading=true;
      main.searched=false;
      yelpAPI.nameSearch(terms, $scope.searchLoc, function(data) {
        main.searched = true;
        main.loading=false;
        $scope.yelp = data.businesses;
        console.dir(data.businesses); //TODO Delete for production
      });

      /*var SNVHDrequest = {
        method: 'GET',
        url: 'https://adam-snvhd.ngrok.io/api/'
      };*/

      //$http(SNVHDrequest )
      //	.success(function(data) {
      //
      //		console.dir(data.record);
      //		$scope.results = data.record;
      //		$scope.searched = 1;
      //	})
      //	.error(function(data, status, headers, config) {
      //
      //		$scope.results = status;
      //	});
    };

    //$scope.awesomeThings = [];
    //
    //$http.get('/api/things').success(function(awesomeThings) {
    //  $scope.awesomeThings = awesomeThings;
    //  socket.syncUpdates('thing', $scope.awesomeThings);
    //});
    //
    //$scope.addThing = function() {
    //  if($scope.newThing === '') {
    //    return;
    //  }
    //  $http.post('/api/things', { name: $scope.newThing });
    //  $scope.newThing = '';
    //};
    //
    //$scope.deleteThing = function(thing) {
    //  $http.delete('/api/things/' + thing._id);
    //};
    //
    //$scope.$on('$destroy', function () {
    //  socket.unsyncUpdates('thing');
    //});
  });
