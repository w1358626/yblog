app.directive('slider',[function(){
    return {
        scope:{},
        restrict:'AE',
        templateUrl:'modules/front_module/home/slider.html',
        link:function($scope,elm,attr,controller,$interval){


        },
        controller:function($scope,$element,$attrs,$interval,$timeout) {

            var sliderxh = 0;
            var flag= undefined;
            $scope.slidershow = [];
            $scope.slidershow[0] = true;
            $scope.slidershow[1] = false;
            $scope.slidershow[2] = false;
            $scope.slidershow[3] = false;
            $scope.slidershow[4] = false;

            $scope.setslider = function (x) {
                $scope.slidershow[sliderxh] = false;
                $scope.slidershow[x] = true;
                sliderxh = x;
                flag=1;
                $timeout(function(){flag= undefined;},3000);
            };

            $scope.sliderpre = function () {
                $scope.slidershow[sliderxh] = false;
                sliderxh--;
                if(sliderxh<0){
                    sliderxh = sliderxh+100;
                    sliderxh = sliderxh % 5;
                }
                $scope.slidershow[sliderxh] = true;
                flag=1;
                $timeout(function(){flag= undefined;},3000);
            };

            $scope.slidernext=function(){
                $scope.slidershow[sliderxh] = false;
                sliderxh++;
                sliderxh = sliderxh % 5;
                $scope.slidershow[sliderxh] = true;
                flag=1;
                $timeout(function(){flag= undefined;},3000);
            };

            var autoplay = $interval(function () {
                if(flag==1){
                    $scope.slidershow[sliderxh] =true;
                } else{ $scope.slidershow[sliderxh] = false;
                    sliderxh++;
                    sliderxh = sliderxh % 5;
                    $scope.slidershow[sliderxh] =true ;}

            }, 5000);
        }
    };
}]);


app.directive('toolbarTip', function() {
    return {
        // Restrict it to be an attribute in this case
        restrict: 'A',
        // responsible for registering DOM listeners as well as updating the DOM
        link: function(scope, element, attrs) {
            $(element).toolbar(scope.$eval(attrs.toolbarTip));
        }
    };
});

app.directive('contenteditable', function() {
    return {
        restrict: 'A' ,
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            // 创建编辑器
            var editor = new wangEditor('editor-trigger');
            editor.onchange = function () {
                // 从 onchange 函数中更新数据
                scope.$apply(function () {
                    var html = editor.$txt.html();
                    ctrl.$setViewValue(html);
                });
            };
            editor.create();
        }
    };
});

