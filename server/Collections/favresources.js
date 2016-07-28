Favresources = new Meteor.Collection("favresources");
// Publish the collection to the client
Meteor.publish("favresources", function() {
    return Favresources.find();
});
    

// Set permissions on this collection
Favresources.deny({
    // Records can't be deleted or edited
    remove: function(userId, doc) {
        console.log ("No permitido");
        return true;
    },
    update: function (userId, doc) {
        console.log ("No permitido");
        return true;
    },
    // Client can add records
    insert: function(userId, doc) {
        console.log ("No permitido");
        return true;
    }
});

Favresources.allow({
    
});


Meteor.startup(function (){

});