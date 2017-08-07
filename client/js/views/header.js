
/*
    View logic for the header component
 */
this.HeaderView = Backbone.View.extend({
 // template: null,
  tagName: "div",
  id: "header",
  initialize: function() {
    var me;
    me = this;


    /*Template.header.events = {
      "click a": function(e) {
        return App.router.aReplace(e);
      }
    };*/
   //return this.template = Blaze.toHTMLWithData(Template.header, {});  //Cambioi js
  // return this.template = Blaze.render(Template.header, {});  //Cambioi js
  /*  return this.template = Meteor.render(function() {
      var loggedIn, name;
      loggedIn = Meteor.userId() != null;
      if (loggedIn && (Meteor.user() != null) && (Meteor.user().profile != null)) {
        name = Meteor.user().profile.name;
      }
      return Blaze.toHTMLWithData(Template.header, {});
      return Template.header({
        loggedIn: loggedIn,
        name: name
      });

    });*/
  },
  render: function() {
      Blaze.render(Template.header, $('#sparql-header')[0]);  // Cambio js
      Template['_loginButtonsLoggedInDropdown-over'].replaces('_loginButtonsLoggedInDropdown');
      Template['_loginButtonsLoggedOutDropdown-over'].replaces('_loginButtonsLoggedOutDropdown');
      Template['_loginButtonsLoggedInDropdownActions-over'].replaces('_loginButtonsLoggedInDropdownActions');
      Template['_loginButtonsLoggedOutPasswordService-over'].replaces('_loginButtonsLoggedOutPasswordService');
      Template['_loginButtonsBackToLoginLink-over'].replaces ('_loginButtonsBackToLoginLink');
      Template['_loginButtonsFormField-over'].replaces ('_loginButtonsFormField');
      Template['_loginButtonsChangePassword-over'].replaces ('_loginButtonsChangePassword');
      Template['_resetPasswordDialog-over'].replaces ('_resetPasswordDialog');
   // this.$el.html(this.template); //Cambio js
    console.log('Render header');
    this.setEvents($('#sparql-header'));
    return this;
  } , setEvents: function () {




   $("#lang-esp").click(function () {   
 /// language ();
     lang.init("USER_PROFILE","es");
  //   lang.add("es");
      alert("es");
  
  });

$("#lang-en").click(function () {   
 /// language ();
    lang.init("USER_PROFILE","en");
   // lang.add("en");
      alert("en");
  
  });

  }
});

Template._loginButtonsChangePassword.helpers({
  fields: function () {
    return [
      {fieldName: 'old-password', fieldLabel: lang.lang ("Current_password" ), inputType: 'password',
       visible: function () {
         return true;
       }},
      {fieldName: 'password', fieldLabel: lang.lang ("New_password"), inputType: 'password',
       visible: function () {
         return true;
       }}
    ];
  }
});



var forgotPassword = function () {
  loginButtonsSession.resetMessages();

  var email = trimmedElementValueById("forgot-password-email");
  if (email.indexOf('@') !== -1) {
    Accounts.forgotPassword({email: email}, function (error) {
      if (error)
        loginButtonsSession.errorMessage(error.reason || "Unknown error");
      else
        loginButtonsSession.infoMessage("Email enviado");
    });
  } else {
    loginButtonsSession.errorMessage("Email Invalido ");
  }
};


Template.header.helpers({
   access_level: function() {
  if (!_.isNull(Meteor.user())&& !_.isUndefined(Meteor.user())) {
          var valaccess = Meteor.user().profile.access;
        //var obj = Meteor.user().profile[1];
        //var valaccess =  obj[Object.keys(obj)[0]];
        console.log (valaccess);
         return valaccess > 1;
    } else {
    return false;
    }
   
  } ,

  access_adv: function() {
  if (!_.isNull(Meteor.user())&& !_.isUndefined(Meteor.user())) {
 
       // var obj = Meteor.user().profile[1];
       var valaccess = Meteor.user().profile.access;
        //obj[Object.keys(obj)[0]];
     //   console.log (valaccess);
         return valaccess  > 0;
    } else {
    return false;
    }
   
  } , 
  optbuttondis: function () {

   var location = window.location.pathname;
   if (window.location.pathname.indexOf("dashboard") > 0){
    return true;
   } else {
    return false;
   }
  
  }  
});

/*
Hooks.onCreateUser = function () { 
 //alert ("Login");
 console.log ("Usario Creado");
 }; 
*/

/*

AccountsTemplates.configure({
    SignUpHook: function () {
      alert ("Creado") ; }
    
});*/