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
      })
      .state('logout', {
        url: '/logout',
        templateUrl: '',
        controller: 'LogoutController',
      })
      .state('profile', {
        url: '/profile',
        templateUrl: 'partials/profile.html',
        controller: 'ProfileController',
        controllerAs: 'vm'
      })

    if(window.history && window.history.pushState) {
      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
    }

  }

  function run($rootScope, $http, $location, AuthService) {
    if (AuthService.isLoggedIn())
      AuthService.setHeaders();

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
      var restrictedPagesLoggedIn = ['/login', '/register'];
      var restrictedPagesGuest = ['/profile'];

      var isRestricted = ( AuthService.isLoggedIn() && restrictedPagesLoggedIn.indexOf($location.path()) > -1 )
        || ( !AuthService.isLoggedIn() && restrictedPagesGuest.indexOf($location.path()) > -1 );
      
      if (isRestricted) {
        $location.path('/home');
      }
    });
  }

})();
