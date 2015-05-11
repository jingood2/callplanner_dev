angular
  .module('app')
  .factory('AuthService', ['Planner', '$q', '$rootScope', function(Planner, $q,
      $rootScope) {
    function login(email, password) {
      return Planner
        .login({email: email, password: password})
        .$promise
        .then(function(response) {
          $rootScope.currentUser = {
            id: response.user.id,
            tokenId: response.id,
            email: email
          };
        });
    }

    function logout() {
      return Planner
       .logout()
       .$promise
       .then(function() {
         $rootScope.currentUser = null;
       });
    }

    function register(email, password, phone) {
      return Planner
        .create({
         email: email,
         password: password,
	       phone: phone
       })
       .$promise;
    }

    return {
      login: login,
      logout: logout,
      register: register
    };
  }]);
