import { Index, MinimongoEngine } from 'meteor/easy:search'

const CarsList = new Mongo.Collection('cars');

const CarsIndex = new Index({
 	collection: CarsList,
 	fields: ['brand', 'color', 'model', 'category', 'technoogy', 'description', 'additionalOptions'],
 	engine: new MinimongoEngine(),
})

Router.configure({
    layoutTemplate: 'main',
});
Router.route('/', {
	name: 'home', // with this we named this route home
	template: 'home',
});
Router.route('/register'); 
Router.route('/forgotPass'); 
Router.route('/userProfile'); 
// this function is provided by the Iron Router
// a path is passed which will be accessable at the url (default url)/register
// Iron Router assumes that we want to connect this url with the template with same name and that is why we don't have to define association manually
// only exception is the home page because Iron ROuter cannot guess that the template 'home' is meant to be attached to this path
// that is why we have to manually define the association

Router.route('carInfo');
Router.route('filterSearch');
Router.route('addCar', { // if the user is not logged in, they cannot access directly
	onBeforeAction: function(){
		var currentUserId=Meteor.userId();
		if(currentUserId){
			this.next();
		} 
		else {
			this.render("register");
		}
	}
});
Router.route('changePassword');
Router.route('/car/:_id', {
	template: 'carInfo',
	data: function(){
        // console.log(this.params.someParam);
        var currentCarsList=this.params._id;
        return CarsList.findOne({ _id: currentCarsList });
    },
});

var param='';
var value='';


