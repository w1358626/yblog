'use strict';

angular.module('myApp.myVideo', ['ui.router'])


    .controller('MyVideoCtrl', ['$rootScope','$scope','locals','$state','$stateParams','$http','$compile',function($rootScope,$scope,locals,$state,$stateParams,$http,$compile) {
        $scope.userName=$stateParams.name;
        $scope.videos=[];
        //加载延迟设定
        var waitTime=5;
        var stateName=locals.getObj('stateName',1000*3600*24);
        if(stateName!=$stateParams.name||locals.get('upPost')){//访问的博客路径name改变时，需延迟加载给headBar提供请求时间
            waitTime=1000;
        }

        var run=setTimeout(function() {
            var type, url;
            $scope.videoDes='';
            var labels=[];
            $scope.videoDiv_show=true;
            $scope.screenImg_show=false;
            $scope.screenImg='images/head.jpg';
            $scope.label_culture=false;$scope.label_art=false;$scope.label_car=false;$scope.label_science=false;
            $scope.label_entertainment=false;$scope.label_finance=false;$scope.label_current=false;$scope.label_video=false;
            $scope.label_health=false;$scope.label_travel=false;$scope.label_sports=false;$scope.label_life=false;$scope.label_fashion=false;
            var labelChange=function(){
                labels=[];
                if($scope.label_zixun){labels.push("资讯");}
                if($scope.label_yule){labels.push("娱乐");}
                if($scope.label_car){labels.push("汽车");}
                if($scope.label_sports){labels.push("体育");}
                if($scope.label_live){labels.push("生活");}
                if($scope.label_health){labels.push("健康");}
                if($scope.label_art){labels.push("艺术");}
                if($scope.label_video){labels.push("短视频");}
                console.log(labels)
            };
            $scope.upVideo=function(){
                labelChange();//获取标签
                if(labels==[]||$scope.videoDes==''||$('#upVideo')[0].files==undefined){
                    alert('请填写完整！')
                }else{
                    $http({       //传视频
                        url:'http://localhost:8000/upload.html',
                        method: 'POST',
                        headers: {
                            'Content-Type': undefined
                        },
                        transformRequest: function() {
                            var formData = new FormData();
                            formData.append('file0',$('#upVideo')[0].files[0]);
                            return formData;
                        }
                    }).then(function (data) {
                        console.log(data.data)
                        var type='';
                        var videoUrl='';
                        if(data.data!="not allowed") {
                            $scope.videoDiv_show=false;
                            $scope.screenImg_show=true;
                            $scope.screenImg=data.data[0].image;
                            videoUrl=data.data[0].video;
                            type=data.data[0].type;
                            var video={name:$stateParams.name,des:$scope.videoDes,url:videoUrl,label1:labels[0],label2:labels[1],label3:labels[2],type:type,image:data.data[0].image};
                            $scope.videoType=video.type;
                            $scope.videoUrl=video.url.split('/');
                            $scope.videoUrl=$scope.videoUrl[$scope.videoUrl.length-1];
                            var screenImg=angular.element(document.querySelectorAll('#screenImg'));
                            var videoImg=angular.element(document.querySelectorAll('#videoImg'));
                            if(videoImg.length==0){
                              var img='<img id="videoImg" ui-sref="myVideo({name:&#39;{{userName}}&#39;,videoUrl:&#39;{{videoUrl}}&#39;,videoType:&#39;{{videoType}}&#39;,title:&#39;'+video.des+'&#39;})" style="width:220px;height:120px;" ng-show="screenImg_show"  src="{{screenImg}}"/>'
                              img=$compile(img)($scope);
                              screenImg.append(img);
                            }
                            console.log($scope.videoUrl)
                            video=JSON.stringify(video);
                            $http({url:'http://localhost:3000/upVideo',//更新此用户videos字段
                                method: 'POST',
                                data:{video:video},
                                withCredentials: true
                            }).then(function(result){

                            }).catch(function(err){
                                console.log(err)
                            });
                        }
                    }).catch(function(err) {
                        console.log(err);
                    })
                }
            };
            var videoUl=angular.element(document.querySelectorAll('#videos_ul'));
            //获取视频数据
            $http({
                url: 'http://localhost:3000/videos',
                params: {name: $stateParams.name},
                method: 'GET',
                withCredentials: true
            }).then(function (result) {
                $scope.videos = result.data;
                $scope.pages_show=false;
                $scope.ellipsis_show=false;
                console.log($scope.videos)
                type=$scope.videos[0].type;
                url=$scope.videos[0].url;
                $scope.videoTitle=$scope.videos[0].des;
                for(var i=0;i<5;i++){
                    var url1=$scope.videos[i].url.split('/');
                    url1=url1[url1.length-1];
                    var video=' <li ui-sref="myVideo({name:&#39;'+$stateParams.name+'&#39;,videoUrl:&#39;'+url1+'&#39;,videoType:&#39;'+$scope.videos[i].type+'&#39;,title:&#39;'+$scope.videos[i].des+'&#39;})"  class="video_item">'
                             +'<div style="width:210px;padding:20px;">'
                             +'<div style="display:inline-block;vertical-align:top;" class="videoImg"><img src="'+$scope.videos[i].image+'" style="width:100px;display:inline-block;vertical-align:top;height:60px;"/></div>'
                             +'<div style="display:inline-block;vertical-align:top;"><p style="width:100px;color:#196c6e;font-size:12px;display:inline-block;vertical-align:top;line-height:20px;height:60px;overflow:hidden;">'+$scope.videos[i].des+'</p></div>'
                             +'</div>'
                             +'</li>';
                    video=$compile(video)($scope);
                    videoUl.append(video);
                }
                var Pages=angular.element(document.querySelectorAll('#pages'));
                var countPage,countGroup,remainder;
                if($scope.videos.length>5){
                    $scope.pages_show=true;
                     countPage=Math.floor($scope.videos.length/5);
                     countGroup=Math.floor(countPage/5);
                     remainder=countPage%5;
                    if(remainder>0){
                        countGroup=countGroup+1;
                    }
                    if(countPage>5){
                        $scope.ellipsis_show=true;
                        var pages='<p ng-click="pageTo(1)" class="page_button">1</p>' +
                            '<p ng-click="pageTo(2)" class="page_button">2</p>' +
                            '<p ng-click="pageTo(3)" class="page_button">3</p>' +
                            '<p ng-click="pageTo(4)" class="page_button">4</p>' +
                            '<p ng-click="pageTo(5)" class="page_button">5</p>';
                        pages=$compile(pages)($scope);
                        Pages.append(pages);
                    }else{
                        for(var k=0;k<countPage.length;k++){
                            var target=k+1;
                           var  pages1='<p ng-click="pageTo('+target+')" class="page_button">'+target+'</p>';
                            pages1=$compile(pages1)($scope);
                            Pages.append(pages1);
                        }
                    }

                }else{
                    $scope.pages_show=false;
                }
                var currentGroup=1;
                $scope.nextGroup=function(){
                    currentGroup+=1;
                    Pages.empty();
                    if(currentGroup==countGroup&&remainder>0){
                        $scope.ellipsis_show=false;
                        for(var l=0;l<remainder;l++){
                            var target2=l+1+(currentGroup-1)*5;
                            var  pages2='<p ng-click="pageTo('+target2+')" class="page_button">'+target2+'</p>';
                            pages2=$compile(pages2)($scope);
                            Pages.append(pages2);
                        }
                    }else{
                        for(var k=0;k<5;k++){
                            var target=k+1+(currentGroup-1)*5;
                            var  pages1='<p ng-click="pageTo('+target+')" class="page_button">'+target+'</p>';
                            pages1=$compile(pages1)($scope);
                            Pages.append(pages1);
                        }
                    }
                };
                $scope.preGroup=function(){
                    currentGroup-=1;
                    Pages.empty();
                    for(var k=0;k<5;k++){
                        var target=k+1+(currentGroup-1)*5;
                        var  pages1='<p ng-click="pageTo('+target+')" class="page_button">'+target+'</p>';
                        pages1=$compile(pages1)($scope);
                        Pages.append(pages1);
                    }
                };
                $scope.pageTo=function(page){
                    var start=5*(page-1);
                    videoUl.empty();
                    for(var i=0;i<5;i++){
                        var url1=$scope.videos[i+start].url.split('/');
                        url1=url1[url1.length-1];
                        var video=' <li ui-sref="myVideo({name:&#39;'+$stateParams.name+'&#39;,videoUrl:&#39;'+url1+'&#39;,videoType:&#39;'+$scope.videos[i+start].type+'&#39;,title:&#39;'+$scope.videos[i+start].des+'&#39;})"  class="video_item">'
                            +'<div style="width:210px;padding:20px;">'
                            +'<div style="display:inline-block;vertical-align:top;" class="videoImg"><img src="'+$scope.videos[i+start].image+'" style="width:100px;display:inline-block;vertical-align:top;height:60px;"/></div>'
                            +'<div style="display:inline-block;vertical-align:top;"><p style="width:100px;color:#196c6e;font-size:12px;display:inline-block;vertical-align:top;line-height:20px;height:60px;overflow:hidden;">'+$scope.videos[i+start].des+'</p></div>'
                            +'</div>'
                            +'</li>';
                        video=$compile(video)($scope);
                        videoUl.append(video);
                    }
                };
                //加载视频
                if (flvjs.isSupported()) {
                    if ($stateParams.videoUrl!='default') {
                        type = $stateParams.videoType;
                        url = 'http://localhost:8000/videos/' + $stateParams.videoUrl;
                        alert($stateParams.videoType + ' ' + $stateParams.videoUrl)
                        $scope.videoTitle= $stateParams.title;
                    }
                    var flvPlayer = flvjs.createPlayer({
                        type: type,
                        url: url
                    });
                    flvPlayer.attachMediaElement(videoElement);
                    flvPlayer.load(); //加载
                }
            }).catch(function (err) {
                console.log(err)
            });

        },waitTime)

    }])








