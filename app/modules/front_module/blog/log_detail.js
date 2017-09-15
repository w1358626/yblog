'use strict';

angular.module('myApp.logDetail',['ui.router'])

   .controller('LogDetailCtrl',['$scope','locals','$stateParams','$http',function($scope,locals,$stateParams,$http){

       $scope.userName=$stateParams.name;


   }])
    .directive('comments',function(){
        return{
            scope: {},
            restrict:'AE',
            templateUrl:'directives/comments.html;',
            link:function($scope,elm,attr){

            },
            controller:function($scope,$element,$attrs,locals,$http,$compile,$stateParams,$timeout){
                var waitTime=5;
                var stateName=locals.getObj('stateName',1000*3600*24);
                var title=$element.find('#article_title');
                if(stateName!=$stateParams.name||locals.get('upPost')){//访问的博客路径name改变时，需延迟加载给headBar提供请求时间
                    waitTime=1000;
                }
                var run=$timeout(function(){
                    //文章部分
                    $scope.title='';
                    $scope.postTime='';
                    var article_html;
                    $scope.countClick='';
                    $scope.comments=[];
                    var postId=$stateParams.postId;
                    var comments_ul=$element.find('#comment_ul');
                    var article=$element.find('.article_content');
                    console.log(postId)
                    $http({
                        params:{id:postId},
                        url:"http://localhost:3000/post_Id",
                        method:'GET',
                        withCredentials: true
                    }).then(function(result){
                        var post=result.data;
                        $scope.title=post.title;
                        var num=0;
                        var reg = /[a-zA-Z0-9-_^~%&'.,;=?$\x22\s]/;
                        for(var k=0;k<$scope.title.length;k++){
                            if(reg.test($scope.title[k])){
                                num++;
                            }
                        }
                        var titleWidth=17*($scope.title.length-num)+num*9;
                        title.css({'width':titleWidth+'px','margin':'20px auto'});
                        $scope.postTime=post.time;
                        article_html=post.article;
                        article.append(article_html);
                        $scope.countClick=post.countClick;
                        $scope.comments=post.comments;
                        for(var i=0;i<$scope.comments.length;i++){
                            if($scope.comments[i]!=undefined){
                                var html='<li><div><a  style="cursor:pointer;"><p class="author" ng-bind="comments['+i+'].name"></p></a></div><p class="comment_body" ng-bind="comments['+i+'].content"></p></li>';
                                html=$compile(html)($scope);
                                comments_ul.append(html);
                            }
                        }
                        console.log(post)
                    });

                    //评论部分
                    $scope.myComment='我来说两句……';
                    $scope.myname=locals.getObj('lastName',1000*3600*24);
                    $scope.myhead=locals.get('myHead');
                    if(!$scope.myhead){
                        $scope.myhead='images/headDefault.png'
                    }
                    $scope.postComment=function(){
                        var html='<li><div><a  style="cursor:pointer;"><p class="author" ng-bind="myname"></p></a></div><p class="comment_body">'+$scope.myComment+'</p></li>';
                        html=$compile(html)($scope);
                        comments_ul.append(html);
                        var myComment={name:$scope.myname,content:$scope.myComment};

                        $scope.comments.splice(0,0,myComment);
                        var comments=JSON.stringify($scope.comments);
                        $scope.myComment="";
                        $http({
                            url:'http://localhost:3000/upComment',
                            data:{id:postId,comments:comments},
                            method:'POST',
                            withCredentials: true
                        }).then(function(result){

                        }).catch(function(err){
                            console.log(err)
                        })
                    };
                },waitTime)


            }
        }
    })