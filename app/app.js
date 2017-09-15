'use strict';

// Declare app level module which depends on views, and components
var app=angular.module('myApp', [
    'myApp.art',
    'myApp.car',
    'ui.router',
    'ui.bootstrap',
    'myApp.home',
    'myApp.version',
    'myApp.fashion',
    'myApp.culture',
    'myApp.upPhoto',
    'myApp.home.hot',
    'myApp.home.list',
    'myApp.home.visual',
    'myApp.home.headline',
    'myApp.register',
    'myApp.admLogin',
    'myApp.myHome',
    'myApp.showInfo',
    'myApp.content',
    'myApp.userList',
    'myApp.regSuccess',
    'myApp.fashion',
    'myApp.finance',
    'myApp.health',
    'myApp.health',
    'myApp.life',
    'myApp.science',
    'myApp.sports',
    'myApp.starsBlog',
    'myApp.travel',
    'myApp.visual',
    'myApp.blog',
    'myApp.fDynamic',
    'myApp.log',
    'myApp.photos',
    'myApp.logDetail',
    'myApp.notLogin',
    'myApp.notPerm',
    'myApp.backHome',
    'myApp.myVideo',
    'myApp.post_article',
    'myApp.photos.photo',
    'myApp.myHome.messages',
    'myApp.myHome.myInfo',
    'myApp.myHome.myPower',
    'myApp.myHome.mySet',
    'myApp.entertainment',
    'myApp.myHome.mySet.setHead',
    'myApp.myHome.mySet.setBlog',
    'myApp.myHome.mySet.setPassword'

],['$httpProvider',function($httpProvider) {
    // Use x-www-form-urlencoded Content-Type
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    /**
     * The workhorse; converts an object to x-www-form-urlencoded serialization.
     * @param {Object} obj
     * @return {String}
     */
    var param = function(obj) {
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

        for(name in obj) {
            value = obj[name];

            if(value instanceof Array) {
                for(i=0; i<value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if(value instanceof Object) {
                for(subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if(value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    };

    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function(data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
}]).
run(function($rootScope, $state, $stateParams,locals,$anchorScroll) {
    locals.set('name','');//加载statusBar指令前清空name
    locals.set('myName','');//我登录的用户名
    locals.set('hostName','');//别人的用户名
    locals.set('upPost',true);
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
    $anchorScroll.yOffset = 100;
}).

config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/home');
  $stateProvider

      .state('reg', {
          url: '/reg',
          views: {
              '': {
                  templateUrl: 'modules/front_module/register/register.html',
                  controller:'RegisterCtrl'
              }
          },
          cache:false

      })
      .state('reg_success',{
          url:'/reg_success',
          views:{
              '':{
                  templateUrl:'modules/front_module/register/success.html',
                  controller:'RegSuccess'
              }
          }
      })
      .state('policy', {
          url: '/policy',
          views: {
              '': {
                  templateUrl: 'modules/front_module/register/policy.html',
                  controller:'RegisterCtrl'
              }
          }

      })
      .state('term', {
          url: '/term',
          views: {
              '': {
                  templateUrl: 'modules/front_module/register/terms.html',
                  controller:'RegisterCtrl'
              }
          }

      })
      .state('home', {
          url: '/home',
          views: {
              '': {
                  templateUrl: 'modules/front_module/home/home.html',
                  controller:'HomeCtrl'
              }
          }

      })
      .state('home.visual', {
          url: '/home/visual',
          views: {
              '': {
                  templateUrl: 'modules/front_module/home/visual.html',
                  controller:'HomeVisualCtrl'
              }
          }

      })
      .state('home.list', {
          url: '/home/list',
          views: {
              '': {
                  templateUrl: 'modules/front_module/home/list.html',
                  controller:'HomeListCtrl'
              }
          }
      })
      .state('home.hot', {
          url: '/home/hot',
          views: {
              '': {
                  templateUrl: 'modules/front_module/home/hot.html',
                  controller:'HomeHotCtrl'
              }
          }
      })
      .state('home.headline', {
          url: '/home/headline',
          views: {
              '': {
                  templateUrl: 'modules/front_module/home/headline.html',
                  controller:'HomeHeadlineCtrl'
              }
          }
      })

      .state('fashion', {
          url: '/fashion',
          views: {
              '': {
                  templateUrl: 'modules/front_module/fashion/fashion.html',
                  controller:'FashionCtrl'

              }
          }

      })
      .state('art', {
          url: '/art',
          views: {
              '': {
                  templateUrl: 'modules/front_module/art/art.html',
                  controller:'ArtCtrl'

              }
          }

      })
      .state('car', {
          url: '/car',
          views: {
              '': {
                  templateUrl: 'modules/front_module/car/car.html',
                  controller:'CarCtrl'

              }
          }

      })
      .state('culture', {
          url: '/culture',
          views: {
              '': {
                  templateUrl: 'modules/front_module/culture/culture.html',
                  controller:'CultureCtrl'

              }
          }

      })
      .state('current', {
          url: '/current',
          views: {
              '': {
                  templateUrl: 'modules/front_module/current/current.html',
                  controller:'CurrentCtrl'

              }
          }

      })
      .state('entertainment', {
          url: '/entertainment',
          views: {
              '': {
                  templateUrl: 'modules/front_module/entertainment/entertainment.html',
                  controller:'EntertainmentCtrl'

              }
          }

      })
      .state('finance', {
          url: '/finance',
          views: {
              '': {
                  templateUrl: 'modules/front_module/finance/finance.html',
                  controller:'FinanceCtrl'

              }
          }

      })
      .state('health', {
          url: '/health',
          views: {
              '': {
                  templateUrl: 'modules/front_module/health/health.html',
                  controller:'HealthCtrl'

              }
          }

      })
      .state('life', {
          url: '/life',
          views: {
              '': {
                  templateUrl: 'modules/front_module/life/life.html',
                  controller:'LifeCtrl'

              }
          }

      })
      .state('sports', {
          url: '/sports',
          views: {
              '': {
                  templateUrl: 'modules/front_module/sports/sports.html',
                  controller:'SportsCtrl'

              }
          }

      })
      .state('travel', {
          url: '/travel',
          views: {
              '': {
                  templateUrl: 'modules/front_module/travel/travel.html',
                  controller:'TravelCtrl'

              }
          }

      })
      .state('science', {
          url: '/science',
          views: {
              '': {
                  templateUrl: 'modules/front_module/science/science.html',
                  controller:'ScienceCtrl'

              }
          }

      })
      .state('visual', {
          url: '/visual{name}/{videoType}/{videoUrl}/{title}?from&to',
          views: {
              '': {
                  templateUrl: 'modules/front_module/visual/visual.html',
                  controller:'VisualCtrl'

              }
          }

      })
      .state('starsBlog', {
          url: '/starsBlog',
          views: {
              '': {
                  templateUrl: 'modules/front_module/starsBlog/starsBlog.html',
                  controller:'StarsBlogCtrl'

              }
          }

      })
      .state('blogCalendar', {
          url: '/blogCalendar',
          views: {
              '': {
                  templateUrl: 'modules/blogCalendar/blogCalendar.html',
                  controller:'BlogCalendarCtrl'

              }
          }

      })
      .state('blog', {
          url: '/blog{name}',
          views: {
              '': {
                  templateUrl: 'modules/front_module/blog/blog.html',
                  controller:'BlogCtrl'
              }
          }

      })
      .state('fDynamic', {
          url: '/fDynamic{name}',
          views: {
              '': {
                  templateUrl: 'modules/front_module/blog/fDynamic.html',
                  controller:'FDynamicCtrl'
              }
          }

      })
      .state('post_article',{
          url:'/post_article{name}',
          views:{
              '':{
                  templateUrl:'modules/front_module/blog/post_article.html',
                  controller:'PostCtrl'
              }
          }
      })
      .state('photos', {
          url: '/photos{name}',
          views: {
              '': {
                  templateUrl: 'modules/front_module/blog/photos.html',
                  controller:'PhotosCtrl'
              }
          }

      })
      .state('logDetail',{
          url:'/logDetail/{postId}/{name}?from&to',
         // params:{postId:null,name:null},
          views:{
              '':{
                  templateUrl:'modules/front_module/blog/log_detail.html',
                  controller:'LogDetailCtrl'
              }
          }
      })
      .state('log', {
          url: '/log{name}',
          views: {
              '': {
                  templateUrl: 'modules/front_module/blog/log.html',
                  controller:'LogCtrl'
              }
          }

      })
      .state('photos.photo', {
          url: '/photo{name}/{photoBook}/{method}?from&to',
          views: {
              '': {
                  templateUrl: 'modules/front_module/blog/photos_detail.html',
                  controller:'PhotoCtrl'
              }
          }

      })
      .state('myHome', {
          url: '/myHome{name}',
          views: {
              '': {
                  templateUrl: 'modules/front_module/blog/myHome.html',
                  controller:'MyHomeCtrl'
              }
          }

      })
      .state('myHome.myInfo', {
          url: '/myHome.myInfo{name}',
          views: {
              '': {
                  templateUrl: 'modules/front_module/blog/myInfo.html',
                  controller:'MyInfoCtrl'
              }
          }

      })
      .state('myHome.myPower', {
      url: '/myHome.myPower{name}',
      views: {
          '': {
              templateUrl: 'modules/front_module/blog/myPower.html',
              controller:'MyPowerCtrl'
          }
      }

  })
      .state('myHome.mySet', {
      url: '/myHome.mySet{name}',
      views: {
          '': {
              templateUrl: 'modules/front_module/blog/mySet.html',
              controller:'MySetCtrl'
          }
      }

  })
      .state('myHome.mySet.setHead', {
          url: '/myHome.mySet.setHead{name}',
          views: {
              '': {
                  templateUrl: 'modules/front_module/blog/set_head.html',
                  controller:'SetHeadCtrl'
              }
          }

      })
      .state('myHome.mySet.setPassword', {
          url: '/myHome.mySet.setPassword{name}',
          views: {
              '': {
                  templateUrl: 'modules/front_module/blog/set_password.html',
                  controller:'SetPasswordCtrl'
              }
          }

      })
      .state('myHome.mySet.setBlog', {
          url: '/myHome.mySet.setBlog{name}',
          views: {
              '': {
                  templateUrl: 'modules/front_module/blog/set_blog.html',
                  controller:'SetBlogCtrl'
              }
          }

      })
      .state('myHome.messages', {
          url: '/messages{name}',
          views: {
              '': {
                  templateUrl: 'modules/front_module/blog/message.html',
                  controller:'MessagesCtrl'
              }
          }

      })
      .state('showInfo', {
          url: '/showInfo{name}',
          views: {
              '': {
                  templateUrl: 'modules/front_module/blog/showInfo.html',
                  controller:'ShowInfoCtrl'
              }
          }

      })
      .state('upPhoto', {
          url: '/upPhoto{name}',
          views: {
              '': {
                  templateUrl: 'modules/front_module/blog/upPhoto.html',
                  controller:'UpPhotoCtrl'
              }
          }

      })
      .state('notLogin', {
          url: '/notLogin{name}',
          views: {
              '': {
                  templateUrl: 'modules/front_module/blog/not_login.html',
                  controller:'NotLoginCtrl'
              }
          }

      })
      .state('notPerm', {
          url: '/notPerm{name}',
          views: {
              '': {
                  templateUrl: 'modules/front_module/blog/not_perm.html',
                  controller:'NotPermCtrl'
              }
          }

      })
      .state('admLogin', {
          url: '/admLogin{name}',
          views: {
              '': {
                  templateUrl: 'modules/back_module/login.html',
                  controller:'AdmLoginCtrl'
              }
          }

      })
      .state('backHome', {
          url: '/backHome{name}',
          views: {
              '': {
                  templateUrl: 'modules/back_module/home.html',
                  controller:'BackHomeCtrl'
              }
          }
      })
      .state('userList', {
          url: '/userList{name}',
          views: {
              '': {
                  templateUrl: 'modules/back_module/user_list.html',
                  controller:'UserListCtrl'
              }
          }
      })
      .state('content', {
          url: '/content{name}',
          views: {
              '': {
                  templateUrl: 'modules/back_module/content.html',
                  controller:'ContentCtrl'
              }
          }
      })
      .state('myVideo', {
          url: '/myVideo{name}/{videoUrl}/{videoType}/{title}?from&to',
          views: {
              '': {
                  templateUrl: 'modules/front_module/blog/video.html',
                  controller:'MyVideoCtrl'
              }
          }
      })
})




