'use strict';

angular.module('myApp.myHome.myInfo', ['ui.router'])


    .controller('MyInfoCtrl', ['$rootScope','$scope','locals','$stateParams','$http',function($rootScope,$scope,locals,$stateParams,$http) {
            $scope.userName='';
            $scope.myName='';
            $scope.myRealName='';
            $scope.male=false;
            $scope.female=false;
            $scope.myBirthday='';
            $scope.myBorn='';
            $scope.myLive='';
            $scope.myIntro='';
            $scope.myStar ='';
            $scope.bloodType='';
            $scope.favourite='';
            if(locals.getObj('myInfo',1000*3600*24)){
            var info=locals.getObj('myInfo',1000*3600*24);
             $scope.userName=$stateParams.name;
             $scope.myName=info.name;
             $scope.myRealName=info.realName;
             $scope.male=info.male;
             $scope.female=info.female;
             $scope.myBirthday=info.birthday;
             $scope.myBorn=info.born;
             $scope.myLive=info.live;
             $scope.myIntro=info.intro;
             $scope.myStar =info.star;
             $scope.bloodType=info.blood;
            $scope.favourite=info.favourite;
            }

            $scope.upInfo=function(){
                    alert($scope.myRealName+'RNAME'+ $scope.male+ 'MALE'+$scope.female+'FEMALE'+$scope.myBirthday+ ''+$scope.myBorn+''+ $scope.myLive)
                  $http({
                          url:'http://localhost:3000/up_myInfo',
                          data:{name:$stateParams.name,
                              nickName:$scope.myName,
                              realName:$scope.myRealName,
                              male:$scope.male,
                              female:$scope.female,
                              birthday:$scope.myBirthday,
                              born:$scope.myBorn,
                              live:$scope.myLive,
                              intro:$scope.myIntro,
                              star:$scope.myStar,
                              blood:$scope.bloodType,
                              favourite:$scope.favourite},
                           method:'POST',
                          withCredentials: true
                  }).then(function(result){

                  }).catch(function(err){
                      console.log(err)
                  })
            }




    }]);