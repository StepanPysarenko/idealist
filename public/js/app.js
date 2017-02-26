(function () {
    'use strict';

  angular
    .module('app', ['ui.router', 'ngStorage'])
    .config(config)
    .run(run);

  function config($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/home');

    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'partials/home.html',
        controller: 'HomeController',
        controllerAs: 'vm'
      })
      .state('new', {
        url: '/new',
        templateUrl: 'partials/new.html',
        controller: 'NewController',
        controllerAs: 'vm'
      })
      .state('register', {
        url: '/register',
        templateUrl: 'partials/register.html',
        controller: 'RegisterController',
        controllerAs: 'vm'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'partials/login.html',
        controller: 'LoginController',
        controllerAs: 'vm'
      });

    if(window.history && window.history.pushState){
      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
    }

  }

  function run($rootScope, $http, $location, $localStorage) {
    if ($localStorage.currentUser) {
      $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.currentUser.token;
    }

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
      // var publicPages = ['/login', '/home'];
      // var restrictedPage = publicPages.indexOf($location.path()) === -1;

      var restrictedPages = [];
      var restrictedPage = restrictedPages.indexOf($location.path()) > -1;
      
      if (restrictedPage && !$localStorage.currentUser) {
        $location.path('/home');
      }
    });
  }

})();
