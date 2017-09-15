'use strict';

angular.module('myApp.home', ['ui.router'])
    .controller('HomeCtrl',['$state','$scope','$http','locals',function($state,$scope,$http,locals) {
    $state.go('home.headline');
    $scope.photo1_show=true;
    $scope.photo2_show=false;
    $scope.photo3_show=false;
    $scope.headline_click=function(event){
        angular.element(document.querySelectorAll('#headline_nav div p')).removeClass('headline_active');
        angular.element(document.querySelectorAll('#headline_nav div')).removeClass('headline_active');
        $(event.target).addClass('headline_active');
    }
    $scope.photo1_click=function(){
        $scope.photo1_show=true;
        $scope.photo2_show=false;
        $scope.photo3_show=false;
    };
    $scope.photo2_click=function(){
        $scope.photo1_show=false;
        $scope.photo2_show=true;
        $scope.photo3_show=false;
    };
    $scope.photo3_click=function(){
        $scope.photo1_show=false;
        $scope.photo2_show=false;
        $scope.photo3_show=true;
    }
    /*$http({
        url:'http://localhost:3000/label_posts',
        params:{label:'文化'},
        method:'GET',
        withCredentials: true
    })*/


}])



