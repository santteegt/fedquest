
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
  // Muestra consultas - JS
  Template.samples.helpers({
      queriesAvailable: function(){
        return Queries.find().fetch();
        },

      settings: function () {
        return {
         //   rowsPerPage: 10,
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


//JO
//zero padding function
function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
//JO*

  Template.dashboard.helpers({
      endpointsAvailable: function(){
        return Endpoints.find({status: 'A'}).fetch();
      },

      listEndpointsAvailable: function(){
        return Endpoints.find({status: 'A'}, {sort: {base: -1}}).fetch();
      },

      resultQuery: function(){
        var response = App.resultCollection.findOne();
	var resp = response ? JSON.parse(response.content).results.bindings: [];
        for (var x=0; x<resp.length ; x++){
	    resp[x].num=x+1;
	}
        return resp;
      },

      settings: function () {
        var response = App.resultCollection.findOne();
        if(response) {
          var prefixService = Prefixes.find().fetch();
          var endpoints = Endpoints.find().fetch();
          var fields=JSON.parse(response.content).head.vars;
          var dataField=[];
//JO
//Adding row number column
          var item={};
          item.key="cont.value";
          item.label="#";
          item.fn= function (data,object) {
                    var html = '<p> '+ pad(object.num,4) + '</p>';
                    return new Spacebars.SafeString(html);
              };
          item.sortOrder=0;
	  dataField.push(item);
//JO*
          _.forEach(fields,function(field){
              var item={};
              item.key=field+".value";
              item.label=field;
              item.fn= function (data,object) {
                    var typeObject= object[field].type;
                    if(typeObject == 'uri') {
                      var prefix = _.find(prefixService,function(obj){return object[field].value.indexOf(obj.URI) == 0});
                      var showValue;
                      if(!prefix) { //find endpoint name as prefix
                        var endpoint = _.find(endpoints,function(obj){return object[field].value.indexOf(obj.graphURI) == 0});
                        showValue = endpoint ? (endpoint.name + ':' + object[field].value.substring(endpoint.graphURI.length)):object[field].value;
                      } else {
                        showValue = prefix.prefix + ':' + object[field].value.substring(prefix.URI.length);
                      }
                      //var showValue = prefix ? (prefix.prefix+':'+object.value.substring(prefix.URI.length)):object.value;
                      var html = '<a href="' + object[field].value + '">' + showValue + '</a>';
                    }else{
                      var html = '<p> '+ object[field].value + '</p>';
                    } 
                    return new Spacebars.SafeString(html);
                    };
              dataField.push(item);
            });      

          return {
              rowsPerPage: 5,
              showFilter: true,
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
            console.log(obj.endpoint);
            console.log(obj);
            var graph = {};
            graph.name = obj.name
            graph.colorid = obj.colorid;
            graph.endpoint = obj.endpoint;
            graph.graphURI = obj.graphURI;
            graph.description = obj.description;
            var entities = Properties.find( {endpoint: obj.endpoint, 
                                           graphURI: obj.graphURI} 
                                          ).fetch();


            entities = jQuery.grep(entities, function (n) { return n!== undefined; });
            console.log('Properties');
            console.log(entities);

             
            var properties = [];
         


            properties = entities;

            entities = _.pluck(entities, 'subjects');
          //   console.log ("Pluck");
          //   console.log (entities);
            //console.log('==encontrados: ' + entities.length);
            var values = [];
            for(var i=0; i<entities.length; i++) {
              values = _.union(values, entities[i]);
               //console.log (entities[i][0]);
            }

            graph.endpointEntities = _.uniq(values, false, function(obj){return obj.fullName;});
            graph.endpointProperties = properties;
         /*      if (graph.endpointProperties [0]  === undefined) 
            {
               console.log ('Vacio');

            }else {
               console.log ('No Vacio');
               console.log (graph.endpointProperties[0]);
               console.log (graph.endpointProperties[1]);
            }
*/
            var hash = {};

            for(var  j=0; j<graph.endpointProperties.length; j++) {
                
               var entidadesrel  =  _.pluck(graph.endpointProperties[j].subjects , "name"); 
               var entidadestext = "";
               
               for (var h = 0 ; h < entidadesrel.length ; h++) {
                  entidadestext = entidadesrel[h] ;
                  if (hash.hasOwnProperty(entidadestext)){
                    hash[entidadestext] = hash[entidadestext]+" "+graph.endpointProperties[j].name;
                  } else{
                    hash[entidadestext] = graph.endpointProperties[j].name;

                  }
              }
             //   console.log ("Rel");
             //   console.log (entidadesrel); 
             //  graph.endpointProperties[j].enti = entidadestext ;
              var name = graph.endpointProperties[j].name;
               if (name.length > 10 ) {
               graph.endpointProperties[j].dim = "col-xs-10 col-sm-8 col-md-6";
               }else { 
                graph.endpointProperties[j].dim = "col-xs-6 col-sm-4 col-md-3";
               }
               if (j % 3  == 0 && j>0 && name.length > 10 ){
                  var aux = graph.endpointProperties[j-1];
                  graph.endpointProperties[j-1] = graph.endpointProperties[j] ;
                  graph.endpointProperties[j] = aux;
               }
               console.log ("Prop");
              console.log (graph.endpointProperties[j]);
              
              }
              console.log ("HASH ");
              console.log (hash);


              for( j=0; j<graph.endpointEntities.length; j++) {
                     
              // Ajusta el tamanio div segun el texto
              var name = graph.endpointEntities[j].name;
              graph.endpointEntities[j].ent =  hash[name] ; 
               if (name.length > 10 ) {
               graph.endpointEntities[j].dim = "col-xs-10 col-sm-8 col-md-6";
               }else { 
                graph.endpointEntities[j].dim = "col-xs-6 col-sm-4 col-md-3";
               }
               // Para evitar que se coloque en el ultimo lugar de la fila cuando ocupa dos cuadros
                if (j % 3  == 0 && name.length > 10 ){
                  var aux = graph.endpointEntities[j-1];
                  graph.endpointEntities[j-1] = graph.endpointEntities[j] ;
                  graph.endpointEntities[j] = aux;
               }
             //  console.log ("Ent");
             // console.log (graph.endpointEntities[j]);
              
              } 

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
//*
Template.search.helpers({
   endpointsAvailable: function(){
        return Endpoints.find({status: 'A'}).fetch();
      }
  });

//*
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
