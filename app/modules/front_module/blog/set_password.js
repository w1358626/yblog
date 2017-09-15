'use strict';

angular.module('myApp.myHome.mySet.setPassword', ['ui.router'])


    .controller('SetPasswordCtrl', ['$rootScope','$scope','locals','$stateParams','$http',function($rootScope,$scope,locals,$stateParams,$http) {

        $scope.userName=$stateParams.name;
        $scope.name=[];
        $scope.password=[];
        $scope.newPwd=[];
        $scope.re_newPwd=[];
        $scope.tip='';
        $scope.success='';
        $scope.reg_pwd=function(){
            var reg = /[a-zA-Z0-9_-]{6,16}/;
            if(!reg.test($scope.newPwd)){
                $scope.tip='新密码应为6-16个字符！';
            }else{
                $scope.tip='';
            }
        };
        $scope.rePassword=function(){
            if($scope.name!=$stateParams.name){
                $scope.tip='用户名填写不正确！'
                $scope.success='';
            }else{

              if($scope.newPwd==$scope.re_newPwd){
                $http({url:'http://localhost:3000/rePassword',
                     data:{name:$stateParams.name,pwd:$scope.password,newPwd:$scope.newPwd} ,
                     method:'POST',
                     withCredentials: true
                }).then(function(result){
                    if(result.data=='userName not exist'){
                        $scope.tip='用户名不存在！'
                        $scope.success='';
                    }
                    if(result.data=='pwd error'){
                        $scope.tip='密码错误！'
                        $scope.success='';
                    }
                    if(result.data=='success'){
                        $scope.success='修改成功！'
                    }
                }).catch(function(err){
                    console.log(err)
                })
            }else{
                   $scope.tip='新密码两次输入不一致！'
                  $scope.success='';
                     }
            }
        }
    }]);