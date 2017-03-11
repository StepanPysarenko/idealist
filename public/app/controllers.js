(function () {
  'use strict';

  angular
  .module('app')
  .controller('HomeController', HomeController)
  .controller('NewController', NewController)
  .controller('ProfileController', ProfileController)
  .controller('RegisterController', RegisterController)
  .controller('LoginController', LoginController)
  .controller('LogoutController', LogoutController)
  .controller('MenuController', MenuController);

  function NewController($scope, $http, IdeaService, AuthService) {
    var vm = this;
    vm.createIdea = createIdea;
    vm.deleteIdea = deleteIdea;

    IdeaService.get()
    .success(function(data) {
      data.reverse();
      vm.ideas = data;
    });

    function createIdea() {
      if (vm.idea.text != undefined) {
        IdeaService.create(vm.idea)
        .success(function(data) {
          data.reverse();
          vm.idea = {};
          vm.ideas = data;
        });
      }
    };

    function deleteIdea(id) {
      if(!AuthService.isLoggedIn())
        return;
      IdeaService.delete(id)
      .success(function(data) {
        data.reverse();
        vm.ideas = data;
      });
    };

  }

  function HomeController($scope, $http) {}

  function ProfileController($scope, $http, AuthService) {
    var vm = this;
    vm.username = AuthService.currentUser().username;
  }

  function RegisterController($scope, $http, UserService) {
    var vm = this;
    vm.saveUser = saveUser;

    function saveUser() {
      var isCorrect = vm.user.username != undefined 
      && vm.user.password != undefined
      && vm.user.email != undefined;
      if (isCorrect) {
        UserService.create(vm.user)
          .success(function(data) {
            vm.user = {};
            alert("User successfully saved");
          })
          .error(function(err) {
            alert(err.message);
          });
      }
    }

  }

  function LoginController($location, AuthService) {
    var vm = this;
    vm.login = login;
    vm.username = vm.password = 'test';

    function login() {
      vm.loading = true;
      AuthService.login(vm.username, vm.password, function (result) {
        if (result === true) {
          $location.path('/');
        } else {
          vm.error = 'Username or password is incorrect';
          vm.loading = false;
        }
      });
    };

  }

  function LogoutController($location, AuthService) {
    AuthService.logout();
    $location.path('/home');
  }

  function MenuController ($scope, $location, AuthService) {

    $scope.isLoggedIn = function () {
      return AuthService.isLoggedIn();
    };         

    $scope.getClass = function (page) {
      var currentRoute = $location.path().substring(1) || 'home';
      return page === currentRoute ? 'active' : '';
    };   

  }

})();