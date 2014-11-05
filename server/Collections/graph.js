/**
    The graphs collection
*/

// Declare the collection
Graphs = new Meteor.Collection("graphs");
// Publish the collection to the client
//Meteor.publish("graphsAll", function(endpointURI, graphURI) {
    //var array = Graphs.find({endpoint: endpointURI, graphURI: graphURI}, {fields: {'subject.prefix': 0, 'subject.name': 0}}).fetch();
    //return Graphs.find({endpoint: endpointURI, graphURI: graphURI}, {fields: {'subject.prefix': 0, 'subject.name': 0}}).fetch();
    //a = _.groupBy(array, function(obj){return obj.endpoint + '-' + obj.graphURI;});
    //for(endpoint in a) {
        //resultSet = {};
        //b = a[endpoint];
        //c = _.groupBy(b, function(obj){return obj.predicate.fullName;}); 
        /*
        c = _.groupBy(array, function(obj){return obj.predicate.fullName;}); 
        for(property in c) {
          d = c[property];
          e = _.uniq(d, false, function(obj){return obj.subject.fullName + '-' + obj.objectType.objectEntity.fullName;});
          f = _.pluck(e, 'subject');
          g = _.pluck(e, 'objectType');
          g = _.uniq(g, false, function(obj){return obj.dataType;});
          propertyItem = {};
          propertyItem.allowedEntities = f;
          propertyItem.dataType = g;
          resultSet[property] = propertyItem;
        }*/
        
    //}
    //return resultSet;
    //return Graphs.find();
//});
    

// Set permissions on this collection
Graphs.deny({
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

Graphs.allow({
    // Client can add records
    
});

// What to do when the server first starts up
Meteor.startup(function (){
    //Fill the collection with some initial data if it's empty
    //Graphs.remove({});
    /*if(Graphs.find().count() == 0) {
        console.log('insertanto Grafo de ejemplo');
        Graphs.insert(
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
        