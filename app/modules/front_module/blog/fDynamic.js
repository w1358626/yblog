'use strict';

angular.module('myApp.fDynamic', ['ui.router'])


    .controller('FDynamicCtrl', ['$rootScope','$scope','locals','$http','$stateParams','$compile',function($rootScope,$scope,locals,$http,$stateParams,$compile) {
        //权限管理
        var permission=locals.getObj('permission',1000*3600*24);
        var loginName=locals.getObj('lastName',1000*3600*24);
        $scope.userName=$stateParams.name;
        $scope.no_article=false;
        if(loginName==(null||undefined||'')&&permission.dynamic!='all'){
            $state.go('notLogin',{name:$stateParams.name})
        }
        var isFans=false,isFriend=false;
        if(loginName!=$stateParams.name){//不是博主就判断访问权限
            if(permission.dynamic=='fans'){
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
            if(permission.dynamic=='friend'){
                var friend=locals.getObj('friend',1000*3600*24);
                if(!friend){
                    friend=[];
                }else {
                    for (var j = 0; j < friend.length; j++) {
                        if (friend[j] == loginName) {
                            isFriend = true;
                        }
                    }
                }
                if(!isFriend){
                    $state.go('notPerm',{name:$stateParams.name})
                }
            }
            if(permission.dynamic=='private'){
                $state.go('notPerm',{name:$stateParams.name})
            }
        }
        //主要交互逻辑
        var waitTime=5;
        var stateName=locals.getObj('stateName',1000*3600*24);
        $scope.userName=$stateParams.name;
        var articleList=angular.element(document.querySelectorAll('#article_list'));
        if(stateName!=$stateParams.name||locals.get('upPost')){//访问的博客路径name改变时，需延迟加载给headBar提供请求时间
            waitTime=1000;
        }
        var run=setTimeout(function(){
            //好友列表
            $scope.fans=locals.getObj('fans',1000*3600*24);
            $scope.focus=locals.getObj('focus',1000*3600*24);
            $scope.friend=locals.getObj('friend',1000*3600*24);
            $scope.focus_on=true;$scope.focus_off=false;
            $scope.fans_on=false;$scope.fans_off=true;
            $scope.friend_on=false;$scope.friend_off=true;
            $scope.friends=locals.getObj('focus',1000*3600*24);
            $scope.getFans=function(){
                $scope.friends=locals.getObj('fans',1000*3600*24);
                $scope.fans_on=true;$scope.fans_off=false;
                $scope.focus_on=false;$scope.focus_off=true;
                $scope.friend_on=false;$scope.friend_off=true;
            };
            $scope.getFocus=function(){
                $scope.friends=locals.getObj('focus',1000*3600*24);
                $scope.focus_on=true;$scope.focus_off=false;
                $scope.fans_on=false;$scope.fans_off=true;
                $scope.friend_on=false;$scope.friend_off=true;
            };
            $scope.getFriend=function(){
                var friends=locals.getObj('friend',1000*3600*24);
                friends=JSON.stringify(friends);
                $http({url:'http://localhost:3000/friend_head',
                      data:{friends:friends},
                      method:'POST',
                      withCredentials: true
                }).then(function(result){
                    $scope.friends=result.data;
                    console.log(result.data)
                    $scope.focus_on=false;$scope.focus_off=true;
                    $scope.fans_on=false;$scope.fans_off=true;
                    $scope.friend_on=true;$scope.friend_off=false;
                }).catch(function(err){
                    console.log(err)
                });
            };
            //博友动态
            $scope.posts=[];
            var friend=locals.getObj('friend',1000*3600*24);
            if(friend.length>0){
                friend=JSON.stringify(friend);
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
                console.log(lastPosts)
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
                     +'<div class="pub_time"><span>'+postTime+'</span><span> 阅读（'+count+'）</span><span><a  style="cursor:pointer;"> 评论（'+comments.length+'）</a></span><p  ui-sref="logDetail({postId:&#39;{{id}}&#39;,name:&#39;{{userName}}&#39;})" class="complete"><a  style="cursor:pointer;">阅读全文 》</a></p></div>'
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
            }else{
                $scope.no_article=true;
            }
        },waitTime);

    }]);