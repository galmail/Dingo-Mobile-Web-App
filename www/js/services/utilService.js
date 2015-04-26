/**
 * Util Service.
 *
 */

dingo.services.factory('Util', function($ionicLoading){
	return {

		timeoutID: null,

		generateUUID: function (){
	    var d = new Date().getTime();
	    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	    });
	    return uuid;
		},

		validateEmail: function (email) { 
    	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	return re.test(email);
		},

		showLoading: function(msg){
			window.clearTimeout(this.timeoutID);
			this.timeoutID = window.setTimeout(function(){
				$ionicLoading.show({
					template: msg || 'Loading...'
				});
			}, 1000);
		},

		hideLoading: function(){
			window.clearTimeout(this.timeoutID);
			$ionicLoading.hide();
		},

		isEmptyObject: function(obj){
			for(key in obj){
				return false;
			}
			return true;
		}
		
	};
});