app.directive('statusBar',[function(){
    return {
        scope: {},
        restrict: 'AE',
        templateUrl: 'directives/statusBar.html',
        link: function ($scope, elm, attr, controller, $interval) {

        },
        controller:function($scope,$http,$state,locals,$compile){
            $scope.user_name="";
            $scope.user_password="";
            $scope.loginBtn_Show=true;
            $scope.loginShow=false;
            $scope.blogBtn_show=false;
            $scope.rem_pwd=false;
            var userLogin=angular.element(document.querySelectorAll("#user_login"));
            var loginErr=angular.element(document.querySelectorAll("#login_err"));
            var blogBtn=angular.element(document.querySelectorAll("#blog_btn"));

            //获取user session
            var getUserSession=function(){
                $http({url:"http://localhost:3000/checkLogin",
                    method:'GET',
                    withCredentials: true
                }).
                then(function(result){

                    if(result.data.name!=undefined){
                        $scope.userName=result.data.name;
                        var html="<span ui-sref='blog({name:&#39;{{userName}}&#39;})'  ng-show='blogBtn_show'  style='background:darkred;padding:10px 5px;color:#c4c4c4;font-weight:bold;margin-left:10px;' >进入博客</span>";
                        html=$compile(html)($scope);
                        blogBtn.append(html);
                        var text;
                        $scope.loginShow=false;
                        $scope.loginBtn_Show=false;
                        $scope.blogBtn_show=true;
                        var user= result.data;
                        locals.set('myName',user.name);//我登录的用户名
                        locals.set('postTypes',user.postTypes);
                        locals.set('name',user.name);
                        locals.setObj('myFocus',user.focus);
                        locals.setObj('friend',user.friend);
                        locals.setObj('myFriend',user.friend);
                        locals.setObj('permission',user.permissions);
                        locals.setObj('photoBooks',user.photoBooks);
                        locals.setObj('myInfo',user.myInfo);
                        locals.setObj('myMessages',user.messages);
                        locals.setObj('lastName',user.name);
                        locals.setObj('fans',user.fans);
                        locals.setObj('focus',user.focus);
                        locals.set('lastLogin',user.lastLogin);
                        locals.set('myHead',user.headImg);
                        text="<a style='margin-left:20px;'>欢迎回来!</a><a  style='text-decoration:underline;'>"+user.name+"</a>";
                        userLogin.html(text);
                    }else{
                        text="<a>您好,请登录!</a>";
                        $scope.loginBtn_Show=true;
                        userLogin.html(text);
                    }
                }).catch(function(err){
                    console.log(err)
                })

            };

            if(locals.get('name')){
                $scope.userName=locals.get('name');
                $scope.loginShow=false;
                $scope.loginBtn_Show=false;
                $scope.blogBtn_show=true;
                text="<a style='margin-left:20px;'>欢迎回来!</a><a  style='text-decoration:underline;'>"+ $scope.userName+"</a>";
                userLogin.html(text);
                //添加进入博客button
                var html="<span ui-sref='blog({name:&#39;{{userName}}&#39;})'  ng-show='blogBtn_show'  style='background:darkred;padding:10px 5px;color:#c4c4c4;font-weight:bold;margin-left:10px;' >进入博客</span>";
                html=$compile(html)($scope);
                blogBtn.append(html);
            }else{
                getUserSession();
            }
            //登录button点击事件
            $scope.login_show=function(){
                $scope.loginShow=!$scope.loginShow;
            };
            //提交登录逻辑
            $scope.login=function(){
                $http({url:"http://localhost:3000/login",
                    data:{name:$scope.user_name,password:$scope.user_password,remPwd:$scope.rem_pwd},
                    method:'POST',
                    withCredentials: true
                })
                    .then(function(result){
                        $scope.userName=result.data.name;
                        var html="<span ui-sref='blog({name:&#39;{{userName}}&#39;})'  ng-show='blogBtn_show'  style='background:darkred;padding:10px 5px;color:#c4c4c4;font-weight:bold;margin-left:10px;' >进入博客</span>";
                        html=$compile(html)($scope);
                        blogBtn.append(html);
                        if(result.data.name==false){
                            loginErr.text("*用户名错误!").css({'color':'red'})
                        }
                        if(result.data.password==false){
                            loginErr.text("*密码错误!").css({'color':'red'})
                        }
                        if(result.data.name==true&&result.data.password==true){
                            $scope.loginShow=false;
                            $scope.loginBtn_Show=false;
                            $scope.blogBtn_show=true;
                            var user=result.data;
                            locals.set('myName',user.name);//我登录的用户名
                            locals.set('countPost',user.countPost);
                            locals.set('postTypes',user.postTypes);
                            locals.set('name',user.name);
                            locals.setObj('myFocus',user.focus);
                            locals.setObj('friend',user.friend);
                            locals.setObj('myFriend',user.friend);
                            locals.setObj('permission',user.permissions);
                            locals.setObj('photoBooks',user.photoBooks);
                            locals.setObj('myMessages',user.messages);
                            locals.setObj('lastName',user.name);
                            locals.setObj('fans',user.fans);
                            locals.setObj('focus',user.focus);
                            locals.set('lastLogin',user.lastLogin);
                            locals.set('myHead',user.headImg);
                            text="<a style='color:#fff;margin-left:20px;'>欢迎回来!</a><a  style='color:#fff;text-decoration:underline;'>"+user.name+"</a>";
                            userLogin.html(text);
                            loginErr.text("");
                           // getTypePosts();//更新文章分类
                        }
                    }).catch(function(err){
                    console.log(err)
                })
            };
            /* var notActive=setTimeout(function(){   //访问删除七天未激活用户接口
             $http({url:"http://localhost:3000/not_active",
             method:'GET',
             withCredentials: true
             }).then(function(result){
             var outTimeUsers=result.data;
             }).catch(function(err){
             console.log(err)
             });
             },3000);*/

            $scope.logout=function(){
                $http({url:"http://localhost:3000/logout",
                    method:'GET',
                    withCredentials: true
                }).
                then(function(result){
                    var text="<a style='margin-left:30px;'>您好,请登录!</a>";
                    $scope.loginBtn_Show=true;
                    $scope.blogBtn_show=false;
                    userLogin.html(text);
                    locals.set('myName','');//清除我的登录名
                    locals.setObj('lastName','');
                }).catch(function(){

                })
            }
        }
       }
    }]);

