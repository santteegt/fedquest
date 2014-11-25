
if (Meteor.isClient) {

  //Suscribe to Collections
  Tracker.autorun(function () {
    Meteor.subscribe("allproperties");
    Meteor.subscribe("endpoints");
    Meteor.subscribe("queries");
    Meteor.subscribe("prefixes");
  });
  
  this.App = {};
  this.Graphs = new Meteor.Collection("graphs");
  this.Properties = new Meteor.Collection("properties");
  this.Prefixes = new Meteor.Collection("prefixes");
  this.Endpoints = new Meteor.Collection("endpoints");
  this.Queries = new Meteor.Collection("queries");
  this.App.resultCollection = new Meteor.Collection(null);

  Template.samples.helpers({
      queriesAvailable: function(){
        return Queries.find().fetch();
        },

      settings: function () {
        return {
            rowsPerPage: 10,
            showFilter: true,
            //showNavigation: 'auto',
            //showColumnToggles: true,
            fields: 
            [
                {
                  key: 'title',
                  label: 'Title',
                  fn: function (title, object) {
                  var html = '<a href="/dashboard/' + object._id + '">' + title + '</a>';
                  return new Spacebars.SafeString(html);
                  }
                  },
                  { key: 'description', label: 'Description' }
            ]
        };
      }
  });

  Template.dashboard.helpers({
      endpointsAvailable: function(){
        return Endpoints.find({status: 'A'}).fetch();
        },

      resultQuery: function(){
        var response = App.resultCollection.findOne();
        return response ? JSON.parse(response.content).results.bindings: [];
      },

      settings: function () {
        var response = App.resultCollection.findOne();
        if(response) {
          var prefixService = Prefixes.find().fetch();
          var endpoints = Endpoints.find().fetch();
          var fields=JSON.parse(response.content).head.vars;
          var dataField=[];
          _.forEach(fields,function(field){
              var item={};
              item.key=field;
              item.label=field;
              item.fn= function (object) {
                    if(object.type == 'uri') {
                      var prefix = _.find(prefixService,function(obj){return object.value.indexOf(obj.URI) == 0});
                      var showValue;
                      if(!prefix) { //find endpoint name as prefix
                        var endpoint = _.find(endpoints,function(obj){return object.value.indexOf(obj.graphURI) == 0});
                        showValue = endpoint ? (endpoint.name + ':' + object.value.substring(endpoint.graphURI.length)):object.value;
                      } else {
                        showValue = prefix.prefix + ':' + object.value.substring(prefix.URI.length);
                      }
                      //var showValue = prefix ? (prefix.prefix+':'+object.value.substring(prefix.URI.length)):object.value;
                      var html = '<a href="' + object.value + '">' + showValue + '</a>';
                    }else{
                      var html = '<p> '+ object.value + '</p>';
                    } 
                    return new Spacebars.SafeString(html);
                    };
              dataField.push(item);
            });      

          return {
              rowsPerPage: 10,
             // showFilter: true,
              showNavigation: 'auto',
              showColumnToggles: true,
              fields: dataField,
          };
        }
      }
  });

  Template.endpoint.helpers({
      endpointEntity: function(){
        //var entities = Properties.find({},{fields: {'subjects': 1, _id: 1}}).fetch();
        var endpoints = Session.get('endpoints');
        var response = [];
        
        response.status = 'EMPTY';
        if(endpoints && endpoints.length > 0) {
          console.log('==Si existen edpoints');
          response.status = 'OK';
          endpoints.forEach(function(obj) {
            var graph = {};
            graph.name = obj.name
            graph.colorid = obj.colorid;
            graph.endpoint = obj.endpoint;
            graph.graphURI = obj.graphURI;
            graph.description = obj.description;
            var entities = Properties.find( {endpoint: obj.endpoint, 
                                           graphURI: obj.graphURI} 
                                          ).fetch();
            var properties = entities;
            entities = _.pluck(entities, 'subjects');
            //console.log('==encontrados: ' + entities.length);
            var values = [];
            for(var i=0; i<entities.length; i++) {
              values = _.union(values, entities[i]);
            }
            graph.endpointEntities = _.uniq(values, false, function(obj){return obj.fullName;});
            graph.endpointProperties = properties;
            Session.set(graph.endpoint + '|' + graph.graphURI, {entities: graph.endpointEntities, properties: graph.endpointProperties});
            response.push(graph);
            //console.log(graph);
          });
          
          /*var entities = Properties.find( {endpoint: {$in :_.pluck(endpoints, 'endpoint')}, 
                                           graphURI: {$in: _.pluck(endpoints, 'graphURI')}}, 
                                          {sort: {endpoint: -1, graphURI: -1}}).fetch();
          entities = _.pluck(entities, 'subjects');
          var values = [];
          for(var i=0; i<entities.length; i++) {
            values = _.union(values, entities[i]);
          }
          response.status = 'OK';
          response.endpointEntities = _.uniq(values, false, function(obj){return obj.fullName;});
          response.endpointProperties = entities;
          Session.set('entities', entities);*/
          //Session.set('graphs', response);
        }
        //console.log(response);
        return response;
        //return _.uniq(values, false, function(obj){return obj.fullName;});
      }/*,

      endpointProperty: function(){
          Session.set('properties', Properties.find().fetch());
          console.log('#### : ' + Properties.find().fetch().length);
          return Properties.find();
        }*/
    });

  Template.hello.greeting = function() {
    return "Hello from sparqlfedquery";
  }

  Template.hello.helpers({
    counter: function () {
      return Session.get("counter");
    }
  });

  Template.hello.events({
    'click button': function () {
      console.log('just a test');
    }
  });

  Meteor.startup(function() {
    console.log('inicializacion');
    return $(function() {
      App.router = new Router();
      console.log('inicializacion OK');
      return Backbone.history.start({
        pushState: true
      });
    });
  });
}