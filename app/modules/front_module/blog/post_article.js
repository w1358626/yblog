'use strict';

angular.module('myApp.post_article',['ui.router'])
    .controller('PostCtrl',['$scope','$rootScope','$http','$compile','locals','$stateParams',function($scope,$rootScope,$http,$compile,locals,$stateParams){

}])
    .directive('postArticle',[function(){
        return {
            scope:{},
            restrict:'AE',
            templateUrl:'directives/postArticle.html',
            link:function($scope,elm,attr){

            },
            controller:function($scope,$element,$attrs,$http,$compile,locals,$stateParams,$timeout){
                var waitTime=5;
                var stateName=locals.getObj('stateName',1000*3600*24);
                if(stateName!=$stateParams.name||locals.get('upPost')){//访问的博客路径name改变时，需延迟加载给headBar提供请求时间
                    waitTime=500;
                }
                var run=$timeout(function(){
                    $scope.select=0;
                    $scope.themeImg_show=true;
                    $scope.editorContent = '';
                    $scope.log_title="";
                    $scope.removeTypeShow=false;
                    $scope.label_show=false;
                    $scope.label_culture=false;$scope.label_art=false;$scope.label_car=false;$scope.label_science=false;
                    $scope.label_entertainment=false;$scope.label_finance=false;$scope.label_current=false;$scope.label_video=false;
                    $scope.label_health=false;$scope.label_travel=false;$scope.label_spots=false;$scope.label_life=false;$scope.label_fashion=false;
                    $scope.type1=false;$scope.type2=false;$scope.type3=false;$scope.type4=false;$scope.type5=false;
                    $scope.type6=false;$scope.type7=false;$scope.type8=false;$scope.type9=false;$scope.type0=false;
                    var countIMG= 0,countVIDEO=0,countAUDIO=0;
                    var article=angular.element(document.querySelectorAll("#show_article"));
                    angular.element(document.querySelectorAll("#post_btn")).on("click" ,function () {
                        // 从 onchange 函数中更新数据
                        article.html($scope.editorContent);
                    });
                    //实时获取用户postTypes

                    var myTypes=locals.get('postTypes');//locals返回值是字符串
                    myTypes=myTypes.split(",");//用split()切割成数组

                    var themeImg=angular.element(document.querySelectorAll("#themeImg"));
                    var editor=angular.element(document.querySelectorAll("#editor-trigger"));
                    var upImg=angular.element(document.querySelectorAll("#upImg"));
                    var upAudio=angular.element(document.querySelectorAll("#upAudio"));
                    var upVedio=angular.element(document.querySelectorAll("#upVedio"));
                    var articleTitle=angular.element(document.querySelectorAll("#article_title"));
                    var selectType=angular.element(document.querySelectorAll("#select_type"));
                    var removeType=angular.element(document.querySelectorAll("#type_span"));

                    $scope.upTheme=function(){
                        $http({
                            url:'http://localhost:8000/upload.html',
                            method: 'POST',
                            headers: {
                                'Content-Type': undefined
                            },
                            transformRequest: function() {
                                var formData = new FormData();
                                formData.append('file0', $('#file')[0].files);
                                return formData;
                            }
                        }).then(function (data) {
                            if(data!="not allowed") {
                                console.log(data.data);
                                $scope.themeImg_show=false;
                                themeImg.attr('src',data.data[0]);
                            }
                        }).catch(function(err) {
                            console.log(err);
                        });
                    };
                    var appendImg=function(){
                        console.log()
                        $http({
                            url:'http://localhost:8000/upload.html',
                            method: 'POST',
                            headers: {
                                'Content-Type': undefined
                            },
                            transformRequest: function() {
                                var formData = new FormData();
                                for(var i=0;i<$('#upImg')[0].files.length;i++){
                                    formData.append('file'+i,$('#upImg')[0].files[i]);
                                }
                                return formData;
                            }
                        }).then(function (data) {
                            console.log(data.data)
                            if(data!="not allowed") {
                                for(var i=0;i<data.data.length;i++){
                                var img="<div style='width:500px;height:300px;margin:30px auto;'><img class='append_img' style='width:500px;height:300px;' src='images/a1.jpg'/></div>";
                                editor.append(img);
                                var appendImg=angular.element(document.querySelectorAll(".append_img"));
                                appendImg.eq(countIMG).attr('src',data.data[i]);
                                countIMG++;
                                }
                            }
                        }).catch(function(err) {
                            console.log(err);
                        })
                    };
                    var uploadVideo=function(){
                        $http({
                            url:'http://localhost:8000/upload.html',
                            method: 'POST',
                            headers: {
                                'Content-Type': undefined
                            },
                            transformRequest: function() {
                                var formData = new FormData();
                                for(var i=0;i<$('#upVedio')[0].files.length;i++){
                                    formData.append('file'+i,$('#upVedio')[0].files[i]);
                                }
                                return formData;
                            }
                        }).then(function (data) {
                            console.log(data.data)
                            if(data.data!="not allowed") {
                                for(var i=0;i<data.data.length;i++) {
                                    var vedio = "<div style='margin:20px auto;'><video id='videoElement' width='500' height='300' controls>您的浏览器不支持H5 video</video></div>";
                                    vedio=$compile(vedio)($scope);
                                    editor.append(vedio);
                                    if (flvjs.isSupported()) {
                                        var flvPlayer = flvjs.createPlayer({
                                            type: 'flv',
                                            url:  data.data[i].video
                                        });
                                        flvPlayer.attachMediaElement(videoElement);
                                        flvPlayer.load(); //加载
                                    }
                                    countVIDEO++;
                                }
                            }
                        }).catch(function(err) {
                            console.log(err);
                        })
                    };
                    var uploadAudio=function(){
                        $http({
                            url:'http://localhost:8000/upload.html',
                            method: 'POST',
                            headers: {
                                'Content-Type': undefined
                            },
                            transformRequest: function() {
                                var formData = new FormData();
                                for(var i=0;i<$('#upAudio')[0].files.length;i++){
                                    formData.append('file'+i,$('#upAudio')[0].files[i]);
                                }
                                return formData;
                            }
                        }).then(function (data) {
                            if(data!="not allowed") {
                                for(var i=0;i<data.data.length;i++) {
                                    var audio = "<audio controls ><source class='append_audio' src='images/upAudio.mp3' type='audio/mpeg'></audio>";
                                    editor.append(audio);
                                    var appendAudio = angular.element(document.querySelectorAll(".append_audio"));
                                    appendAudio.eq(countAUDIO).attr('src', data.data[i]);
                                    countAUDIO++;
                                }
                            }
                        }).catch(function(err) {
                            console.log(err);
                        })
                    };
                    $scope.upMedia=function(){
                        var img=upImg.val();
                        var audio=upAudio.val();
                        var video=upVedio.val();
                        var video_exist=$element.find('#editor-trigger video');
                        console.log(video_exist)
                        if(img!=""){
                            appendImg();
                        }
                        if(audio!=""){
                            uploadAudio();
                        }
                        if(video!=""&&video_exist.length==0){
                            uploadVideo();
                        }else{
                            alert('你只能上传一个视频哦！')
                        }
                    };
                    $scope.add_type=function(){
                        var newType=prompt("填写分类名称：");
                        if(newType!=""&&newType!=null){
                            selectType.prepend('<option>'+newType+'</option>');
                            myTypes[myTypes.length]=$stateParams.name+'-'+newType;
                            var postTypes=myTypes;
                            var myJSON={};
                            if(postTypes[0]){myJSON.type1=postTypes[0]}
                            if(postTypes[1]){myJSON.type2=postTypes[1]}
                            if(postTypes[2]){myJSON.type3=postTypes[2]}
                            if(postTypes[3]){myJSON.type4=postTypes[3]}
                            if(postTypes[4]){myJSON.type5=postTypes[4]}
                            if(postTypes[5]){myJSON.type6=postTypes[5]}
                            if(postTypes[6]){myJSON.type7=postTypes[6]}
                            if(postTypes[7]){myJSON.type8=postTypes[7]}
                            if(postTypes[8]){myJSON.type9=postTypes[8]}
                            if(postTypes[9]){myJSON.type10=postTypes[9]}
                            if(postTypes[10]){alert("您最多可以有10个分类！")}
                            //请求更新postTypes
                            $http({url:"http://localhost:3000/upTypes",
                                data:myJSON,
                                method:'POST',
                                withCredentials: true
                            }).then(function(result){

                            }).catch(function(err){
                                console.log(err)
                            })
                        }
                    };

                    $scope.remove_type=function(){
                        $scope.removeTypeShow=!$scope.removeTypeShow;
                    };


                    var writeType= function() {
                        console.log(myTypes)
                        for(var i=0;i<myTypes.length;i++){
                            var type=myTypes[i].split('-');
                            var html='<span id="type'+i+'"><input id="c_type'+i+'" ng-model="type'+i+'" type="checkbox" value="'+i+'"/>'+type[1]+'</span>';
                            html=$compile(html)($scope);
                            selectType.append('<option id="s_type'+i+'" value="'+i+'">'+type[1]+'</option>');
                            removeType.append(html);
                        }
                    };
                    writeType();

                    $scope.removeType=function(){
                        var del_types={};
                        console.log(myTypes)
                        var sType1=angular.element(document.querySelectorAll("#s_type0"));
                        var sType2=angular.element(document.querySelectorAll("#s_type1"));
                        var sType3=angular.element(document.querySelectorAll("#s_type2"));
                        var sType4=angular.element(document.querySelectorAll("#s_type3"));
                        var sType5=angular.element(document.querySelectorAll("#s_type4"));
                        var sType6=angular.element(document.querySelectorAll("#s_type5"));
                        var sType7=angular.element(document.querySelectorAll("#s_type6"));
                        var sType8=angular.element(document.querySelectorAll("#s_type7"));
                        var sType9=angular.element(document.querySelectorAll("#s_type8"));
                        var sType10=angular.element(document.querySelectorAll("#s_type9"));
                        var cType1=angular.element(document.querySelectorAll("#type0"));
                        var cType2=angular.element(document.querySelectorAll("#type1"));
                        var cType3=angular.element(document.querySelectorAll("#type2"));
                        var cType4=angular.element(document.querySelectorAll("#type3"));
                        var cType5=angular.element(document.querySelectorAll("#type4"));
                        var cType6=angular.element(document.querySelectorAll("#type5"));
                        var cType7=angular.element(document.querySelectorAll("#type6"));
                        var cType8=angular.element(document.querySelectorAll("#type7"));
                        var cType9=angular.element(document.querySelectorAll("#type8"));
                        var cType10=angular.element(document.querySelectorAll("#type9"));
                        if($scope.type0){sType1.remove();cType1.remove();del_types.type0=myTypes[0];myTypes.splice(0,1);}
                        if($scope.type1){sType2.remove();cType2.remove();del_types.type1=myTypes[1];myTypes.splice(1,1);}
                        if($scope.type2){sType3.remove();cType3.remove();del_types.type2=myTypes[2];myTypes.splice(2,1);}
                        if($scope.type3){sType4.remove();cType4.remove();del_types.type3=myTypes[3];myTypes.splice(3,1);}
                        if($scope.type4){sType5.remove();cType5.remove();del_types.type4=myTypes[4];myTypes.splice(4,1);}
                        if($scope.type5){sType6.remove();cType6.remove();del_types.type5=myTypes[5];myTypes.splice(5,1);}
                        if($scope.type6){sType7.remove();cType7.remove();del_types.type6=myTypes[6];myTypes.splice(6,1);}
                        if($scope.type7){sType8.remove();cType8.remove();del_types.type7=myTypes[7];myTypes.splice(7,1);}
                        if($scope.type8){sType9.remove();cType9.remove();del_types.type8=myTypes[8];myTypes.splice(8,1);}
                        if($scope.type9){sType10.remove();cType10.remove();del_types.type9=myTypes[9];myTypes.splice(9,1);}
                        var noType=$stateParams.name+"-我的文章";
                        for(var i=0;i<myTypes.length;i++){
                            if(myTypes[i]==noType) {
                                var exit = true;
                            }
                        }
                        if(!exit){
                            myTypes.splice(1,0,noType);
                        }
                        console.log(del_types)
                        var postTypes=myTypes;
                        var myJSON={};
                        if(postTypes[0]){myJSON.type1=postTypes[0]}
                        if(postTypes[1]){myJSON.type2=postTypes[1]}
                        if(postTypes[2]){myJSON.type3=postTypes[2]}
                        if(postTypes[3]){myJSON.type4=postTypes[3]}
                        if(postTypes[4]){myJSON.type5=postTypes[4]}
                        if(postTypes[5]){myJSON.type6=postTypes[5]}
                        if(postTypes[6]){myJSON.type7=postTypes[6]}
                        if(postTypes[7]){myJSON.type8=postTypes[7]}
                        if(postTypes[8]){myJSON.type9=postTypes[8]}
                        if(postTypes[9]){myJSON.type10=postTypes[9]}
                        //请求更新postTypes
                        $http({url:"http://localhost:3000/upTypes",
                            data:myJSON,
                            method:'POST',
                            withCredentials: true
                        }).then(function(result){

                        }).catch(function(err){
                            console.log(err)
                        })
                        //请求将文章移动到‘我的文章’
                        var toArticle=$timeout(function(){
                            $http({url:'http://localhost:3000/toMyArticle',
                                method:'POST',
                                data:del_types,
                                withCredentials: true
                            }).then(function(){

                            }).catch(function(err){
                                console.log(err)
                            })
                        },1000)
                    };
                    var labels="";
                    $scope.labelChcange=function(){
                        if(!$scope.label_show){
                            $scope.label_culture=false;$scope.label_art=false;$scope.label_car=false;$scope.label_science=false;
                            $scope.label_entertainment=false;$scope.label_finance=false;$scope.label_current=false;$scope.label_video=false;
                            $scope.label_health=false;$scope.label_travel=false;$scope.label_sports=false;$scope.label_life=false;$scope.label_fashion=false;
                        }
                    };

                    var labelChange=function(){
                        if($scope.label_culture){labels="文化";}
                        if($scope.label_art){labels=labels+",艺术";}
                        if($scope.label_car){labels=labels+",汽车";}
                        if($scope.label_science){labels=labels+",科学";}
                        if($scope.label_entertainment){labels=labels+",娱乐";}
                        if($scope.label_finance){labels=labels+",财经";}
                        if($scope.label_current){labels=labels+",时事";}
                        if($scope.label_video){labels=labels+",视频";}
                        if($scope.label_health){labels=labels+",健康";}
                        if($scope.label_travel){labels=labels+",旅游";}
                        if($scope.label_sports){labels=labels+",运动";}
                        if($scope.label_life){labels=labels+",生活";}
                        if($scope.label_fashion){labels=labels+",时尚";}
                        console.log(labels)
                    };


                    $scope.post_mylog=function(){
                        if(articleTitle.val()!=""&&editor.html()!=""){
                            var type;
                            var html=editor.html();
                            var themeUrl=themeImg.attr("src");
                            var select=selectType.val();
                            locals.set('upPost',true);
                            if(!Number(select)&&Number(select)!=0){
                                alert("进入")
                                type=$stateParams.name+"-"+select;
                            }else{
                                type=myTypes[select];
                            }
                            labelChange();
                            $http({url:"http://localhost:3000/post",
                                data:{title:$scope.log_title,theme:themeUrl,article:html,type:type,labels:labels},
                                method:'POST',
                                withCredentials: true
                            })
                                .then(function(result){
                                    $scope.log_title="";
                                    editor.html("");
                                    labels="";
                                    themeImg.attr("src",'images/a2.jpg');
                                    $scope.label_show=false;
                                    $scope.label_culture=false;$scope.label_art=false;$scope.label_car=false;$scope.label_science=false;
                                    $scope.label_entertainment=false;$scope.label_finance=false;$scope.label_current=false;$scope.label_video=false;
                                    $scope.label_health=false;$scope.label_travel=false;$scope.label_sports=false;$scope.label_life=false;$scope.label_fashion=false;
                                }).catch(function(err){
                                console.log(err)
                            })
                        }else{
                            alert("必须填写标题和正文！")
                        }
                    }
                },waitTime)
            }
        }
    }])


