/**
 * Payment Service.
 *
 */

dingo.services.factory('Payment', function($http) {

  return {

    init: function(){
      // Initiating Paypal SDK
      if(window.PayPalMobile){
        var clientIDs = {
          "PayPalEnvironmentProduction": "AYMqghD3IhKeJXOLh3siE-ImJftpSQLRRWebOHlDUCN7x_i5nWDB7V3zHnC5",
          "PayPalEnvironmentSandbox": "AYuyqBCZYRwnOGI6k7DPlkgltTCEoX8m4b8XHZFqqQb0SAJLsx__gPpfnsyy"
        };
        PayPalMobile.init(clientIDs, this.onPayPalMobileInit);
      }
    },

    paypalConfig: function(){
      client_id = "AYuyqBCZYRwnOGI6k7DPlkgltTCEoX8m4b8XHZFqqQb0SAJLsx__gPpfnsyy";
      secret = "EBT5hxDVku8zaY_5KJpPO9R8eFKtrNei-CY0dxYMQJrfB5Bc3oerkWhqg9C8";
      code = "EGkUQWcpAh_yji2oYpvoRiJ03q2p6S4HKVHt0ZK8Fx29hpYUQMNDpaQpi67c6oJ1y3nT6uneWnJZfY4kKtPvQo92BY1u4w_R6MYNtlR9FZACQAkLuCH_dbxvnM23tJqJBcMMMEzTTj6LNeaoYKs3RS4";
      
      // curl -v  \
      // -u "AYuyqBCZYRwnOGI6k7DPlkgltTCEoX8m4b8XHZFqqQb0SAJLsx__gPpfnsyy:EBT5hxDVku8zaY_5KJpPO9R8eFKtrNei-CY0dxYMQJrfB5Bc3oerkWhqg9C8" \
      // -d "grant_type=authorization_code&code=EGkUQWcpAh_yji2oYpvoRiJ03q2p6S4HKVHt0ZK8Fx29hpYUQMNDpaQpi67c6oJ1y3nT6uneWnJZfY4kKtPvQo92BY1u4w_R6MYNtlR9FZACQAkLuCH_dbxvnM23tJqJBcMMMEzTTj6LNeaoYKs3RS4&redirect_uri=http://example.com/myapp/return.php"


      // app_id: "APP-80W284485P519543T",
      // client_id: "AWdYAhAitDP7Y1AFRQ6h68YlNcBiMcBgg1Grc-rfMrAqAIG_gHWSupG6E9A_",
      // endpoint: "api.sandbox.paypal.com",
      // secret: "EJJFbhA6igUr5gUL5BHuXIks0lBCIZBlvx9NiLQ0QGmV7t2HILnehGmV_0v5",
      // signature: "ASD0y8Fzvt3Gmspmqmq2CJmwwoIfA56HtZ-HEYSq12aMXnhatYMp4ngi",
      // username: "phil-facilitator_api1.dingoapp.co.uk"
    },

    onPayPalMobileInit: function(){
      var self = this;
      var config = new PayPalConfiguration({
        merchantName: "Allington Ventures Ltd",
        merchantPrivacyPolicyURL: "http://dingoapp.bitnamiapp.com/web/privacy-policy/",
        merchantUserAgreementURL: "http://dingoapp.bitnamiapp.com/web/terms-conditions/",
        acceptCreditCards: false
      });
      //config.acceptCreditCards(false);

      // use PayPalEnvironmentNoNetwork mode to get look and feel of the flow
      PayPalMobile.prepareToRender("PayPalEnvironmentSandbox", config, function(){
        console.log('Paypal Library Loaded!');
      });
    },

    makePayment: function(payment,onSuccesfulPayment,onUserCanceled){
      // PayPalPaymentDetails(subtotal, shipping, tax)
      var paymentDetails = new PayPalPaymentDetails(payment.amount, "0.00", "0.00");
      // PayPalPayment(amount, currency, shortDescription, intent, details) {
      var payment = new PayPalPayment(payment.amount, "GBP", payment.description, "Sale", paymentDetails);
      // create payment
      PayPalMobile.renderSinglePaymentUI(payment, onSuccesfulPayment, onUserCanceled);
    },

    loginWithPaypal: function(callback){
      PayPalMobile.renderProfileSharingUI(["email"], function(data){
        var code = data.response.code;
        $http.post('/api/v1/paypal/connect',{
          code: data.response.code
        }).success(function(userData){
          callback(userData);
        }).error(function(){
          callback(false);
        });
      }, function(){
        callback(false);
      });
    }


  };

});