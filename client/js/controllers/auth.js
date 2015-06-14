angular
  .module('app')
  .controller('AuthLoginController', ['$scope', 'AuthService', '$state',
      function($scope, AuthService, $state) {
    $scope.planner = {};

    $scope.login = function() {
      AuthService.login($scope.planner.email, $scope.planner.password)
        .then(function() {
          $state.go('app');
        });
    };
  }])
  .controller('AuthLogoutController', ['$scope', 'AuthService', '$state',
      function($scope, AuthService, $state) {
    AuthService.logout()
      .then(function() {
        $rootScope.currentUser = null;
        console.log('ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ');
        $state.go('home');
      });
  }])
  .controller('SignUpController', ['$scope', 'AuthService', '$state',
      function($scope, AuthService, $state) {
    $scope.planner = {};

    $scope.register = function() {
      AuthService.register($scope.planner.email, $scope.planner.password, $scope.planner.phone)
        .then(function() {
          $state.transitionTo('home.sign-up-success');
        });
    };
  }]);
