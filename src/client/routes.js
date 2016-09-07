var app = angular.module('foodfood', ['ui.router', 'ngSanitize', 'ngStorage']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/login');

  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: './views/login.html',
    controller: 'loginController'
  })
  .state('signup', {
    url: '/signup',
    templateUrl: './views/signup.html',
    controller: 'signupController'
  })
  .state('main', {
    url: '/main',
    templateUrl: './views/main.html',
    controller: 'inputsController'
  })
  .state('main.map', {
    url: '/map',
    views: {
      'restaurantList': {
        templateUrl: './views/places.html',
        controller: function($scope, RestaurantAndRoute, Auth) {
          // restaurants from the server
          $scope.restaurants = RestaurantAndRoute.getRestaurants();
        }
      },
      'map': {
        templateUrl: './views/map.html',

        // controller: function($scope, RestaurantAndRoute) {
        //   //clear existing markers
        //   RestaurantAndRoute.removeMarkers();
        //   //add restaurant markers
        //   RestaurantAndRoute.addMarkers(map);
        // }
      }
    }
  })
  .state('options', {
    url: '/options',
    templateUrl: './views/options.html',
    controller: function($scope, $state, Auth, $http, $localStorage) {

      if (!Auth.check()) {
        $state.go('login');
      } else {
        // a collection of user submitted preferences
        $scope.tags = [];

        $scope.submitTag = () => {
          if ($scope.tags.indexOf($scope.prefs.toLowerCase()) === -1) {
            $scope.tags.push($scope.prefs.toLowerCase());
          }
          $scope.prefs = '';
        }

        $scope.deleteTag = (tag) => {
          $scope.tags.splice($scope.tags.indexOf(tag), 1);
        }

        $scope.save = () => {

          // TODO: save the collection of preferences to database
          $http({
            method: 'POST',
            url: '/options',
            data: {
              username: $localStorage.username,
              userPrefs: $scope.tags
            }
          }).then(results => {
            console.log('Saved preferences: ', results.data);
            $state.go('main.map');
          }).catch(err => {
            console.log('Error saving prefs: ', err);
          })

          // redirect the user back to /main/map

        }
      }
    }
  })
}])
