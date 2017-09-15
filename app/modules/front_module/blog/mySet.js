'use strict';

angular.module('myApp.myHome.mySet', ['ui.router'])


    .controller('MySetCtrl', ['$rootScope','$scope','locals','$stateParams','$state',function($rootScope,$scope,locals,$stateParams,$state) {

        $scope.userName=$stateParams.name;
        $state.go('myHome.mySet.setBlog',{name:$stateParams.name})
    }]);