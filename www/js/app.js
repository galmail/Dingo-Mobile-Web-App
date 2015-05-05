// Dingo Mobile Web App

var dingo = angular.module('dingo',['ionic','facebook','ngCordova','dingo.controllers','dingo.services','dingo.directives']);
dingo.controllers = angular.module('dingo.controllers', []);
dingo.services = angular.module('dingo.services', []);
dingo.directives = angular.module('dingo.directives', []);

///////////// Config Vars /////////////
dingo.constant('CONFIG', {
  FacebookAppId: '667287336672842',
  FacebookAppIdTest: '854877257866349',
  GCM_SENDER_ID: '734407104892'
});

dingo.run(function($ionicPlatform,$cordovaAppVersion,$cordovaKeyboard,$cordovaStatusbar,Payment,Message) {
  
  $ionicPlatform.ready(function(){

    $cordovaKeyboard.hideAccessoryBar(true);
    
    // styles: Default : 0, LightContent: 1, BlackTranslucent: 2, BlackOpaque: 3
    $cordovaStatusbar.style(0);

    $cordovaAppVersion.getAppVersion().then(function(version){
      console.log('app version is: ' + version);
      window.device.appVersion = version;
    });

    // start to initialize PayPalMobile library
    Payment.init();

    window.simulateIncomingMessage = Message.incomingMsg;

  });
})

.config(function ($httpProvider) {
  $httpProvider.interceptors.push(function ($q) {
     return {
       'request': function(config){
          if (window.cordova){
            if(((config.url.indexOf('/api')>=0) || (config.url.indexOf('/users/')>=0)) && (config.url.indexOf('paypal.com')<0)){
              config.url = 'http://dingoapp-staging.herokuapp.com' + config.url;
              //alert('calling: ' + config.url);
            }
          }
          return config || $q.when(config);
       }
     }
   });
})


.config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading from our assets domain.  Notice the difference between * and **.
    //'https://*.s3.amazonaws.com/**'
  ]);

  // The blacklist overrides the whitelist so the open redirect here is blocked.
  $sceDelegateProvider.resourceUrlBlacklist([
    
  ]);
})

.config(['CONFIG','FacebookProvider',function(CONFIG, FacebookProvider) {
   if(window.location.href.indexOf('localhost')>0){
    FacebookProvider.init(CONFIG.FacebookAppIdTest);
   }
   else {
    FacebookProvider.init(CONFIG.FacebookAppId);
   }
}])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "js/templates/_menu.html",
    controller: 'HomeCtrl'
  })

  ////////////////// MENU URLs ///////////////////

  .state('app.login', {
    url: "/login",
    views: {
      'menuContent' :{
        templateUrl: "js/templates/login.html",
        controller: 'AuthCtrl'
      }
    }
  })

  .state('app.settings', {
    url: "/settings",
    views: {
      'menuContent' :{
        templateUrl: "js/templates/settings.html",
        controller: 'SettingsCtrl'
      }
    }
  })

  .state('app.mytickets', {
    url: "/mytickets",
    views: {
      'menuContent' :{
        templateUrl: "js/templates/mytickets.html",
        controller: 'MyTicketsCtrl'
      }
    }
  })

  .state('app.myticketsList', {
    url: "/mytickets/:ticketsType",
    views: {
      'menuContent' :{
        templateUrl: "js/templates/myticketslist.html",
        controller: 'MyTicketsCtrl'
      }
    }
  })

  .state('app.myticketsDetailShow', {
    url: "/mytickets/:ticketsType/:eventId/:ticketId/show",
    views: {
      'menuContent' :{
        templateUrl: "js/templates/myticketsdetailshow.html",
        controller: 'MyTicketsCtrl'
      }
    }
  })

  .state('app.myticketsDetailEdit', {
    url: "/mytickets/:ticketsType/:eventId/:ticketId/edit",
    views: {
      'menuContent' :{
        templateUrl: "js/templates/myticketsdetailedit.html",
        controller: 'MyTicketsCtrl'
      }
    }
  })

  .state('app.faq', {
    url: "/faq",
    views: {
      'menuContent' :{
        templateUrl: "js/templates/faqs.html",
        controller: 'FAQsCtrl'
      }
    }
  })

  .state('app.about', {
    url: "/about",
    views: {
      'menuContent' :{
        templateUrl: "js/templates/about.html"
      }
    }
  })

  .state('app.tandcs', {
    url: "/tandcs",
    views: {
      'menuContent' :{
        templateUrl: "js/templates/tandcs.html"
      }
    }
  })

  .state('app.privacypolicy', {
    url: "/privacypolicy",
    views: {
      'menuContent' :{
        templateUrl: "js/templates/privacypolicy.html"
      }
    }
  })

  ////////////////// HOME URLs ///////////////////

  .state('home', {
    url: "/home",
    abstract: true,
    templateUrl: "js/templates/_home.html",
    controller: 'HomeCtrl'
  })

  .state('home.events', {
    url: "/events",
    views: {
      'events-tab': {
        templateUrl: "js/templates/events.html",
        controller: 'EventsCtrl'
      }
    }
  })

  .state('home.eventDetails', {
    url: "/event-details/:eventId",
    views: {
      'events-tab': {
        templateUrl: "js/templates/eventDetails.html",
        controller: 'EventDetailsCtrl'
      }
    }
  })


  .state('home.ticketDetails', {
    url: "/ticket-details/:eventId/:ticketId",
    views: {
      'events-tab': {
        templateUrl: "js/templates/ticketDetails.html",
        controller: 'TicketDetailsCtrl'
      }
    }
  })


  .state('home.sellTicket', {
    url: "/sell-ticket",
    views: {
      'sell-ticket-tab': {
        templateUrl: "js/templates/sellTicket.html",
        controller: 'SellTicketCtrl'
      }
    }
  })

  .state('home.sellTicketPreview', {
    url: "/sell-ticket-preview",
    views: {
      'sell-ticket-tab': {
        templateUrl: "js/templates/sellTicketPreview.html",
        controller: 'SellTicketCtrl'
      }
    }
  })

  .state('home.messages', {
    url: "/messages",
    views: {
      'messages-tab': {
        templateUrl: "js/templates/messages.html", //MessagesCtrl
        controller: 'MessagesCtrl'
      }
    }
  })

  .state('home.messagesChat', {
    url: "/messages/:conversationId",
    views: {
      'messages-tab': {
        templateUrl: "js/templates/messagesChat.html",
        controller: 'MessagesCtrl'
      }
    }
  })

  .state('home.search', {
    url: "/search",
    views: {
      'search-tab': {
        templateUrl: "js/templates/search.html"
      }
    }
  })
  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/home/events');

});

