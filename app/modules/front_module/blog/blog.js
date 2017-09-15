'use strict';

angular.module('myApp.blog', ['ui.router','ui.bootstrap'])


    .controller('BlogCtrl', ['$scope','$rootScope', '$http','$state','locals','$stateParams','$compile',function($scope,$rootScope,$http,$state,locals,$stateParams,$compile){

        var waitTime=5;
        var stateName=locals.getObj('stateName',1000*3600*24);
        $scope.userName=$stateParams.name;
        var articleList=angular.element(document.querySelectorAll('#article_list'));
        if(stateName!=$stateParams.name||locals.get('upPost')){//访问的博客路径name改变时，需延迟加载给headBar提供请求时间
            waitTime=1000;
        }
        var run=setTimeout(function(){
            $scope.posts=[];
            $scope.no_article=false;
            var friend=locals.getObj('focus',1000*3600*24);
            if(!angular.isArray(friend)){
                friend=[];
            }
            console.log(friend)
            for(var i=0;i<friend.length;i++){
                friend[i]=friend[i].name;
            }

            if(friend.length>0){
                friend=JSON.stringify(friend);
                $http({url:'http://localhost:3000/fPosts',
                    data:{friends:friend},
                    method:'POST',
                    withCredentials: true
                }).then(function(result){
                    var lastPosts=[];
                    var posts=result.data;
                    console.log(posts)
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
                            +'<div  id="p'+j+'" class="article_content"></div>'
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
            //更新lastLogin
            var date=new Date();
            $scope.lastLogin=date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
                date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
            var upLoginTime=setTimeout(function(){         //请求太多须延时，以免多请求后端操作数据造成混乱
                $http({url:"http://localhost:3000/lastLogin",
                    data:{lastLogin:$scope.lastLogin},
                    method:'POST',
                    withCredentials: true
                })
                    .then(function(result){

                    }).catch(function(err){
                    console.log(err)
                })
            },500);
        },waitTime);

    }]);

