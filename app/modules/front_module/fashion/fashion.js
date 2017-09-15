/**
 * Created by Administrator on 2017/5/16.
 */
'use strict';

angular.module('myApp.fashion', ['ui.router'])

    .controller('FashionCtrl', function($scope,$window) {
        $scope.keyWord="请输入关键词";
        var scrollTop = angular.element($window).scrollTop;

        if(scrollTop>=100){angular.element(document.querySelectorAll('.blog_right')).css({'position':'fixed'})}

    });