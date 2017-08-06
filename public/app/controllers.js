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

    CategoryService.query()
    .success(function(result) {
      vm.categories = result;
    });

    vm.createIdea = function() {
      vm.loading = true;
      IdeaService.create(vm.idea)
      .success(function(result) {
        vm.success = "Your idea was successfully submitted";           
      })
      .error(function(err) {
        vm.error = err.message || "An error occured. Try later.";
        vm.loading = false;
      });
    };

  }

  function HomeController($scope, $filter, $http, IdeaService, AuthService) {
    var vm = this;

    IdeaService.query()
    .success(function(result) {
      vm.ideas = result;
    });

    vm.deleteIdea = function(id) {
      if(!AuthService.isLoggedIn()) return;
      IdeaService.delete(id)
      .success(function(result) {
        vm.ideas = result;
      });
    };

    vm.starIdea = function(id) {
      if(!AuthService.isLoggedIn()) return;

      var idea = $filter("filter")(vm.ideas, {id: id})[0];

      if(idea.is_starred) 
      {
        unstarIdeaItem(idea);
        IdeaService.unstar(id)
          .success(function(result) {
            idea.rating = result.rating;
          })
          .error(function(err) {
            starIdeaItem(idea);
          });
      } else {
        starIdeaItem(idea);
        IdeaService.star(id)
          .success(function(result) {
            idea.rating = result.rating;
          })
          .error(function(err) {
            unstarIdeaItem(idea);
          });
      }

      function starIdeaItem(idea) {
        idea.is_starred = true;
      }

      function unstarIdeaItem(idea) {
        idea.is_starred = false;
      }
      
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
      .success(function(result) {
        vm.user = {};
        vm.success = result.message;
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
