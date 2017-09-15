'use strict';

angular.module('myApp.showInfo', ['ui.router'])


    .controller('ShowInfoCtrl', ['$rootScope','$scope','locals','$state','$stateParams',function($rootScope,$scope,locals,$state,$stateParams) {
        var waitTime=5;
        var stateName=locals.getObj('stateName',1000*3600*24);
        if(stateName!=$stateParams.name||locals.get('upPost')){//访问的博客路径name改变时，需延迟加载给headBar提供请求时间
            waitTime=500;
        }
        $scope.userName=$stateParams.name;
        var run=setTimeout(function(){
            var myInfo=locals.getObj('myInfo',1000*3600*24);
            if(myInfo){
                $scope.nickName=myInfo.nickName;
                $scope.realName=myInfo.realName;
                var male=myInfo.male;
                var female=myInfo.female;
                if(male=='true'){
                    $scope.gender='男';
                }else{
                    if(female=='true'){
                        $scope.gender='女';
                    }
                }
                $scope.born=myInfo.born;
                $scope.live=myInfo.live;
                $scope.birthday=myInfo.birthday;
                $scope.star=myInfo.star;
                $scope.blood=myInfo.blood;
                $scope.intro=myInfo.intro;
                $scope.favourite=myInfo.favourite;
            }
        },waitTime);

    }]);