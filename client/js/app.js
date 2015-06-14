angular
  .module('app', [
    'ui.router',
    'lbServices'
  ])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider,
      $urlRouterProvider) {

      $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {
        url: '/',
        views: {
          'header': {
            templateUrl: 'views/partials/navbar.html'
          },
          'content': {
            templateUrl: 'views/partials/home.html'
          },
          'footer': {
            templateUrl: 'views/partials/footer.html'
          }
        }
      })
      .state('app', {
        url: '/app',
        views: {
          'header': {
            templateUrl: 'views/partials/navbar.html'
          },
          'content': {
            templateUrl: 'views/partials/features.html'
          }
        },
        authenticate: true
      })
      .state('home.features', {
        url: 'features'  ,
        views: {
          'content@' : {
             templateUrl: 'views/partials/features.html'
          }
        }
      })
      .state('home.forbidden', {
        url: 'forbidden',
        views: {
         'content@': {
           templateUrl: 'views/forbidden.html'
         }
        }
      })
      .state('home.login', {
        url: 'login',
        views: {
          'content@' : {
            templateUrl: 'views/sign-in.html',
            controller: 'AuthLoginController'
          }
        }
      })
      .state('home.signup', {
          url: 'signup',
          views: {
            'content@': {
              templateUrl: 'views/sign-up.html',
              controller: 'SignUpController'
            }
          }
      })
      .state('home.logout', {
        url: 'logout',
        controller: 'AuthLogoutController'
      })
      .state('my-reviews', {
        url: '/my-reviews',
        templateUrl: 'views/my-reviews.html',
        controller: 'MyReviewsController',
        authenticate: true
      })
      .state('home.sign-up-success', {
        url: 'success',
        views: {
          'content@': {
            templateUrl: 'views/sign-up-success.html'
          },
        }
      });
  }])
  .run(['$rootScope', '$state', function($rootScope, $state) {
    $rootScope.$on('$stateChangeStart', function(event, next) {
      // redirect to login page if not logged in
      if (next.authenticate && !$rootScope.currentUser) {
        event.preventDefault(); //prevent current page from loading
        $state.go('home.forbidden');
      }
    });
  }]);
