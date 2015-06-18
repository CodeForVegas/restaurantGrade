'use strict';

angular.module('restaurantGradeApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'geolocation',
  'leaflet-directive'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
      .otherwise('/');
    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
    //uiGmapGoogleMapApiProvider.configure({
    //  key: 'AIzaSyAyrSXt8Nc1xcEC77kQWruvCNy1E_crFMw',
    //  v: '3.17',
    //  libraries: 'weather,geometry,visualization'
    //});
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .factory('yelpAPI', function($http) {
    function randomString(length, chars) {
      var result = '';
      for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
      return result;
    }
    //cll=latitude,longitude
    var consumerSecret = 'ZstBb1qiOuhkcYtuxGiEimeI_vM'; //Consumer Secret
    var tokenSecret = '8d2tBcaYukcPN5v3uA3olQn8uTg'; //Token Secret
    var url = 'http://api.yelp.com/v2/search';
    var params = {
      category_filter: 'restaurants',
      callback: 'angular.callbacks._0',
      oauth_consumer_key: '9lvuCRvRcQVKVyIbHJM_Ig', //Consumer Key
      oauth_token: 'mPpEB073drBFRh4VsyJ98uQbYBtu55ga', //Token
      oauth_signature_method: "HMAC-SHA1",
      oauth_timestamp: new Date().getTime(),
      oauth_nonce: randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
    };

    return {
      'locSearch' : function (lat, long, radius, callback) {
        console.log('callback is: '+callback );
        params.ll= lat+","+long;
        params.radius_filter= radius;
        params.oauth_signature = oauthSignature.generate('GET', url, params, consumerSecret, tokenSecret, { encodeSignature: false});
        $http.jsonp(url, {params: params}).success(callback);
      },
      'nameSearch': function(name, loc, callback) {
        params.location= loc;
        params.term= name;
        params.oauth_signature = oauthSignature.generate('GET', url, params, consumerSecret, tokenSecret, { encodeSignature: false});
        $http.jsonp(url, {params: params}).success(callback);
      }
    };
  })

  .factory('getGrades', function ($http) {
    return {
      locSearch : function(lat, long, rad, callback){
        $http.post('/api/grades/near', {lat: lat, long: long, rad: rad})
          .success(callback)
      }
    };
  })

  .factory("geoLoc", function(geolocation){
    return {
      getLoc : function() {
        geolocation.getLocation()
          .then(function (data) {
          return {lat: data.coords.latitude, long: data.coords.longitude};
        });
      }
    };
  })
  .run(function ($rootScope, $location, Auth) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  });
