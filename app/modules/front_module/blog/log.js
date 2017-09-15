'use strict';

angular.module('myApp.log', ['ui.router'])


    .controller('LogCtrl', ['$scope','$rootScope','locals','$stateParams','$compile','$http','$state',function($scope,$rootScope,locals,$stateParams,$compile,$http,$state) {

        $scope.upVideo_show=false;
        $scope.showUpVideo=function(){
            $scope.upVideo_show=!$scope.upVideo_show;
        };
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
                    var videoImg=angular.element(document.querySelectorAll('#videoImg'));
                    var screenImg=angular.element(document.querySelectorAll('#screenImg'));
                    if(videoImg.length==0) {
                        var img = '<img id="videoImg" ui-sref="myVideo({name:&#39;{{userName}}&#39;,videoUrl:&#39;{{videoUrl}}&#39;,videoType:&#39;{{videoType}}&#39;,title:&#39;' + video.des + '&#39;})" style="width:220px;height:120px;" ng-show="screenImg_show"  src="{{screenImg}}"/>'
                        img = $compile(img)($scope);
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

        //权限管理
        var permission=locals.getObj('permission',1000*3600*24);
        var loginName=locals.getObj('lastName',1000*3600*24);
        $scope.userName=$stateParams.name;
        if(loginName==(null||undefined||'')&&permission.logs!='all'){
            $state.go('notLogin',{name:$stateParams.name})
        }
        var isFans=false,isFriend=false;
        if(loginName!=$stateParams.name){//不是博主就判断访问权限
          if(permission.logs=='fans'){
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
          if(permission.logs=='friend'){
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
          if(permission.logs=='private'){
              $state.go('notPerm',{name:$stateParams.name})
          }
        }

        //加载延迟设定
        var waitTime=5;
        var stateName=locals.getObj('stateName',1000*3600*24);
        if(stateName!=$stateParams.name||locals.get('upPost')){//访问的博客路径name改变时，需延迟加载给headBar提供请求时间
            waitTime=1000;
        }
        var articleList=angular.element(document.querySelectorAll('#article_list'));
        $scope.write_log=function(){
            $rootScope.witeType="log";
        };

        //主要交互逻辑
        var run=setTimeout(function(){
            $scope.posts=[];
            var friend=[$stateParams.name];
            friend=JSON.stringify(friend);
            if(friend.length>0){
                $http({url:'http://localhost:3000/fPosts',
                    data:{friends:friend},
                    method:'POST',
                    withCredentials: true
                }).then(function(result){
                    var lastPosts=[];
                    var posts=result.data;
                    var date=new Date();
                    var current=date.getTime();
                    //遍历发布3天内的文章
                    for(var i=0;i<posts.length;i++){
                        var time=Number(posts[i].postId);
                        if((current-time)<1000*3600*24*100){
                            lastPosts.push(posts[i]);
                        }
                    }
                    //获取文章列表需要的信息
                    for(var j=0;j<lastPosts.length;j++){
                        var div=document.createElement('div');
                        div.innerHTML=lastPosts[j].article;
                        var p=div.getElementsByTagName('p');
                        var img=div.getElementsByTagName('img');
                        $scope.name=lastPosts[j].name;
                        var postTime=lastPosts[j].time;
                        var count=lastPosts[j].countClick;
                        $scope.id=lastPosts[j].postId;
                        var comments=lastPosts[j].comments;
                        var title=lastPosts[j].title;
                        var html='<li class="article">'
                            +'<a  style="cursor:pointer;"><div class="article_title" ><h4  id="title'+j+'" >'+title+'</h4></div>'
                            +'<div id="p'+j+'" class="article_content"></div>'
                            +'<p class="ellipsis">…</p>'
                            +'</a>'
                            +'<div class="pub_time"><span>'+postTime+'</span><span> 阅读（'+count+'）</span><span><a  style="cursor:pointer;"> 评论（'+comments.length+'）</a></span><p  ui-sref="logDetail({postId:&#39;{{id}}&#39;,name:&#39;{{name}}&#39;})" class="complete"><a  style="cursor:pointer;">阅读全文 》</a></p></div>'
                            +'<div><a  style="cursor:pointer;"><p class="author"  ui-sref="showInfo({name:&#39;{{name}}&#39;})"><span>作者：</span>'+$scope.name+'</p></a></div>'
                            +'</li>';
                        html=$compile(html)($scope);
                        articleList.append(html);
                        var content=angular.element(document.querySelectorAll('#p'+j+''));
                        var h4=angular.element(document.querySelectorAll('#title'+j+''));
                        var p_img=p[0].getElementsByTagName('img');
                        content.append(img[0]);
                        p[0].remove(p_img);
                        content.append(p[0]);
                        var num=0;
                        var reg = /[a-zA-Z0-9-_^~%&'.,;=?$\x22\s]/;
                        for(var k=0;k<title.length;k++){
                            if(reg.test(title[k])){
                                num++;
                            }
                        }
                        var titleWidth=17*(title.length-num)+num*9;
                        h4.css({'width':titleWidth+'px','margin':'20px auto'});
                    }
                }).catch(function(err){
                    console.log(err)
                })
            }
        },waitTime);




    }]);