angular
  .module('app')
  .factory('AuthService', ['Planner', '$q', '$rootScope', function(User, $q,
      $rootScope) {
    function login(email, password) {
      return User
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
      return User
       .logout()
       .$promise
       .then(function() {

         console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
         $rootScope.currentUser = null;
         console.log('currentUser:' + $rootScope.currentUser);
         console.log('YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY');
       });
    }

    function register(email, password, phone) {
      return User
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
