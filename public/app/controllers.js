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

  function NewController($scope, $http, AuthService, IdeaService, CategoryService) {
    var vm = this;

    IdeaService.get()
    .success(function(data) {
      vm.ideas = data;
    });

    CategoryService.get()
    .success(function(data) {
      vm.categories = data;
    });

    vm.createIdea = function() {
      vm.loading = true;
      IdeaService.create(vm.idea)
      .success(function(data) {
        vm.success = "Your idea was successfully submitted";           
      })
      .error(function(err) {
        vm.error = err.message || "An error occured. Try later.";
        vm.loading = false;
      });
    };

  }

  function HomeController($scope, $http, IdeaService, AuthService) {
    var vm = this;

    IdeaService.get()
    .success(function(data) {
      console.log(JSON.stringify(data));
      vm.ideas = data;
    });

    vm.deleteIdea = function(id) {
      if(!AuthService.isLoggedIn())
        return;
      IdeaService.delete(id)
      .success(function(data) {
        data.reverse();
        vm.ideas = data;
      });
    };

  }

  function ProfileController($scope, $http, AuthService) {
    var vm = this;
    vm.username = AuthService.currentUser().username;
  }

  function RegisterController($scope, $http, UserService) {
    var vm = this;
    vm.saveUser = saveUser;

    function saveUser() {
      vm.loading = true;

      UserService.create(vm.user)
      .success(function(data) {
        vm.user = {};
        vm.success = data.message;
      })
      .error(function(err) {
        vm.loading = false;
        vm.error = err.message;
      });
    }

  }

  function LoginController($location, AuthService) {
    var vm = this;
    vm.login = login;
vm.username = vm.password = 'test'; // debug only

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