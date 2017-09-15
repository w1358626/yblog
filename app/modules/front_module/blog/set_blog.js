'use strict';

angular.module('myApp.myHome.mySet.setBlog', ['ui.router'])


    .controller('SetBlogCtrl', ['$rootScope','$scope','locals','$stateParams','$http',function($rootScope,$scope,locals,$stateParams,$http) {
        var waitTime=5;
        var stateName=locals.getObj('stateName',1000*3600*24);
        if(stateName!=$stateParams.name||locals.get('upPost')){//访问的博客路径name改变时，需延迟加载给headBar提供请求时间
            waitTime=400;
        }
        var run=setTimeout(function(){
            var blogDes=locals.getObj('blogDes',1000*3600*24);
            $scope.userName=$stateParams.name;
            $scope.blogTitle=blogDes.title;
            $scope.blogDes=blogDes.des;
            $scope.up_blogDes=function(){
                $http({url: 'http://localhost:3000/up_blogDes',
                    data:{name:$stateParams.name,title:$scope.blogTitle,des:$scope.blogDes},
                    method:'POST',
                    withCredentials: true
                }).then(function(result){

                }).catch(function(err){
                    console.log(err)
                })
            }
        },waitTime);


    }]);