'use strict';

angular.module('myApp.photos', ['ui.router'])


    .controller('PhotosCtrl', ['$rootScope','$scope','locals','$stateParams','$state','$compile','$http',function($rootScope,$scope,locals,$stateParams,$state,$compile,$http) {
        //权限管理
        var permission=locals.getObj('permission',1000*3600*24);
        var loginName=locals.getObj('lastName',1000*3600*24);
        var waitTime=5;
        var stateName=locals.getObj('stateName',1000*3600*24);
        if(stateName!=$stateParams.name||locals.get('upPost')){//访问的博客路径name改变时，需延迟加载给headBar提供请求时间
            waitTime=400;
            //alert(400)
        }else{$scope.photoBooks=locals.getObj('photoBooks',1000*3600*24);
            $scope.photoBooks=JSON.parse($scope.photoBooks);
        }
        $scope.userName=$stateParams.name;
        if(loginName==(null||undefined||'')&&permission.photos!='all'){
            $state.go('notLogin',{name:$stateParams.name})
        }
        var isFans=false,isFriend=false;
        if(loginName!=$stateParams.name){//不是博主就判断访问权限
            if(permission.photos=='fans'){
                var fans=locals.getObj('fans',1000*3600*24);
                if(!fans){
                    fans=[];
                }else{
                 for(var i=0;i<fans.length;i++){
                    if(fans[i].name==loginName){
                        isFans=true;
                    }
                  }
                }
                if(!isFans){
                    $state.go('notPerm',{name:$stateParams.name})
                }
            }
            if(permission.photos=='friend'){
                var friend=locals.getObj('friend',1000*3600*24);
                if(!friend){
                    friend=[];
                }else{
                for(var j=0;j<friend.length;j++){
                    if(friend[j]==loginName){
                        isFriend=true;
                    }
                  }
                }
                if(!isFriend){
                    $state.go('notPerm',{name:$stateParams.name})
                }
            }
            if(permission.photos=='private'){
                $state.go('notPerm',{name:$stateParams.name})
            }
        }
       //主要交互逻辑
        $scope.userName=$stateParams.name;
        var run=setTimeout(function(){
            $scope.triangle='相册';
            $scope.border='';
            $scope.photoBooks=locals.getObj('photoBooks',1000*3600*24);
            $scope.photoBooks=JSON.parse($scope.photoBooks);
            $scope.countPhotos=0;
                for(var i=0;i<$scope.photoBooks.length;i++){
                    $scope.countPhotos+=$scope.photoBooks[i].photos.length;
                }
            if(!angular.isArray($scope.photoBooks)){
                $scope.photoBooks=[];
            }
            $scope.newBook=function(){
                var newBookName=prompt('新相册名称：');
                if(newBookName!=""&&newBookName!=null){
                    var date=new Date();
                    var current=date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
                        date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
                    var newBook={name:newBookName,photos:[],time:current};
                    $scope.photoBooks.push(newBook);
                    var photoBooks=JSON.stringify($scope.photoBooks);
                    $http({url:'http://localhost:3000/upPhoto',
                        data:{name:$stateParams.name,myBooks:photoBooks},
                        method:'POST',
                        withCredentials: true
                    }).then(function(result){
                        locals.set('upPost',true);//数据变动标志
                    }).catch(function(err){
                        console.log(err)
                    })

                }
            }
            //删除相册
            $scope.del_show=function(){
                $scope.books_show=!$scope.books_show;
            };
            $scope.deleteBook=function(){
                locals.set('upPost',true);//数据变动标志
                var select=del_select.val();
                var selectBook;
                if(!Number(select)&&Number(select)!=0){
                    alert("进入")
                    selectBook=0;
                }else{
                    selectBook=Number(select);
                }
                alert(selectBook)
                var del_book=angular.element(document.querySelectorAll('#books'+selectBook+''));
                del_book.remove();
                myBooks.splice(selectBook,1);
                var photoBooks=JSON.stringify(myBooks);
                $http({url:'http://localhost:3000/upPhoto',
                    data:{name:$stateParams.name,myBooks:photoBooks},
                    method:'POST',
                    withCredentials: true
                }).then(function(result){

                }).catch(function(err){
                    console.log(err)
                })


            };

            //遍历del_select
            var del_select=angular.element(document.querySelectorAll('#del_select'));
            for(var j=0;j<$scope.photoBooks.length;j++){
                del_select.append('<option value="'+j+'">'+$scope.photoBooks[j].name+'</option>')
            }
        },waitTime);





    }]);