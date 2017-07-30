(function () {
  'use strict';

  angular
    .module('app')
    .service('IdeaService', IdeaService)
    .service('CategoryService', CategoryService)
    .service('UserService', UserService)
    .service('AuthService', AuthService);

  function IdeaService($http) {
    return {
      query : function() {
        return $http.get('/api/ideas?limit=100');
      },
      get : function() {
        return $http.get('/api/ideas/' + id);
      },
      create : function(idea) {
        return $http.post('/api/ideas', idea);
      },
      delete : function(id) {
        return $http.delete('/api/ideas/' + id);
      }
    }
  }

  function CategoryService($http) {
    return {
      query : function() {
        return $http.get('/api/categories');
      }
    }
  }

  function UserService($http) {
    return {
      create : function(user) {
        return $http.post('/api/users', user);
      }
    }
  }

  function AuthService($http, $localStorage) {
    var authService = {};

    authService.login = function(username, password, callback) {
      $http.post('api/auth', { username: username, password: password })
        .success(function (response) {
          $localStorage.currentUser = { username: username, token: response.token };
          authService.setHeaders();
          callback(true);
        })
        .error(function(data) {
          callback(false);
        });
    }

    authService.setHeaders = function() {
      $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.currentUser.token;
    }

    authService.logout = function() {
      delete $localStorage.currentUser;
      $http.defaults.headers.common.Authorization = '';
    }

    authService.isLoggedIn = function() {
      return !!$localStorage.currentUser;
    }

    authService.currentUser = function() {
      return $localStorage.currentUser;
    }

    return authService;

  }


})();