// Declare the collection
Configuration = new Meteor.Collection("configuration");


Meteor.publish("configuration", function(){
    return Configuration.find();
});
    

// Set permissions on this collection
Configuration.deny({
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

Configuration.allow({
    
});

// What to do when the server first starts up
Meteor.startup(function (){
    //Fill the collection with some initial data if it's empty
   // Properties.remove({});
    /*if(Properties.find().count() == 0) {
        console.log('insertanto Grafo de ejemplo');
        Properties.insert(
            {
                endpoint: "http://190.15.141.102:8890/sparql",
                graphURI: "http://dspace.ucuenca.edu.ec/resource/",
                subject: {fullName: "http://purl.org/ontology/bibo/Thesis", prefix: 'bibo', name: 'Thesis'},
                predicate: { fullName: "http://purl.org/ontology/bibo/title", prefix:'bibo', name: 'title'},
                objectType: { objectEntity: '', dataType: 'xsd^string', sampleValue: 'Titulo Prueba'},
            }
        );
    }*/
});