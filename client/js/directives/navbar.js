/**
 *
 * Created by KimJin-young on 15. 6. 14..
 */


'use strict';

/**
 * @ngdoc directive
 * @name com.module.core.directive:navbar
 * @description
 * # navbar
 */
angular.module('app')
    .directive('navbar', function() {
        return {
            templateUrl: 'views/partials/navbar.html',
            restrict: 'E'
        };
    });