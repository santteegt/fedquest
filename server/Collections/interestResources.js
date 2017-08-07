InterestResources = new Meteor.Collection("interestResource");
// Publish the collection to the client
Meteor.publish("interestResources", function() {
    return InterestResources.find();
});
    

// Set permissions on this collection
InterestResources.deny({
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

InterestResources.allow({
    
});


Meteor.startup(function (){

});