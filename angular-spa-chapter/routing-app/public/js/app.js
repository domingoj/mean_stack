angular.module('routerApp',['routerRoutes','ngAnimate'])

// create the controllers
// this will be the controller for the ENTIRE site
.controller('mainController',function(){

	var vm = this;
	// create a bigMessage variable to display in our view
	vm.bigMessage = 'A smooth sea never made a skilled sailor.';
})

// home page specific controller
.controller('homeController',function(){
	
	var vm = this;
 	vm.message = 'This is the home page!';
})

// home page specific controller
.controller('aboutController',function(){
	
	var vm = this;
 	vm.message = 'This is the about page!';
})

// home page specific controller
.controller('contactController',function(){
	
	var vm = this;
 	vm.message = 'Contact us not!';
});