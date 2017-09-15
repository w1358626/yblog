
app.factory('locals',['$window',function($window){
    return{        //存储单个属性
        set :function(key,value){
            $window.localStorage[key]=value;
        },        //读取单个属性
        get:function(key,defaultValue){
            return  $window.localStorage[key] || defaultValue;
        },
        setObj: function(key,value){ //存储对象，以JSON格式存储
            var curTime = new Date().getTime();
            localStorage.setItem(key,JSON.stringify({data:value,time:curTime}));
        },        //读取对象
        getObj: function(key,exp){
            var data = localStorage.getItem(key);
            if(data){
            var dataObj = JSON.parse(data);
            if (new Date().getTime() - dataObj.time>exp) {
                console.log('信息已过期');
                return false;
            }else{
                //console.log(dataObj.data);
                return dataObj.data;
             }
            }else{
                return false;
            }
        },
        clear: function(){
            localStorage.clear();
        }

    }
}]);


