(function () {
  'use strict';

  angular
  .module('app')
  .factory('IdeaService', IdeaService)
  .factory('UserService', UserService)
  .factory('AuthService', AuthService);

  function IdeaService($http) {
    return {
      get : function() {
        return $http.get('/api/ideas');
      },
      create : function(ideaData) {
        return $http.post('/api/ideas', ideaData);
      },
      delete : function(id) {
        return $http.delete('/api/ideas/' + id);
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
    var service = {};

    service.login = login;
    service.logout = logout;
    service.isLoggedIn = isLoggedIn;
    service.currentUser = currentUser;

    return service;

    function login(username, password, callback) {

      $http.post('api/auth', { username: username, password: password })
      .success(function (response) {

        $localStorage.currentUser = { username: username, token: response.token };
        $http.defaults.headers.common.Authorization = 'Bearer ' + response.token;

        callback(true);
      }).error(function(data) {
        callback(false);
      });
    }

    function logout() {
      delete $localStorage.currentUser;
      $http.defaults.headers.common.Authorization = '';
    }

    function isLoggedIn() {
      return !!$localStorage.currentUser;
    }

    function currentUser() {
      return $localStorage.currentUser;
    }

  }


})();
