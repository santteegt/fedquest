/**
    The queries collection
*/

// Declare the collection
Queries = new Meteor.Collection("queries");
// Publish the collection to the client
Meteor.publish("queries", function() {
    return Queries.find();
});
    

// Set permissions on this collection
Queries.deny({
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

Queries.allow({
    
});

// What to do when the server first starts up
Meteor.startup(function (){
    //Fill the collection with some initial data if it's empty
  //Queries.remove({});
    /*if(Queries.find().count() == 0) {
        console.log('insertanto Endpoint de ejemplo');
        Queries.insert(
            {
                user: 'admin', 
                title: 'testQuery', 
                description: 'testDescription',
                jsonGraph:  '{"cells":[{"type":"html.Element","position":{"x":60,"y":50},"size":{"width":100,"height":40},"id":"630b11e8-dd63-45f6-b78c-d6ef599ef7ea","predicate":"null","endpoint":"1","data":"Tesis","z":5,"attrs":{"rect":{"fill":"blue"},"text":{"text":"Tesis"}}},{"type":"html.Element","position":{"x":60,"y":190},"size":{"width":100,"height":40},"id":"bd8d50bb-b63f-40f3-8e1e-80a4b2156115","predicate":"ths","endpoint":"1","data":"?director","z":6,"attrs":{"rect":{"fill":"blue"},"text":{"text":"?director"}}},{"type":"link","source":{"id":"bd8d50bb-b63f-40f3-8e1e-80a4b2156115"},"target":{"id":"630b11e8-dd63-45f6-b78c-d6ef599ef7ea"},"id":"e6d54def-7e57-43f8-9558-ba0f27952cd9","labels":[{"position":0.5,"attrs":{"text":{"text":"ths"}}}],"smooth":true,"z":7,"attrs":{".connection":{"stroke":"black","stroke-width":"2"}}},{"type":"html.Element","position":{"x":340,"y":220},"size":{"width":100,"height":40},"id":"fb6e8078-6be1-482c-9ff6-5bc9accd1210","predicate":"foaf:lastName","endpoint":"1","data":"?lastName","z":8,"attrs":{"rect":{"fill":"blue"},"text":{"text":"Ortiz Segarra"}}},{"type":"link","source":{"id":"fb6e8078-6be1-482c-9ff6-5bc9accd1210"},"target":{"id":"bd8d50bb-b63f-40f3-8e1e-80a4b2156115"},"id":"22eccf8e-22f3-4c27-96f5-268122ca928f","labels":[{"position":0.5,"attrs":{"text":{"text":"foaf:lastName"}}}],"smooth":true,"z":9,"attrs":{".connection":{"stroke":"black","stroke-width":"2"}}},{"type":"html.Element","position":{"x":350,"y":20},"size":{"width":100,"height":40},"id":"bac365f2-229e-4bd8-a4aa-587f3e0aef40","predicate":"title","endpoint":"1","data":"?title","z":10,"attrs":{"rect":{"fill":"blue"},"text":{"text":"?titleTesis"}}},{"type":"link","source":{"id":"bac365f2-229e-4bd8-a4aa-587f3e0aef40"},"target":{"id":"630b11e8-dd63-45f6-b78c-d6ef599ef7ea"},"id":"d1b71a79-c97c-4e96-ab9e-7dd37afd6132","labels":[{"position":0.5,"attrs":{"text":{"text":"title"}}}],"smooth":true,"z":11,"attrs":{".connection":{"stroke":"black","stroke-width":"2"}}},{"type":"html.Element","position":{"x":60,"y":390},"size":{"width":100,"height":40},"id":"e3f1fe35-d916-4ea7-ac0c-fff720386377","predicate":"null","endpoint":"1","data":"Article","z":12,"attrs":{"rect":{"fill":"red"},"text":{"text":"Article"}}},{"type":"html.Element","position":{"x":60,"y":280},"size":{"width":100,"height":40},"id":"d3633ce1-7a71-49bb-93a9-1421effcabac","predicate":"aut","endpoint":"1","data":"?aut","z":13,"attrs":{"rect":{"fill":"red"},"text":{"text":"?aut"}}},{"type":"link","source":{"id":"d3633ce1-7a71-49bb-93a9-1421effcabac"},"target":{"id":"e3f1fe35-d916-4ea7-ac0c-fff720386377"},"id":"f2c5301b-fc26-43bd-98a0-212c7ad1d5e1","labels":[{"position":0.5,"attrs":{"text":{"text":"aut"}}}],"smooth":true,"z":14,"attrs":{".connection":{"stroke":"black","stroke-width":"2"}}},{"type":"html.Element","position":{"x":350,"y":430},"size":{"width":100,"height":40},"id":"6c62590d-0018-4efe-9eb3-f0fe71c98e0b","predicate":"title","endpoint":"1","data":"?title","z":15,"attrs":{"rect":{"fill":"red"},"text":{"text":"?title"}}},{"type":"link","source":{"id":"6c62590d-0018-4efe-9eb3-f0fe71c98e0b"},"target":{"id":"e3f1fe35-d916-4ea7-ac0c-fff720386377"},"id":"caaee3f7-c43a-49be-ac1b-01531188cc11","labels":[{"position":0.5,"attrs":{"text":{"text":"title"}}}],"smooth":true,"z":16,"attrs":{".connection":{"stroke":"black","stroke-width":"2"}}},{"type":"link","source":{"id":"fb6e8078-6be1-482c-9ff6-5bc9accd1210"},"target":{"id":"d3633ce1-7a71-49bb-93a9-1421effcabac"},"id":"b777d4c9-4a1d-4145-906d-6b3c3995fada","labels":[{"position":0.5,"attrs":{"text":{"text":"foaf:lastName"}}}],"smooth":true,"z":17,"attrs":{".connection":{"stroke":"black","stroke-width":"2"}}}]}',
                sparql: ''
            }
        );
    }*/
});
        