app.directive('headBar',[function(){
    return {
        scope: {},
        restrict: 'AE',
        templateUrl: 'directives/headBar.html',
        link: function ($scope, elm, attr, controller, $interval) {

        },
        controller:function($scope,$http,$state,locals,$stateParams,$compile,$timeout){
            $scope.name=$stateParams.name;
            var loginTip=angular.element(document.querySelectorAll('#login_tip'));
            $scope.set_show=false;
            $scope.not_read=false;
            $scope.toHome=function(){
                locals.set('name','');
            };
            $scope.logout=function(){
                $http({url:"http://localhost:3000/logout",
                    method:'GET',
                    withCredentials: true
                }).
                then(function(result){
                    locals.setObj('lastName','');
                    var text='游客，<a  ui-sref="home.headline" style="color:#ccc;font-size:12px;text-decoration:underline;cursor:pointer;">去登录</a>';
                    loginTip.html(text);
                    locals.set('myName','');
                    locals.setObj('lastName','');
                }).catch(function(){

                })
            };
            var getUser=function(){
                $http({
                    url: 'http://localhost:3000/userData',
                    data: {name: $stateParams.name},
                    method: 'POST',
                    withCredentials: true
                }).then(function (result) {
                    console.log('userData'+result.data)
                    var user=result.data.user;
                    locals.setObj('myInfo',user.myInfo);
                    locals.set('postTypes', user.postTypes);
                    locals.set('name', user.name);
                    locals.set('hostName', user.name);//别人的用户名
                    locals.setObj('fans', user.fans);
                    locals.setObj('messages',user.messages);
                    locals.setObj('focus', user.focus);
                    locals.setObj('friend',user.friend);
                    locals.setObj('blogDes',user.blogDes);
                    locals.setObj('permission',user.permissions);
                    locals.set('lastLogin', user.lastLogin);
                    locals.set('headImg', user.headImg);
                    locals.setObj('photoBooks',user.photoBooks);
                   //本地缓存分类文章type_posts
                    var type_posts=result.data.typePosts;
                    locals.set('countPosts',type_posts.length);
                    locals.setObj('type_posts',type_posts);
                    locals.set('upPost','');//清空文章更新标志
                    locals.setObj('stateName',$stateParams.name);
                   //top posts
                    locals.setObj('topPosts',result.data.topPosts);

                }).catch(function (err) {
                    console.log(err)
                });

            };
            //检查new messages
            var haveNewMes=$timeout(function(){
                var messages=locals.getObj('messages',1000*3600*24);
                if(messages){
                    for(var i=0;i<messages.length;i++){
                        if(messages[i].read==false){
                            $scope.not_read=true;
                        }
                    }
                }
            },1000);
            //消息图标点击事件
            $scope.reading=function(){
                $scope.not_read=false;
                locals.set('upPost',true);
            };

                //判断是否有博主权限
                if(locals.getObj('lastName',1000*360*24)==$stateParams.name){
                    console.log("是博主")
                    $scope.set_show=true;
                    locals.set('isHost',true);
                    if(!locals.get('name')){
                    var freshName=locals.getObj('lastName',1000*360*24);
                    locals.set('name',freshName);
                    }
                    var text1="<b style='color:#cbcbcb;margin-left:20px;'>欢迎回来，</b><b  style='text-decoration:underline;color:#dacd42;'>"+$stateParams.name+"</b>";
                    text1=$compile(text1)($scope);
                    loginTip.html(text1);

                }else{
                    if(locals.getObj('lastName',1000*3600*24)){
                        var name=locals.getObj('lastName',1000*3600*24);
                        var text2="<b style='color:#cbcbcb;margin-left:20px;'>欢迎访问，</b><b  style='text-decoration:underline;color:#cacaca;'>"+name+"</b>";
                        loginTip.html(text2);
                    }else{
                    locals.set('name',$stateParams.name);
                    var text3='游客，<a ui-sref="home.headline" style="color:#ccc;font-size:12px;text-decoration:underline;">去登录</a>';
                    loginTip.html(text3);
                    }
                    console.log("不是博主")
                    locals.set('isHost','');
                }
                window.onunload=function(){
                    locals.set('upPost',true);
                };

            if(locals.get('name')!=$stateParams.name||locals.get('upPost')){
                getUser();//获取用户信息
            }
        }
    }
}]);

