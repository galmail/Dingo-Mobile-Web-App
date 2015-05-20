/**
 * Payment Service.
 *
 */

dingo.services.factory('Payment', function($http) {

  return {

    init: function(){
      // Initiating Paypal SDK
      if(window.PayPalMobile){
        PayPalMobile.init(window.DINGOCONFIG.PaypalIds, this.onPayPalMobileInit);
      }
    },

    onPayPalMobileInit: function(){
      var self = this;
      var config = new PayPalConfiguration({
        merchantName: "Allington Ventures Ltd",
        merchantPrivacyPolicyURL: "http://dingoapp.bitnamiapp.com/web/privacy-policy/",
        merchantUserAgreementURL: "http://dingoapp.bitnamiapp.com/web/terms-conditions/",
        acceptCreditCards: false
      });

      // use PayPalEnvironmentNoNetwork mode to get look and feel of the flow
      PayPalMobile.prepareToRender("PayPalEnvironment", config, function(){
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