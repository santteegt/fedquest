/**
    The properties collection
*/

Properties = new Meteor.Collection("properties");


Meteor.publish("allproperties", function(){
    return Properties.find();
});

Properties.deny({
    // Records can't be deleted or edited
    remove: function(userId, doc) {
        return false;
    },
    update: function (userId, doc) {
        return false;
    },
    insert: function(userId, doc) {
        return false;
    }
});

Properties.allow({
    
});

// What to do when the server first starts up
Meteor.startup(function (){

});