app.directive('postTypes',[function(){
    return {
        scope: {},
        restrict: 'AE',
        transclude: true,
        template: '<div class="my_type" ng-transclude><h4>文章分类</h4></div>',
        link: function ($scope, elm, attr, controller, $interval) {


        },
        controller: function ($scope, $element, $attrs,locals,$compile,$timeout,$stateParams) {
            var waitTime=50;
            var stateName=locals.getObj('stateName',1000*3600*24);
            if(stateName!=$stateParams.name||locals.get('upPost')){//访问的博客路径name改变时，需延迟加载给headBar提供请求时间
                waitTime=300;
            }
           var run=$timeout(function(){
               $scope.posts0_show=false;$scope.posts1_show=false;$scope.posts2_show=false;$scope.posts3_show=false;$scope.posts4_show=false;
               $scope.posts5_show=false;$scope.posts6_show=false;$scope.posts7_show=false;$scope.posts8_show=false;$scope.posts9_show=false;
               $scope.id="";

               $scope.type0_click=function(){
                   $scope.posts0_show=!$scope.posts0_show;
               };
               $scope.type1_click=function(){
                   $scope.posts1_show=!$scope.posts1_show;
               };
               $scope.type2_click=function(){
                   $scope.posts2_show=!$scope.posts2_show;
               };
               $scope.type3_click=function(){
                   $scope.posts3_show=!$scope.posts3_show;
               };
               $scope.type4_click=function(){
                   $scope.posts4_show=!$scope.posts4_show;
               };
               $scope.type5_click=function(){
                   $scope.posts5_show=!$scope.posts5_show;
               };
               $scope.type6_click=function(){
                   $scope.posts6_show=!$scope.posts6_show;
               };
               $scope.type7_click=function(){
                   $scope.posts7_show=!$scope.posts7_show;
               };
               $scope.type8_click=function(){
                   $scope.posts8_show=!$scope.posts8_show;
               };
               $scope.type9_click=function(){
                   $scope.posts9_show=!$scope.posts9_show;
               };
               $scope.postTypes=locals.get('postTypes');
               console.log($scope.postTypes)
               var posts=[];
               var postTypes=$scope.postTypes.split(",");
               var type_posts=locals.getObj('type_posts',1000*3600*24*3);
               console.log(type_posts)
               for(var n=0;n<postTypes.length;n++){
                   posts[n]=[];
                   for(var m=0;m<type_posts.length;m++){
                       if(type_posts[m].type==postTypes[n]){
                           posts[n].push(type_posts[m]);
                       }
                   }
               }
               console.log(posts)
               for(var i=0;i<postTypes.length;i++){
                   if(postTypes[i]){
                       var type=postTypes[i].split('-');
                       type=type[1];
                       var html= '<p ng-click="type'+i+'_click()"><a href="">'+type+'('+posts[i].length+')</a></p>'
                           +'<ul class="posts_title" ng-show="posts'+i+'_show"></ul>';
                       html=$compile(html)($scope);
                       $element.append(html);
                       //遍历posts title
                       var postsTitle=angular.element(document.querySelectorAll('.posts_title'));
                       for(var j=0;j<posts[i].length;j++){
                           $scope.id=posts[i][j].postId;
                           $scope.name=$stateParams.name;
                           var title='<li class="post_title" ><a name="{{id}}" ui-sref="logDetail({postId:&#39;{{id}}&#39;,name:&#39;{{name}}&#39;})">'+posts[i][j].title+'</a></li>'; //
                           title=$compile(title)($scope);
                           postsTitle.eq(i).append(title);
                       }
                   }
               }
           },waitTime)
        }
    }
}]);

