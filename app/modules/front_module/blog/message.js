'use strict';

angular.module('myApp.myHome.messages', ['ui.router'])


    .controller('MessagesCtrl', ['$rootScope','$scope','locals','$stateParams','$state','$compile',function($rootScope,$scope,locals,$stateParams,$state,$compile) {
        $scope.userName=$stateParams.name;

    }])

     .directive('myMessages',function(){
         return{
             scope:{},
             restrict:'AE',
             template:'<div style="padding:30px;"><ul id="messages"></ul>',
             link:function($scope,elem,attr){

             },
             controller:function($scope,$element,$attrs,locals,$compile,$http,$stateParams,$timeout){
                 var waitTime=5;
                 var stateName=locals.getObj('stateName',1000*3600*24);
                 if(stateName!=$stateParams.name||locals.get('upPost')){//访问的博客路径name改变时，需延迟加载给headBar提供请求时间
                     waitTime=400;
                 }
                 var run=$timeout(function(){
                     $scope.allow_show=true;
                     $scope.refuse_show=true;
                     $scope.allowed_show=false;
                     $scope.refused_show=false;
                     var messages_list=$element.find('#messages');
                     var messages=locals.getObj('messages',1000*3600*24);
                     $scope.allow=function(event,id){
                         $scope.allow_show=false;
                         $scope.refuse_show=false;
                         $scope.allowed_show=true;

                         var val=$(event.target).find('.allow_val');
                         val=val.val();
                         val=val.split('-');
                         var myName=val[0];
                         var name=val[1];
                         var myFriend=val[2];
                         var myMessages=val[3];
                         if(!myMessages){
                             myMessages=[];
                         }
                         myMessages=JSON.stringify(myMessages);
                         myFriend=myFriend.split(',');
                         myFriend=JSON.stringify(myFriend);
                         var friend=val[4];
                         friend=friend.split(',');
                         friend=JSON.stringify(friend);
                         alert(friend+' '+myFriend+' '+myMessages)
                         $http({url:'http://localhost:3000/up_friend',
                             data:{myName:myName,name:name,myFriend:myFriend,friend:friend,mes:myMessages},
                             method:'POST',
                             withCredentials: true
                         }).then(function(result){
                             var mes;
                             for(var i=0;i<messages.length;i++){
                                 if(messages[i].id==id){
                                     messages.splice(i,1);
                                 }
                             }
                             mes=JSON.stringify(messages);
                             $http({
                                 url:'http://localhost:3000/up_mes',
                                 data:{name:name,messages:mes},
                                 method:'POST',
                                 withCredentials: true
                             }).then(function(result){
                                 locals.set('upPost',true);
                             }).catch(function(err){
                                 console.log(err)
                             });
                         }).catch(function(err){
                             console.log(err)
                         })
                     };
                     $scope.refuse=function(event,id){
                         $scope.allow_show=false;
                         $scope.refuse_show=false;
                         $scope.refused_show=true;
                         var val=$(event.target).find('.refuse_val');
                         val=val.val();
                         val=val.split('-');
                         var myName=val[0];
                         var name=val[1];
                         var myMessages=val[2];
                         console.log(myMessages)
                         if(angular.isArray(myMessages)){
                             myMessages=JSON.stringify(myMessages);
                         }else{
                             myMessages=[];
                             myMessages=JSON.stringify(myMessages);
                         }
                         $http({url:'http://localhost:3000/refused_friend',
                             params:{myName:myName,name:name,myMessages:myMessages},
                             method:'GET',
                             withCredentials: true
                         }).then(function(result){
                             var mes;
                             for(var i=0;i<messages.length;i++){
                                 if(messages[i].id==id){
                                     messages.splice(i,1);
                                 }
                             }
                             mes=JSON.stringify(messages);
                             $http({
                                 url:'http://localhost:3000/up_mes',
                                 data:{name:name,messages:mes},
                                 method:'POST',
                                 withCredentials: true
                             }).then(function(result){
                                 locals.set('upPost',true);
                             }).catch(function(err){
                                 console.log(err)
                             });
                         }).catch(function(err){
                             console.log(err)
                         })
                     };
                     $scope.delete=function(i){
                         messages=messages.splice(i,1);
                         if(i==0||i=='0'){
                             messages=[];
                         }
                         var mes=JSON.stringify(messages);
                         var name=$stateParams.name;
                         $http({
                             url:'http://localhost:3000/up_mes',
                             data:{name:name,messages:mes},
                             method:'POST',
                             withCredentials: true
                         }).then(function(result){

                         }).catch(function(err){
                             console.log(err)
                         });
                         $element.find('#mes'+i+'').remove();
                     };
                     if(!messages){
                         messages=[];
                     }

                     for(var i=0;i<messages.length;i++){
                         var message;
                         var html;
                         var item;
                         message='<li id="mes'+i+'" style="border-bottom:1px solid #e7e1e6;font-size:12px;color:#9a9a9a;padding-bottom:20px;width:100%;">' +
                             '<div><p style="display:inline-block;vertical-align:top;font-size:14px;margin-bottom:20px;color:rgba(47, 54, 137, 0.83);">'+messages[i].name+'</p>' +
                             '<span ng-click="delete('+i+')"  style="width:20px;cursor:pointer;font-size:16px;height:20px;color:#c7c7c7;display:inline-block;vertical-align:top;float:right;">×</span>' +
                             '<span style="color:#3f3f3f;font-size:12px;float:right;margin-right:20px;">'+messages[i].time+'</span></div>' +
                             '<p id="message'+i+'"></p></li>';
                         message=$compile(message)($scope);
                         messages_list.append(message);
                         item=$element.find('#message'+i);
                         html=$compile(messages[i].message)($scope);
                         item.append(html);
                         messages[i].read=true;
                     }
                     var upMes=$timeout(function(){
                         var mes=JSON.stringify(messages);
                         $http({url:'http://localhost:3000/up_mes',
                             data:{name:$stateParams.name,messages:mes},
                             method:'POST',
                             withCredentials: true
                         }).then(function(result){

                         }).catch(function(err){
                             console.log(err)
                         })
                     },200);
                 },waitTime);

             }
         }
     })