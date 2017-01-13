angular.module('MainController', [])

.controller('mainController', function($rootScope, $location, Auth){

	var self = this;

	// get info if a person is logged in
	self.loggedIn = Auth.isLoggedin();

	// check to see if a user is logged in on every request
	$rootScope.$on('$routeChangeStart', function(){

		self.loggedIn = Auth.isLoggedin();

		// get user information on route change
		Auth.getUser()
			.then(function(data){

				self.user = data;
			});
	});

	// function to handle login form
	self.doLogin = function(){

		 // call the Auth.login() function
		 Auth.login(self.loginData.userName, self.loginData.password)

		  	.then(function(data){

		  		// if a user successfully logs in, redirect to users page
		  		$location.path('/users');
		  	});
	};

	// function to handle logging out
	self.doLogout = function(){

		Auth.logout();
		// reset all user info 
		self.user = {}; 
		$location.path('/login');
	}

})