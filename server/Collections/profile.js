Profile = new Meteor.Collection("profile");
// Publish the collection to the client
Meteor.publish("profile", function() {
    if ( !(_.isNull(this.userId) || _.isUndefined(this.userId))){
    var usuario = Meteor.users.findOne({'_id' : this.userId});
    var accessL = usuario.profile.access;
    console.log ("Puede consultar"+this.userId+usuario.profile.access);
    if (accessL >1){
    return Profile.find();
    } else {
    return Profile.find({'idProfile' : this.userId});
    } }
});
    

// Set permissions on this collection
Profile.deny({
    // Records can't be deleted or edited
  remove: function(userId, doc) {
        console.log ("Profile ");
        console.log (userId);
        console.log (doc);
        return false;
    },
    update: function (userId, doc) {
        console.log ("Profile ");
        console.log (userId);
        console.log (doc);
        return false;
    },
    // Client can add records
    insert: function(userId, doc) {
        console.log ("Profile ");
        console.log (userId);
        console.log (doc);
        return false;
    }
});

Profile.allow({

    
});

// What to do when the server first starts up
Meteor.startup(function (){
//Profile.remove({});
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
       