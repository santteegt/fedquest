/**
    The prefixes collection
*/

// Declare the collection
Prefixes = new Meteor.Collection("prefixes");
// Publish the collection to the client
Meteor.publish("prefixes", function() {
    return Prefixes.find();
});
    

// Set permissions on this collection
Prefixes.deny({
    // Records can't be deleted or edited
    remove: function(userId, doc) {
        return false;
    },
    update: function (userId, doc) {
        return false;
    },
    insert: function(userId, doc) {
        return true;
    }
});

Prefixes.allow({
    
});

// What to do when the server first starts up
Meteor.startup(function (){
    //Fill the collection with some initial data if it's empty
    if(Prefixes.find().count() == 0) {
        Prefixes.insert(
            {
                prefix: "dcterms",
                URI: "http://purl.org/dc/terms/"
            }
        );
        
    }
});