'use strict';
angular.module("myApp.regSuccess",['ui.router']).
controller("RegSuccess",['$scope','$state','$interval',function($scope,$state,$interval){
    $scope.counts=5;
    var timer=$interval(function(){
        if($scope.counts>0){
            $scope.counts--;
        }else{
             $interval.cancel(timer);
            $state.go("home.headline");
        }
    },1000);

}]);