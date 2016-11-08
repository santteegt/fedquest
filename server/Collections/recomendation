Recomendation = new Meteor.Collection("recomendation");
// Publish the collection to the client
Meteor.publish("recomendation", function() {
    return Recomendation.find();
});
    

// Set permissions on this collection
Recomendation.deny({
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

Recomendation.allow({
    
});


Meteor.startup(function (){

});