if(Meteor.isClient){
	//this code only runs on client
	//the helpers keyword allows us to create multiple helper functions inside a single block of code

	Template.home.helpers({
		carsIndex: () => CarsIndex,
		att: function() {
     		return {placeholder: "Ex: safe, comfortable, etc."};
 		},
	});

	Template.navigationItems.helpers({
		activeIfTemplateIs: function (template) {
      		var currentRoute = Router.current();
      		return currentRoute && template === currentRoute.lookupTemplate() ? 'active' : '';
    	},
	});

	Template.changePassword.events({
		'.changePass': function(event){
			event.preventDefault();
			var username=event.target.registerUsername.value;
			var email=event.target.registerEmail.value;
			var pass=event.target.registerPass.value;
			// var confirmPass=target.registerPassConfirm.value;
			
			Accounts.changePassword({
				email: email,
				password: pass,
				username: username,
			});
		},
	});

	Template.addCarForm.helpers({
		//helper functions here
	});

	Template.addCarForm.events({
		'submit form': function(event){
			event.preventDefault();
			// insert a car in the database
			var currentUserId = Meteor.userId();
			// input fields here
			var carBrand=event.target.carBrand.value;
			var carModel=event.target.carModel.value;
			var carYear=event.target.carYear.value;
			var carVersion=event.target.carVersion.value;
			var carCategory=event.target.carCategory.value;
			var carRegistration=event.target.carRegistration.value;
			var carFuel=event.target.carFuel.value;
			var carKm=event.target.carKm.value;
			var carTechnology=event.target.carTechnology.value;
			var carTransmission=event.target.carTransmission.value;
			var carConsumption=event.target.carConsumption.value;
			var carMPH=event.target.carMPH.value;
			var carPrice=event.target.carPrice.value;
			var carEngine=event.target.carEngine.value;
			var carTopSpeed=event.target.carTopSpeed.value;
			var carWarranty=event.target.carWarranty.value;
			var carPower=event.target.carPower.value;
			var carColor=event.target.carColor.value;
			var carAdditionalOptions=event.target.carAdditionalOptions.value;
			var carDescription=event.target.carDescription.value;
			// Tags can be given for each car based on the description when added
			// and also when it receives review, the text can b e analyzed and tags updated
			// based on Micaela's work
			var tags;

			var confirm=window.confirm("Are you sure everything you entered is correct?");
			if(confirm){
				CarsList.insert({
					// add the rest input fields here
					brand: carBrand,
					createdBy: currentUserId,
					rating: 0,

					model: carModel,
					year: carYear,
					version: carVersion,
					category: carCategory,
					registration: carRegistration,
					fuel: carFuel,
					km: carKm,
					technology: carTechnology,
					transmission: carTransmission,
					consumption: carConsumption,
					mph: carMPH,
					price: carPrice,
					engine: carEngine,
					topSpeed: carTopSpeed, 
					warranty: carWarranty,
					power: carPower,
					color: carColor,
					additionalOptions: carAdditionalOptions,
					description: carDescription,
				});
			}
			// clear the rest of the fields here
			event.target.carBrand.value="";
			event.target.carModel.value="";
			event.target.carYear.value="";
			event.target.carVersion.value="";
			event.target.carCategory.value="";
			event.target.carRegistration.value="";
			event.target.carFuel.value="";
			event.target.carKm.value="";
			event.target.carTransmission.value="";
			event.target.carTechnology.value="";
			event.target.carConsumption.value="";
			event.target.carMPH.value="";
			event.target.carPrice.value="";
			event.target.carEngine.value="";
			event.target.carTopSpeed.value="";
			event.target.carWarranty.value="";
			event.target.carPower.value="";
			event.target.carAdditionalOptions.value="";
			event.target.carDescription.value="";
		},
	});

	Template.filterSearch.helpers({
		//helper functions here
		'car': function(param, value){
			return CarsList.find({}, { sort: {rating: -1, brand: 1}});
			// this will sort it by rating first and then by brand
		},
		'selectedCar': function(){
			var carId=this._id;
			var selectedCar=Session.get('selectedCar');
			console.log("this does something "+selectedCar);
			if(carId==selectedCar){
				return "selected";
			}
		},
		'carBrand': function(){
			// console.log('radio button chosen '+radio);
			if (Session.get('filterBrand')!=null){
				return CarsList.find({
					brand: Session.get('filterBrand'),
					// color: Session.get('filterColor'),
					// transmission: Session.get('filterTransmission'),
				}, { sort: {rating: -1, brand: 1}});
			}
			if(Session.get('filterColor')!=null){
				return CarsList.find({
					// brand: Session.get('filterBrand'),
					color: Session.get('filterColor'),
					// transmission: Session.get('filterTransmission'),
				}, { sort: {rating: -1, brand: 1}});
			} // toa so e prvo go filtrira, drugite samo ako prvi se kliknat ali posle ne
			
			
			if(Session.get('filterTransmission')!=null){
				return CarsList.find({
					// brand: Session.get('filterBrand'),
					// color: Session.get('filterColor'),
					transmission: Session.get('filterTransmission'),
				}, { sort: {rating: -1, brand: 1}});
			}
			if(Session.get('filterTechnology')!=null){
				return CarsList.find({
					// brand: Session.get('filterBrand'),
					// color: Session.get('filterColor'),
					technology: Session.get('filterTechnology'),
				}, { sort: {rating: -1, brand: 1}});
			}
		},
	});


	Template.filterSearch.events({
		'click .showCars': function(){
			// console.log("You clicked something");
			var carId= this._id;
			Session.set('selectedCar', carId);
			var selectedCar = Session.get('selectedCar');
			console.log("Selected car -> "+selectedCar);
		},
		// 'change [type=radio]': function(event){
		// 	var radio=event.target.value;
		// 	console.log('radio button chosen '+radio);
		// },
		'change [type=radio]': function(event){
			event.preventDefault();
    		var documentId=this._id;
    		console.log("You selected the id "+documentId);

    		var isSelected=event.target.value;
    		if(isSelected=='on'){
    			Session.setDefault('filterBrand', "");
    			Session.setDefault('filterColor', "");
    			Session.setDefault('filterTransmission', "");
    			Session.setDefault('filterTechnology', "");
    			if(event.target.id == 'brand'){
    				// console.log("default -> "+Session.get('filterBrand'));
    				Session.set('filterBrand', event.target.name);
    				console.log('brand -> '+event.target.name);
    			}
    			if(event.target.id == 'color'){
    				// console.log("default -> "+Session.get('filterColor'));
    				Session.set('filterColor', event.target.name);
    				console.log(Session.get('filterColor'));
    				console.log('color -> '+event.target.name);
    			}
    			if(event.target.id == 'transmission'){
    				// console.log("default -> "+Session.get('filterTransmission'));
    				Session.set('filterTransmission', event.target.name);
    				console.log(Session.get('filterTransmission'));
    				console.log('transmission -> '+event.target.name);
    			}
    			if(event.target.id == 'technology'){
    				// console.log("default -> "+Session.get('filterTechnology'));
    				Session.set('filterTechnology', event.target.name);
    				console.log(Session.get('filterTechnology'));
    				console.log('technology -> '+event.target.name);
    			}

    		}
		},
		
	});

	// CarFilter = new Meteor.FilterCollections(CarsList, {
	// 	template: filterSearch,
	// });

	Template.carInfo.helpers({
		'user': function(){
			// var userId= Meteor.userId();
			var owner=CarsList.findOne({_id: this._id}, {});
			var userId=owner.createdBy;
			return Meteor.users.findOne({_id: userId});
		},
		'email': function(){
			var owner=CarsList.findOne({_id: this._id}, {});
			var userId=owner.createdBy;
			// console.log("car "+this._id);
			// console.log("created by ID "+owner.createdBy);
			var mail=Meteor.users.findOne({_id: userId}).profile.email;
			console.log("owner mail "+mail);
			return mail;
		},
		'firstName': function(){
			// console.log("first name");
			var owner=CarsList.findOne({_id: this._id}, {});
			var userId=owner.createdBy;
			var ime=Meteor.users.findOne({_id: userId}).profile.firstName;
			return ime;
		},
		'lastName': function(){
			// console.log("last name");
			var owner=CarsList.findOne({_id: this._id}, {});
			var userId=owner.createdBy;
			var prezime=Meteor.users.findOne({_id: userId}).profile.lastName;
			return prezime;
		},
		'country': function(){
			// console.log("country");
			var owner=CarsList.findOne({_id: this._id}, {});
			var userId=owner.createdBy;
			var drzava=Meteor.users.findOne({_id: userId}).profile.country;
			return drzava;
		},
		'phone': function(){
			// console.log("phone");
			var owner=CarsList.findOne({_id: this._id}, {});
			var userId=owner.createdBy;
			var tel=Meteor.users.findOne({_id: userId}).profile.phone;
			return tel;
		},
		'address': function(){
			// console.log("address");
			var owner=CarsList.findOne({_id: this._id}, {});
			var userId=owner.createdBy;
			var adresa=Meteor.users.findOne({_id: userId}).profile.address;
			return adresa;
		},
		
	});

	Template.userProfile.helpers({
		'user': function(){
			var userId=Meteor.userId();
			return Meteor.users.find({});
			// CarsList.find({}, { sort: {rating: -1, brand: 1}});
			// this will sort it by rating first and then by brand
		},
		'username': function(){
			return Meteor.user().username;
		},
		'email': function(){
			return Meteor.user().emails["0"].address;
		},
		'firstName': function(){
			return Meteor.user().profile.firstName;
		},
		'lastName': function(){
			return Meteor.user().profile.lastName;
		},
		'country': function(){
			return Meteor.user().profile.country;
		},
		'phone': function(){
			return Meteor.user().profile.phone;
		},
		'address': function(){
			return Meteor.user().profile.address;
		},
		'userCars': function(){
			var currentUserId=Meteor.userId();
			return CarsList.find({ createdBy: currentUserId}, { sort: {rating: -1, brand: 1}});
		},
	});

	Template.userProfile.events({
		'keyup [name=userFirstName]': function(event){
			// edit the car information i.e. car brand in this case
			// the event is attached to a specific element and we only need to extract the value of event.target
			// the focused field loses focus when either enter or esc are tapped
			if(event.which == 13 || event.which == 27) {
				// the field looses focus when the user tappes enter or esc
				event.target.blur();
			}
			else {
				var userId=Meteor.userId();
				var userFirstName=event.target.value;
				// console.log("User "+userId +" task changed to: " + userFirstName);
				Meteor.users.update({_id: userId}, { $set: {"profile.firstName": userFirstName}});
			}
		},
		'keyup [name=userLastName]': function(event){
			// edit the car information i.e. car brand in this case
			// the event is attached to a specific element and we only need to extract the value of event.target
			// the focused field loses focus when either enter or esc are tapped
			if(event.which == 13 || event.which == 27) {
				// the field looses focus when the user tappes enter or esc
				event.target.blur();
			}
			else {
				var userId=Meteor.userId();
				var userLastName=event.target.value;
				// console.log("User "+userId +" task changed to: " + userLastName);
				Meteor.users.update({_id: userId}, { $set: {"profile.lastName": userLastName}});
			}
		},
		'keyup [name=userCountry]': function(event){
			// edit the car information i.e. car brand in this case
			// the event is attached to a specific element and we only need to extract the value of event.target
			// the focused field loses focus when either enter or esc are tapped
			if(event.which == 13 || event.which == 27) {
				// the field looses focus when the user tappes enter or esc
				event.target.blur();
			}
			else {
				var userId=Meteor.userId();
				var userCountry=event.target.value;
				// console.log("User "+userId +" task changed to: " + userCountry);
				Meteor.users.update({_id: userId}, { $set: {"profile.country": userCountry}});
			}
		},
		'keyup [name=userEmail]': function(event){
			// edit the car information i.e. car brand in this case
			// the event is attached to a specific element and we only need to extract the value of event.target
			// the focused field loses focus when either enter or esc are tapped
			if(event.which == 13 || event.which == 27) {
				// the field looses focus when the user tappes enter or esc
				event.target.blur();
			}
			else {
				var userId=Meteor.userId();
				var userEmail=event.target.value;
				// console.log("User "+userId +" task changed to: " + userCountry);
				Meteor.users.update({_id: userId}, { $set: {"email": userEmail}});
				Meteor.users.update({_id: userId}, { $set: {"profile.email": userEmail}});
				// emails are not published so instead of publishing them, I decided to add another field which would be kept updated ofc
			}
		},
		'keyup [name=userPhone]': function(event){
			// edit the car information i.e. car brand in this case
			// the event is attached to a specific element and we only need to extract the value of event.target
			// the focused field loses focus when either enter or esc are tapped
			if(event.which == 13 || event.which == 27) {
				// the field looses focus when the user tappes enter or esc
				event.target.blur();
			}
			else {
				var userId=Meteor.userId();
				var userPhone=event.target.value;
				// console.log("User "+userId +" task changed to: " + userPhone);
				Meteor.users.update({_id: userId}, { $set: {"profile.phone": userPhone}});
			}
		},
		'keyup [name=userAddress]': function(event){
			// edit the car information i.e. car brand in this case
			// the event is attached to a specific element and we only need to extract the value of event.target
			// the focused field loses focus when either enter or esc are tapped
			if(event.which == 13 || event.which == 27) {
				// the field looses focus when the user tappes enter or esc
				event.target.blur();
			}
			else {
				var userId=Meteor.userId();
				var userAddress=event.target.value;
				// console.log("User "+userId +" task changed to: " + userAddress);
				Meteor.users.update({_id: userId}, { $set: {"profile.address": userAddress}});
			}
		},
	});

	Template.reviews.events({
		'submit form': function(event){
			event.preventDefault();
			// insert a review in the database
			// var currentUserId = Meteor.userId();
			// maybe there should ne an If statement to check if user is logged in and if not then do the first line
			// input fields here
			var reviewUser=event.target.reviewUser.value;
			var reviewRating=event.target.reviewRating.value;
			var reviewDescription=event.target.reviewDescription.value;
			
			CarsList.insert({
				// add the rest input fields here
				createdBy: reviewUser,
				rating: reviewRating,
				review: reviewDescription,
			});

			// clear the rest of the fields here
			event.target.reviewUser.value="";
			event.target.reviewRating.value="";
			event.target.reviewDescription.value="";
			
		},
	});

	Template.registerNew.events({
		'submit form': function(event){
			event.preventDefault();
			var username=event.target.registerUsername.value;
			var email=event.target.registerEmail.value;
			var pass=event.target.registerPass.value;
			var confirmPass=event.target.registerConfirmPass.value;
			var firstName=" ";
			var lastName=" ";
			var country=" ";
			var mobile=" ";
			var address=" ";
			// var confirmPass=target.registerPassConfirm.value;
			console.log("Form submitted");
			if(pass === confirmPass){
				Accounts.createUser({
				email: email,
				password: pass,
				username: username,
				profile: {
					firstName: firstName,
					lastName: lastName,
					country: country,
					phone: mobile,
					address: address,
					email: email,
				},

				}, function(error){
					if(error) { // if registration fails
	            		console.log(error.reason); // Output error 
	            		// 3 reasons for error
	            		// “Email already exists”, if the email is registered to another user
	            		// “Need to set a username or email”, if the email field is empty.
	            		// “Password may not be empty”, if the password field is empty
	            		return window.alert(error.reason);
	          		}
	          		else{
	          			Router.go('home'); // Redirect user if registration succeeds
	          		}
				});
			}
			else{
				return window.alert("Passwords don't match.");
			}
		},
	});

	Template.registerNew.onRendered(function(){
    	$('#email').validate();
	});

	Template.loginNew.events({
		'submit form': function(event){
			event.preventDefault();
			var username=event.target.loginUsername.value;
			var pass=event.target.loginPass.value;
			console.log("log");
			Meteor.loginWithPassword(username, pass, function(error){
				if(error){
					console.log(error.reason);
					// 3 reasons for error:
					// “Match failed”, if both of the form fields are empty.
					// “User not found”, if the email doesn’t belong to a registered user.
					// “Incorrect password”, if the user is found but their password is wrong.
					return window.alert(error.reason);
				}
				else{
					var currentRoute=Router.current().route.getName(); // if the user navigated to a page he cannot access if not logged in
					if(currentRoute == "register"){ // he is redirected to log in with line 22 and after he logged in, he will continue to the page he wanted to go
						Router.go('home'); // if this is not the case, he will simply be redirected home
					}
				}
			});
			console.log("Logged in.");
		},
	});

	Template.navigationItems.events({
		'click .logout': function(event){
			event.preventDefault();
			Meteor.logout();
			Router.go('register');
		},
	});


	Template.newPass.events({
		'submit form': function(event){
			event.preventDefault();
			var pass=event.target.newPassPass.value;
			var newPass=event.target.newPassNewPass.value;
			// Meteor.loginWithPassword(username, pass);
			Accounts.changePassword(pass, newPass, function(error){
				if(error){
					console.log(error.reason);
				}
				else{
					console.log("success");
				}
			});
			console.log("changed pass");
		},
	});

	Template.forgotPass.events({
		'submit form': function(event){
			event.preventDefault();
			var email=event.target.forgotPassEmail.value;
			// Meteor.loginWithPassword(username, pass);
			Accounts.forgotPassword(email, function(error){
				if(error){
					console.log(error.reason);
				}
				else{
					console.log("success");
				}
			});
			console.log("email sent");
		},
	});


}

if(Meteor.isServer){
	//this code only runs on server

	Accounts.onCreateUser(function(options, user) {
		// The options object comes from the Accounts.createUser() call that was made on the client
		// The user argument is created on the server 
		// and contains a proposed user object with all the automatically generated fields required for the user to log in.
	   // Use provided profile in options, or create an empty object
	   user.profile = options.profile || {};

	   // Assigns first and last names to the newly created user object
	   user.profile.firstName = options.firstName;
	   user.profile.lastName = options.lastName;
	   user.profile.country = options.country;
	   user.profile.phone = options.phone;
	   user.profile.address = options.address;
	   
	   // Returns the user object
	   return user;
	});
	// Meteor.FilterCollections.publish(CarsList, {
	// 	name: 'carFilter',
	// });
	
}

Meteor.startup(function () { 
(function(){
  // Add smooth scrolling to all links
  $("#search").on('click', function(event) {

    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
      $('template').animate({
        scrollTop: $(hash).offset().top
      }, 800, function(){
   
        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
      });
    } // End if
  });
});
})

