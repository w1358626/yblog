'use strict';

angular.module('myApp.myHome.myPower', ['ui.router'])


    .controller('MyPowerCtrl', ['$rootScope','$scope','locals','$stateParams','$http',function($rootScope,$scope,locals,$stateParams,$http) {

        $scope.userName=$stateParams.name;
        $scope.logs_permission='0';
        $scope.photos_permission='0';
        $scope.dynamic_permission='0';
        $scope.permText=['所有人','仅粉丝','仅博友','私有'];
        var permissions=['all','fans','friend','private'];
        var permission=locals.getObj('permission',1000*3600*24);
        //alert(permission.logs)
        permission= {logs:'all',dynamic:'all',photos:'all'};
        if(permission.logs){
            var perm1=permission.logs;
            switch(perm1){
                case 'all': $scope.logs_permission='0';
                    break;
                case 'fans': $scope.logs_permission='1';
                    break;
                case 'friend': $scope.logs_permission='2';
                    break;
                case 'private': $scope.logs_permission='3';
                    break;
            }
           // alert($scope.logs_permission)
        }
        if(permission.photos){
            var perm2=permission.photos;
            switch(perm2){
                case 'all': $scope.photos_permission='0';
                    break;
                case 'fans': $scope.photos_permission='1';
                    break;
                case 'friend': $scope.photos_permission='2';
                    break;
                case 'private': $scope.photos_permission='3';
                    break;
            }
            //alert($scope.photos_permission)
        }
        if(permission.dynamic){
            var perm3=permission.dynamic;
            switch(perm3){
                case 'all': $scope.dynamic_permission='0';
                    break;
                case 'fans': $scope.dynamic_permission='1';
                    break;
                case 'friend': $scope.dynamic_permission='2';
                    break;
                case 'private': $scope.dynamic_permission='3';
                    break;
            }
           // alert($scope.dynamic_permission)
        }
        $scope.upPermission=function(){
            var logsPerm=permissions[$scope.logs_permission];
            var photosPerm=permissions[$scope.photos_permission];
            var dynamicPerm=permissions[$scope.dynamic_permission];
            $http({url:'http://localhost:3000/up_permissions',
                data:{name:$stateParams.name,logsPerm:logsPerm,photosPerm:photosPerm,dynamicPerm:dynamicPerm},
                method:'POST',
                withCredentials: true
            }).then(function(result){

            }).catch(function(err){
                console.log(err)
            })
        }
    }]);