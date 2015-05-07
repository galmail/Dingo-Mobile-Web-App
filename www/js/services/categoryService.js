/**
 * Category Service.
 *
 */

dingo.services.factory('Category', function($http) {
  
  return {

  	categories: [],

    loadAll: function(callback){
      var self = this;
      $http.get('/api/v1/categories').success(function(res){
        self.categories = res.categories;
        callback(self.categories);
      });
    },

    getImage: function(id){
    	for(var i=0;i<this.categories.length;i++){
    		var category = this.categories[i];
    		if(category.id == id){
    			return category.thumb;
    		}
    	}
    	return null;
    }

  };

});