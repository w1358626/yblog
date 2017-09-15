'use strict';

angular.module('myApp.myHome.mySet.setHead', ['ui.router'])


    .controller('SetHeadCtrl', ['$rootScope','$scope','locals','$stateParams','$http',function($rootScope,$scope,locals,$stateParams,$http) {
        var waitTime=5;
        var stateName=locals.getObj('stateName',1000*3600*24);
        if(stateName!=$stateParams.name||locals.get('upPost')){//访问的博客路径name改变时，需延迟加载给headBar提供请求时间
            waitTime=500;
        }
        $scope.userName=$stateParams.name;
        $scope.head=locals.get('headImg');
        var run=setTimeout(function(){
            $scope.upTheme=function(){
                $http({
                    url:'http://localhost:8000/upload.html',
                    method: 'POST',
                    headers: {
                        'Content-Type': undefined
                    },
                    transformRequest: function() {
                        var formData = new FormData();
                        formData.append('file0', $('#file')[0].files[0]);
                        return formData;
                    }
                }).then(function (result) {
                    if(result!="not allowed") {
                        console.log(result.data);
                        $scope.themeImg_show=false;
                        $scope.head=result.data[0];
                        $http({url:'http://localhost:3000/upHead',
                              data:{head:$scope.head},
                              method: 'POST',
                              withCredentials: true
                        }).then(function(result){
                               locals.set('upPost',true)
                        }).catch(function(err){
                            console.log(err)
                        })
                    }
                }).catch(function(data, status) {
                    console.log(data);
                });
            };
        },waitTime);


    }]);
