/**
 * User Service.
 *
 */

dingo.services.factory('User', function($http, Facebook, Util) {
  
  return {

    info: {},

    loginCallbacks: { names: [], callbacks: [] },
    

    //register an observer login
    registerToLoginCallback: function(callback,name){
      if(this.loginCallbacks.names.indexOf(name)==-1){
        this.loginCallbacks.callbacks.push(callback);
        this.loginCallbacks.names.push(name);
      }
    },

    isGuest: function(){
      return (this.info.fb_id == null || this.info.fb_id == '');
    },

    //call this when you know user has logged in
    notifyLogin: function(){
      var self = this;
      angular.forEach(self.loginCallbacks.callbacks, function(callback){
        callback();
      });
    },
  	
    getInfo: function(){ return this.info; },
  	
    setInfo: function(newdata){ angular.extend(this.info, newdata); },

    saveCredentials: function(email,auth_token){
      localStorage.setItem('email',email);
      localStorage.setItem('auth_token',auth_token);
    },

    isLogged: function(){
      return this.getInfo().logged;
    },

    logout: function(){
      localStorage.setItem('email',null);
      localStorage.setItem('auth_token',null);
      this.info = {};
    },
  	
    login: function(callback){
  		var self = this;
      $http.get('/users/sign_in',{
  			params: {
  				email: self.getInfo().email,
  				password: self.getInfo().password,
          auth_token: self.getInfo().auth_token
  			}
  		}).success(function(res){
  			console.log('login success: ' + JSON.stringify(res));
        res.logged = true;
        self.setInfo(res);
  			// save auth_token
        $http.defaults.headers.common = {
          'X-User-Email': res.email,
          'X-User-Token': res.auth_token
        };
        self.saveCredentials(res.email,res.auth_token);
  			callback(true);
        self.notifyLogin();
  		}).error(function(){
  			console.log('login error');
  			callback(false);
  		});
  	},
  	
    signup: function(callback){
  		var self = this;
  		$http.get('/users/sign_up',{
  			params: self.getInfo()
  		}).success(function(res){
  			console.log('signup success: ' + JSON.stringify(res));
  			//self.setInfo(res);
  			self.login(callback);
  		}).error(function(){
  			console.log('signup error');
  			callback(false);
  		});
  	},
  	
    connect: function(callback){
  		var self = this;
  		// try login first if fail, try to signup user
  		console.log('inside connect... trying to login first.');
  		self.login(function(ok){
  			if(ok){
  				callback(true);
  			}
  			else {
  				self.signup(callback);
  			}
  		});
  	},
  	
    fbParseUserInfo: function(params){
  		var userData = params;
  		userData.fb_id = params.id;
  		delete(userData.id);
  		// birthday
      if(params.birthday){
  			var bdate = params.birthday.split('/');
  			userData.birthday = bdate[1] + '/' + bdate[0] + '/' + bdate[2];
        userData.dateOfBirth = bdate[2] + '-' + bdate[0] + '-' + bdate[1];
  		}
  		// password
      userData.password = "fb"+userData.fb_id;
      // photo url
      userData.photo_url = "http://graph.facebook.com/"+userData.fb_id+"/picture?type=large";
      // gender
      if(userData.gender == 'male'){
        userData.gender = 'M';
      }
      else if(userData.gender == 'female'){
        userData.gender = 'F';
      }
      // name and surname
      userData.name = params.first_name;
      userData.surname = params.last_name;
      // email
      if(userData.email==null || userData.email==''){
        var firstName = userData.name.split(' ')[0];
        userData.email = firstName + userData.fb_id + '@guest.dingoapp.co.uk';
      }
  		return userData;
  	},

    updateProfile: function(userData,callback){
      this.setInfo(userData);
      $http.post('/api/v1/users',this.getInfo())
      .success(function(){
        callback(true);
      }).error(function(){
        callback(false);
      });
    },

    fbLogin: function(callback){
      var self = this;
      var FBApi = null;
      var FBLogin = null;

      if(window.facebookConnectPlugin){
        FBLogin = function(callback,error){
          var array_permissions = ['public_profile,email'];
          return facebookConnectPlugin.login(array_permissions,callback,error);
        };
        FBApi = function(requestPath,callback,error){
          var array_permissions = [];
          return facebookConnectPlugin.api(requestPath, array_permissions, callback, error);
        };
      }
      else {
        FBLogin = function(callback){
          return Facebook.login(callback,{scope: 'public_profile,email'});
        };
        FBApi = function(requestPath,callback,error){
          var method = 'get';
          var params = null;
          return Facebook.api(requestPath, method, params, callback);
        };
      }
      
      FBLogin(
        function (response){
          //console.log('user is connected with facebook!');
          FBApi("me/",
            function (response){
              var userData = self.fbParseUserInfo(response);
              self.setInfo(userData);
              self.connect(function(ok){
                if(ok){
                  callback(true);
                  //window.history.back();
                }
                else {
                  console.log('Error occured: User is logged with facebook but apparently using a different fb_id or password');
                  callback(false);
                }
              });
            }
          );
        },
        function (response){
          //alert('User is not connected with facebook!');
          callback(false);
        }
      );
    }


  };

});