Meteor.users.deny({
  update: function() {
    return true;
  }
});

Meteor.startup(function (){
//Meteor.users.remove({});

var usr = Meteor.users.findOne({"emails.address":"admin@cedia.org"});

//db.users.findOne({emails: $elemMatch: { "address" : "admin@cedia.org" }})
//var usr = Meteor.users.findOne({emails: $elemMatch : { "address" : "admin@cedia.org" }});
//var usr = Meteor.users.findOne({emails: $elemMatch : { "address" : "admin@cedia.org" }});

    console.log ("Usuario EXISTE?");
   console.log (usr);
   if (typeof  usr === 'undefined') {
       Accounts.createUser({
                          //  username: "admin@cedia.org",
                            email : "admin@cedia.org",
                            password : "GTR2017",
                            profile  : {
                               lang: "es" ,  'access' : 2
                            } , function () { console.log ("Hola0");
       /*if (err) {
        console.log ("Error");
       console.log (err.reason);
       } else {
       var newUserId = Meteor.UserId();
       console.log ("USUARIO ADMIN CREADO");
       console.log (newUserId);
       Profile.insert({ idProfile: newUserId ,  nameUser: "Admin", direction: "" , levelAcademic: "0", areasInterest: [], language: "es", password: "", secMail:  "admin@cedia.org" , accessLevel: "2"});

       }*/
      }
                          

    });
   }

   });