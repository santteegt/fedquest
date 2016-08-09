Searchs = new Meteor.Collection("searchs");
// Publish the collection to the client
Meteor.publish("searchs", function() {
    return Searchs.find();
});
    

// Set permissions on this collection
Searchs.deny({
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

Searchs.allow({
    
});


Meteor.startup(function (){
//Searchs.remove({});
});