'use strict';

angular.module('myApp.upPhoto', ['ui.router'])


    .controller('UpPhotoCtrl', ['$rootScope','$scope','locals','$stateParams','$state','$http',function($rootScope,$scope,locals,$stateParams,$state,$http) {
        var waitTime=5;
        var stateName=locals.getObj('stateName',1000*3600*24);
        if(stateName!=$stateParams.name||locals.get('upPost')){//访问的博客路径name改变时，需延迟加载给headBar提供请求时间
            waitTime=500;
        }
        var run=setTimeout(function(){
            var photo=angular.element(document.querySelectorAll('.photo'));
            var selectBook=angular.element(document.querySelectorAll('#selectBook'));
            var myBooks=locals.getObj('photoBooks',1000*3600*24);
            myBooks=JSON.parse(myBooks);
            if(!angular.isArray(myBooks)){
                myBooks=[];
            }
            $scope.userName=$stateParams.name;
            $scope.selectBook='';
            var myBook;

            for(var i=0;i<myBooks.length;i++){
                var html='<option >'+myBooks[i].name+'</option>';
                selectBook.append(html);
            }

            var appendPhoto=function(){
                var select=selectBook.val();
                if(!Number(select)&&Number(select)!=0){
                    //alert("进入")
                    selectBook=0;
                }else{
                    selectBook=Number(select);
                }
                //alert(selectBook)
                $http({
                    url:'http://localhost:8000/upload.html',
                    method: 'POST',
                    headers: {
                        'Content-Type': undefined
                    },
                    transformRequest: function() {
                        var formData = new FormData();
                        formData.append('file',$('.photo')[0].files[0]);
                        return formData;
                    }
                }).then(function(result){
                    var photoBooks=locals.getObj('photoBooks',1000*3600*24);
                    photoBooks=JSON.parse(photoBooks);
                    if(!angular.isArray(photoBooks)){
                        photoBooks=[];
                    }
                    var photoSrc=result.data;
                    console.log(result.data)
                    var bookName;
                    if(!angular.isNumber(selectBook)){
                        //alert(selectBook)
                        bookName='我的相册';
                        var haveBook=false;
                        for(var i=0;i<photoBooks.length;i++){
                            if(photoBooks[i].name==bookName){
                                photoBooks[i].photos.push(photoSrc);
                                haveBook=true;
                                myBook=photoBooks[i];
                            }
                        }
                        if(!haveBook){
                            var date=new Date();
                            var current=date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
                                date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
                            var myBooks={name:'我的相册',photos:[photoSrc],time:current};
                            photoBooks.push(myBooks);
                            myBook=myBooks;
                        }
                    }else{
                        photoBooks[selectBook].photos.push(photoSrc);
                        myBook=photoBooks[selectBook];
                    }
                    //上传相册photoBooks
                    photoBooks=JSON.stringify(photoBooks);
                    $http({url:'http://localhost:3000/upPhoto',
                        data:{name:$stateParams.name,myBooks:photoBooks},
                        method:'POST',
                        withCredentials: true
                    }).then(function(result){
                        myBook=JSON.stringify(myBook);
                        locals.set('upPost',true);//数据变动标志
                        $state.go('photos.photo', {name:$stateParams.name,photoBook:myBook,method:'go'})
                    }).catch(function(err){
                        console.log(err)
                    });


                }).catch(function(err){
                    console.log(err)
                })
            };
            $scope.upPhoto=function(){
                var img=photo.val();
                if(img!=""){
                    appendPhoto();
                }
            };
        },waitTime);


    }]);