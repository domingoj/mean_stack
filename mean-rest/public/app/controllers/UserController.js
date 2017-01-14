angular.module('UserController', ['userService'])

.controller('userController', function(User){

	var self = this;
    // more stuff to come soon

    // set a processing variable to show loading things
    self.processing = true;

    // grab all the users at page load
    User.all()
    	.then(function(response){

    	// when all the users come back, remove the processing variable
		self.processing = false;
      	// bind the users that come back to self.users
      	self.users = response.data;


    	});

   	// function to delete a user
    self.deleteUser = function(id){

    	self.processing = true;

    	// accepts the user id as a parameter
    	User.delete(id)
    		.then(function(response){

    		// get all users to update the table
			// you can also set up your api
			// to return the list of users with the delete call

			User.all()
				.then(function(response) { 
					self.processing = false; 
					self.users = response.data;
				});

    		});

    }

})

// controller applied to user creation page
.controller('userCreateController', function(User, Auth){


	var self = this;

self.isLoggedIn  = Auth.isLoggedin();

	// variable to hide/show elements of the view 
	// differentiates between create or edit pages 
	self.type = 'create';

	// function to create a user
	self.saveUser = function() { 

		self.processing = true;
    	
    	// clear the message
    	self.message = '';
    	
    	// use the create function in the userService
		User.create(self.userData) 
			.then(function(response) {
			
				self.processing = false;
        		
        		// clear the form
        		self.userData = {};
        		self.message = response.data.message;

        		// if a user successfully logs in, redirect to users page
		  		if(response.data.success){
		  			self.loginLink = true;
		  		}
      });
};
})

// controller applied to user edit page
.controller('userEditController', function($routeParams, User) {

	var self = this;

	// variable to hide/show elements of the view 
	// differentiates between create or edit pages 
	self.type = 'edit';

	// get the user data for the user you want to edit 
	// $routeParams is the way we grab data from the URL 
	User.get($routeParams.user_id)
		.then(function(response) { 
			self.userData = response.data;
		});

  	// function to save the user
	self.saveUser = function() { 

		self.processing = true; 
		self.message = '';

    	// call the userService function to update
		User.update($routeParams.user_id, self.userData) 
			.then(function(response) {

				self.processing = false; 

				// clear the form
        		self.userData = {};
        
        		// bind the message from our API to self.message
        		self.message = response.data.message;

      	});
	};

});







