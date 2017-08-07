/**
    The endpoints collection
*/

// Declare the collection
Endpoints = new Meteor.Collection("endpoints");
// Publish the collection to the client
Meteor.publish("endpoints", function() {
    return Endpoints.find();
});
    

// Set permissions on this collection
Endpoints.deny({
    // Records can't be deleted or edited
    remove: function(userId, doc) {
        return false;
    },
    update: function (userId, doc) {
        return false;
    },
    // Client can add records
    insert: function(userId, doc) {
       return false;
    }
});

Endpoints.allow({
    
});

// What to do when the server first starts up
Meteor.startup(function (){
    //Fill the collection with some initial data if it's empty
    // Endpoints.remove({});
    /*if(Endpoints.find().count() == 0) {
        console.log('insertanto Endpoint de ejemplo');
        Endpoints.insert(
            {
                colorid: "#FFFFFF",
                endpoint: "http://190.15.141.102:8890/sparql",
                graphURI: "http://dspace.ucuenca.edu.ec/resource/",
                description: "test"
                status: 'A',
                base: false,
                lastMsg: ''
            }
        );
    }*/
});
        