app.directive('myInfo',[function(){
    return {
        scope: {},
        restrict: 'AE',
        templateUrl: 'directives/my_info.html',
        link: function ($scope, elm, attr, $interval) {


        },
        controller: function ($scope, $element, $attrs,locals,$timeout,$http,$stateParams) {
            $scope.userName=$stateParams.name;
            var waitTime=50;
            var stateName=locals.getObj('stateName',1000*3600*24);
            if(stateName!=$stateParams.name||locals.get('upPost')){//访问的博客路径name改变时，需延迟加载给headBar提供请求时间
                waitTime=300;
            }
           var run=$timeout(function(){
               $scope.headTip_show=false;
               $scope.countPost=locals.get('countPosts');
               $scope.friend=locals.getObj('friend',1000*3600*24);
               $scope.focus=locals.getObj('focus',1000*3600*24);
               $scope.myhead=locals.get('headImg');
               if($scope.myhead==(''||null||undefined)){
                   $scope.headTip_show=true;
                   $scope.myhead='images/headDefault.png'
               }
               if(!$scope.focus){
                   $scope.focus=[];
               }
               $scope.focus=$scope.focus.length;
               $scope.fans=locals.getObj('fans',1000*3600*24);
               if(!$scope.fans){
                   $scope.fans=[];
               }
               $scope.fans=$scope.fans.length;
               $scope.lastLogin=locals.get('lastLogin');
               $scope.rFocus_show=false;
               $scope.rFriend_show=false;
               $scope.focus_show=false;
               $scope.addFriend_show=false;
               $scope.loginTip_show=false;
               $scope.removeFocus=function(){
                   var myFocus=locals.getObj('myFocus',1000*3600*24*3);
                   var fans=locals.getObj('fans',1000*3600*24*3);
                   if(!angular.isArray(fans)){
                       fans=[];
                   }
                   if(!angular.isArray(myFocus)){
                       myFocus=[];
                   }
                   var name=locals.getObj('lastName',1000*3600*24*3);
                   for(var i=0;i<myFocus.length;i++){
                       if(myFocus[i].name==$stateParams.name){
                           myFocus.splice(i,1);
                       }
                   }
                   locals.setObj('myFocus',myFocus);
                   for(var j=0;j<fans.length;j++){
                       if(fans[j].name==name){
                           fans.splice(i,1);
                       }
                   }
                   locals.setObj('fans',fans);
                   myFocus=JSON.stringify(myFocus);
                   fans=JSON.stringify(fans);
                    $http({
                        url:'http://localhost:3000/up_focus',
                        method:'POST',
                        data:{myName:name,name:$stateParams.name,focus:myFocus,fans:fans},
                        withCredentials: true
                    }).then(function(result){

                    }).catch(function(err){
                        console.log(err)
                    });
                   $scope.focus_show=true;
                   $scope.rFocus_show=false;
                   $scope.fans-=1;
                   //alert($scope.fans)
                   var countFans=$scope.fans.toString();
                   var showFans=angular.element(document.querySelectorAll('#showFans'));
                   showFans.text(countFans);
                   locals.set('upPost',true);//数据变动标志
               };
               $scope.removeFriend=function(){
                   var myFriend=locals.getObj('myFriend',1000*3600*24*3);
                   var friend=locals.getObj('friend',1000*3600*24*3);
                   if(!angular.isArray(myFriend)){
                       myFriend=[];
                   }
                   if(!angular.isArray(friend)){
                       friend=[];
                   }
                   //var friend=[];
                   //var myFriend=[];
                   var name=locals.getObj('lastName',1000*3600*24*3);
                   for(var i=0;i<myFriend.length;i++){
                       if(myFriend[i]==$stateParams.name){
                           myFriend.splice(i,1);
                       }
                   }
                   locals.setObj('myFriend',myFriend);
                   for(var j=0;j<friend.length;j++){
                       if(friend[j]==name){
                           friend.splice(i,1);
                       }
                   }
                   locals.setObj('friend',friend);
                   myFriend=JSON.stringify(myFriend);
                   friend=JSON.stringify(friend);
                   //alert(myFriend+''+friend)
                   $http({
                       url: 'http://localhost:3000/up_friend',
                       method:'POST',
                       data:{myName:name,name:$stateParams.name,myFriend:myFriend,friend:friend},
                       withCredentials: true
                   }).then(function(result){

                   }).catch(function(err){
                       console.log(err)
                   });
                   $scope.addFriend_show=true;
                   $scope.rFriend_show=false;
                   locals.set('upPost',true);//数据变动标志
               };
               $scope.addFocus=function(){
                   if(!locals.getObj('lastName',1000*3600*24)){
                       //未登录提示用户登录
                       $scope.loginTip_show=true;
                       var tip=$timeout(function(){
                           $scope.loginTip_show=false;
                       },5000);
                   }else{
                       //已经登录执行关注功能
                       var myHead=locals.get('myHead');
                       var head=locals.get('headImg');
                       var myFocus=locals.getObj('myFocus',1000*3600*24*3);
                       if(!angular.isArray(myFocus)){
                           myFocus=[];
                       }
                       myFocus.push({name:$stateParams.name,head:head});
                       myFocus=JSON.stringify(myFocus);
                       var name=locals.getObj('lastName',1000*3600*24*3);
                       var fans=locals.getObj('fans',1000*3600*24*3);
                       if(!angular.isArray(fans)){
                           fans=[];
                       }
                       fans.push({name:name,head:myHead});
                       fans=JSON.stringify(fans);
                       //alert(myFocus+''+fans)
                       $http({
                           url: 'http://localhost:3000/up_focus',
                           method:'POST',
                           data:{myName:name,name:$stateParams.name,focus:myFocus,fans:fans},
                           withCredentials: true
                       }).then(function(result){

                       }).catch(function(err){
                           console.log(err)
                       });

                       $scope.focus_show=false;
                       $scope.rFocus_show=true;
                       $scope.fans+=1;
                       var countFans=$scope.fans.toString();
                       //alert($scope.fans)
                       var showFans=angular.element(document.querySelectorAll('#showFans'));
                       showFans.text(countFans);
                       locals.set('upPost',true);//数据变动标志
                   }
               };
               $scope.addFriend=function(){
                   var myHead=locals.get('myHead');
                   var head=locals.get('headImg');
                   if(!locals.getObj('lastName',1000*3600*24)){
                       //未登录提示用户登录
                       $scope.loginTip_show=true;
                       var tip=$timeout(function(){
                           $scope.loginTip_show=false;
                       },5000);
                   }else{
                       //已经登录执行关注功能
                       var myFriend=locals.getObj('myFriend',1000*3600*24*3);
                       if(!angular.isArray(myFriend)){
                           myFriend=[];
                       }
                       myFriend.push($stateParams.name);
                       myFriend=JSON.stringify(myFriend);
                           var myName=locals.getObj('lastName',1000*3600*24*3);
                           var friend=locals.getObj('friend',1000*3600*24*3);
                       if(!angular.isArray(friend)){
                            friend=[];
                       }
                       friend.push(myName);
                       friend=JSON.stringify(friend);
                       alert(myFriend+''+friend)
                       var myMessages=locals.getObj('myMessages',1000*3600*24);
                       myMessages=JSON.stringify(myMessages);
                       if(!myMessages){
                           myMessages=[];
                       }
                       var messages=locals.getObj('messages',1000*3600*24);
                       if(!angular.isArray(messages)){
                           messages=[];
                       }
                       var date=new Date();
                       var id=$stateParams.name+date.getTime();
                       var time=date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+(date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes());
                       var myFriendVal=JSON.parse(myFriend);
                       var friendVal=JSON.parse(friend);
                       var myMessagesVal=JSON.parse(myMessages);
                       //alert(myMessagesVal+' '+friendVal+' '+myFriendVal)
                       var html= '<div><span>' + myName + '</span><span>请求加您为博友！</span>' +
                           '<button ng-click="allow($event,'+id+')"  style="font-size:12px;margin-right:3px;color;#fff;background:rgba(0, 128, 0, 0.86);border:0;border-radius:2px;width:40px;height:18px;" ng-show="allow_show"><input class="allow_val" ng-show="false" value="'+myName+'-'+$stateParams.name+'-'+myFriendVal+'-'+myMessagesVal+'-'+friendVal+'"/>同意</button>' +
                           '<button ng-click="refuse($event,'+id+')" style="font-size:12px;color;#fff;background:rgba(170, 0, 0, 0.73);border:0;border-radius:2px;width:40px;height:18px;"  ng-show="refuse_show"><input class="refuse_val" ng-show="false" value="'+myName+'-'+$stateParams.name+'-'+myMessagesVal+'"/>拒绝</button>' +
                           '<span ng-show="allowed_show" style="font-size:12px;color;#ccc;margin-left:20px;">已同意</span><span ng-show="refused_show" style="font-size:12px;color;#ccc;margin-left:20px;">已拒绝</span></div>';
                       var message= {name:myName,Id:id,time:time,read:false,message:html};
                       messages.push(message);
                       //messages=[];
                       messages=JSON.stringify(messages);
                       $http({
                           url: 'http://localhost:3000/send_message',
                           method:'POST',
                           data:{name:$stateParams.name,messages:messages},
                           withCredentials: true
                       }).then(function(result){
                            locals.set('upPost',true);
                       }).catch(function(err){
                           console.log(err)
                       });
                       alert('已发送加好友请求。')
                       $scope.friend=$scope.friend--;
                       locals.set('upPost',true);//数据变动标志
                   }
               };

               //关注、加博友button显示控制
               if(!locals.get('isHost')){
                   //alert(locals.getObj('myFocus',1000*3600*24))
                   var myFocus=locals.getObj('myFocus',1000*3600*24);
                       var myFriend=locals.getObj('myFriend',1000*3600*24);
                   if(locals.getObj('lastName',1000*3600*24)){
                       if(!myFocus){
                           myFocus=[];
                       }else{
                   for(var i=0;i<myFocus.length;i++){//检查是否已关注
                       if(myFocus[i].name==$stateParams.name){
                           $scope.rFocus_show=true;//显示取消关注按钮
                         }
                        }
                       }
                   if(!myFriend){
                       myFriend=[];
                   }else {

                       for (var j = 0; j < myFriend.length; j++) {//检查是否已关注
                           if (myFriend[j] == $stateParams.name) {
                               //alert(myFriend);
                               $scope.rFriend_show = true;//显示取消关注按钮
                           }
                       }
                     }
                   }
                   if( $scope.rFocus_show==false){
                   $scope.focus_show=true;//显示关注按钮
                   }
                   if( $scope.rFriend_show==false){
                       $scope.addFriend_show=true;//显示关注按钮
                   }
               }
           },waitTime)

        }
      }
    }]);

    //热门博文Top list组件
app.directive('topList',[function(){
    return {
        scope: {},
        restrict: 'AE',
        transclude: true,
        templateUrl: 'directives/top_list.html',
        link: function($scope, elm, attr, $interval) {


        },
            controller: function($scope,$element, $attrs,locals,$timeout,$http,$stateParams){
                $scope.posts=[];
                var waitTime=10;
                var stateName=locals.getObj('stateName',1000*3600*24);
                $scope.userName=$stateParams.name;
                if(stateName!=$stateParams.name||locals.get('upPost')){//访问的博客路径name改变时，需延迟加载给headBar提供请求时间
                    waitTime=300;
                }
                var run=$timeout(function(){
                    $scope.posts=locals.getObj('topPosts',1000*3600*24);
                },waitTime)
            }
        }
    }]);
