
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
  this.App.resultCollection2 = new Meteor.Collection(null);


  this.App.FindRepository=(function (uri) {

    var answer={};
    var q = 'ask { <'+uri+'> ?a ?b }';
    var ep = Endpoints.find({status: 'A'}).fetch();
    for (var m=0; m<ep.length; m++){
      var r = Query(ep[m].endpoint, ep[m].graphURI,q);
      if(r){
       var exists=JSON.parse(r.content).boolean;
       if(exists){
        answer = ep[m];
        break;
      }else{
      }
    }
  }
  return answer; 
});




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


Session.set('actPage', 1);
Session.set('auxAct', 1);

//Session.set('guri', '');
//Session.set('gendp', {});




Template.search.helpers({


 endpointsAvailable: function(){
  return Endpoints.find({status: 'A'}).fetch();
},

resultFullQuery: function(){
  var pag=Session.get("actPage")-1;
  var MaxItemPag=10;
  var response = App.resultCollection2.findOne();
  var rlist = dataSourceSearch(response);    
  var page = rlist.slice(pag*MaxItemPag, (pag+1)*MaxItemPag); 
  return page;
},

NresultFullQuery: function(){
	var response = App.resultCollection2.findOne();
  var rlist = dataSourceSearch(response);    
  if (rlist && rlist.length>0){
  return rlist.length +' results';
}
else{
  return 'No results';
}
},

suggestedQueries: function(){

  var EntitySearch = get_radio_value("resourceType");
  var w=[];

  switch(EntitySearch){
    case 't':
    w = Queries.find().fetch();
    break;
    case 'a':
    w = loadQueryFirstNode('http://xmlns.com/foaf/0.1/Person');
    break;
    case 'd':
    w = loadQueryFirstNode('http://purl.org/ontology/bibo/Document');
    break;
    case 'c':
    w = loadQueryFirstNode('http://purl.org/ontology/bibo/Collection');
    break;
  }
  

    //loadQueryFirstNode

    var aux= Session.get("auxAct");
    var TextSearch = $("#textToSearch").val();
    for (var q=0; q<w.length; q++){
      if (TextSearch.trim() !=""){
        w[q].description = w[q].description.replace("?", TextSearch);
      }
    }
    w = w.filter(function (el) {  return ValidateSuggestionQuery(el.sparql)=='';  });


    return w;
  },


  paginationSettings: function(){
    var response = App.resultCollection2.findOne();
    var rlist = dataSourceSearch(response);       
    var pagcon = {};
    pagcon.total=Math.ceil(rlist.length/10);
    if(rlist.length>0){
      Session.set('actPage', 1);
    } 
    $('#page-selection').bootpag({
      total: pagcon.total,
      page:1,
      maxVisible:10
    }).on("page", function(event, num){
      //unhighfn(); 
      Session.set("auxAct", Session.get("auxAct")+1);
      Session.set('actPage', num);
      //highfn();
  });

    return pagcon;
  }


});


function get_radio_value(RadioName) {
  var inputs = document.getElementsByName(RadioName);
  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].checked) {
      return inputs[i].value;
    }
  }
};


function loadQueryFirstNode (element) {
  result = {};
  result.statusCode = 200;
  result.msg = 'OK';
  var querylist = [];
  try{

    var query = Queries.find().fetch();
    console.log ('Querys server0');
    for (var i = 0; i < query.length ;i++)
     {   console.log ('Querys server');
                             //  console.log (query[i].jsonGraph.cells.0.subject);
                             var js = JSON.parse(query[i]['jsonGraph']);
 			    var ClassV = js.cells[0].subject;

try{
			     var spq =query[i].sparql;
			     var resp = spq.match(new RegExp("REGEX\\((.*),","g"))[0];
                  	     var SearchVar = resp.split('(')[1].split(',')[0];			
			     var MainVar = spq.match(new RegExp("(.*)\?"+SearchVar+" \.","g"))[0].split(' ')[0].replace('?','').split('_')[0];
			     //ClassV = js;
			     ClassV= this.Properties.findOne({name:MainVar}).objectTypes[0].objectEntity.fullName;




}catch (q){

}
                              // var s  =  js.subject;
                              console.log (js) ;

				


                              if ( ClassV == element && element == 'http://xmlns.com/foaf/0.1/Person' || ClassV == element && element == 'http://purl.org/ontology/bibo/Collection' || element == 'http://purl.org/ontology/bibo/Document' && ClassV != 'http://xmlns.com/foaf/0.1/Person' && ClassV != 'http://purl.org/ontology/bibo/Collection')

                               {   console.log ('Querys server');
                              // console.log (query[i].jsonGraph.cells[0].subject);
                              querylist.push (query[i]);
                            } 
                          }
                          return querylist;
                        }catch(e){
                          console.log(e);
                          result.statusCode = 500;
                          result.msg = e
                        }
                        return querylist;
                      }



                      function dataSourceSearch(response){



  //alert(NumMode);
  var toShow = [];
  if (response){
   var NumMode = Session.get('Qmode');
   if(NumMode == 2){
    var SearchVar = Session.get('SearchVar').replace(/\?/g,'');
    var MainVar = Session.get('MainVar').replace(/\?/g,'');
    var TypeVar = Session.get('TypeVar').replace(/\?/g,'');
    var TitleVar= Session.get('TitleVar').replace(/\?/g,'');
    var SearchVar_ = Session.get('SearchVar').replace(/\?/g,'').split('_')[0];
  }
  

  var resp = response ? JSON.parse(response.content).results.bindings: [];

    var NumMode2 = Session.get('Qmode2');
	if(NumMode == 1 && resp.length > 0 && NumMode2 == 1){

     var MaxV = Math.max.apply(Math,resp.map(function(o){return o.Score.value;}));
     var MinV = Math.min.apply(Math,resp.map(function(o){return o.Score.value;}));
     var Tol = (MaxV-MinV) * 0.30;

	  resp = resp.filter(function (val) {return val.Score.value >= MaxV-Tol ;});

	}


  var MaxLength=160;

  //graphURI
  for (var k=0; k<resp.length; k++){

    var OneResult = {};
    if (NumMode==1){
      OneResult = toShow.filter(function (val) {return val.URI === resp[k].EntityURI.value;});
    }
    if (NumMode==2){
      OneResult = toShow.filter(function (val) {return val.URI === resp[k][MainVar].value;});
    }


    if(OneResult.length==0){
      //New
      var OneResult= {};
      OneResult.Weight = 1;
      if (NumMode==1){
        OneResult.Type = resp[k].EntityClass.value;
      } 
      if (NumMode==2){
        OneResult.Type = resp[k][TypeVar].value;
      }
      
      var Org = {};
      if (NumMode==1){
        Org = resp[k].Endpoint.value;  
      }
      if (NumMode==2){
        Org = resp[k]['Endpoint'].value;  
      }

      //EndpointsLs.filter(function (val) {return strStartsWith(resp[k].EntityURI.value,val.graphURI); });
      //var Org = App.FindRepository(resp[k].EntityURI.value);
      //if (!_.isEmpty(Org)){
        //Org=Org.name;
      //}else{
       // Org='';      
      //}

      OneResult.Origin = Org;
      
      if (NumMode==1){
        OneResult.Label = resp[k].EntityLabel.value;        
        OneResult.URI = resp[k].EntityURI.value;
        OneResult.MatchsProperty =[{p:resp[k].PropertyLabel.value, v:resp[k].PropertyValue.value, l: resp[k].PropertyValue.value.length>MaxLength, s: resp[k].PropertyValue.value.substr(0, MaxLength), c: resp[k].PropertyValue.value.substr(MaxLength)}];            
      }

      if (NumMode==2){
        OneResult.Label = resp[k][TitleVar].value;        
        OneResult.URI = resp[k][MainVar].value;
        OneResult.MatchsProperty =[{p:SearchVar_, v:resp[k][SearchVar].value, l: resp[k][SearchVar].value.length>MaxLength, s: resp[k][SearchVar].value.substr(0, MaxLength), c: resp[k][SearchVar].value.substr(MaxLength)}];            
      }


      switch(OneResult.Type){
        case 'http://xmlns.com/foaf/0.1/Person':OneResult.Icon='glyphicon glyphicon-user'; break;
        case 'http://purl.org/ontology/bibo/Collection':OneResult.Icon='glyphicon glyphicon-folder-open'; break;
        default : OneResult.Icon='glyphicon glyphicon-file'; break;
      }


      toShow.push(OneResult);
    }else{
      //Add
      OneResult=OneResult[0];
      OneResult.Weight += 1;
      if (NumMode==1){
        var ln = OneResult.MatchsProperty.filter(function(e) { return e.p == resp[k].PropertyLabel.value && e.v ==resp[k].PropertyValue.value;  } ).length;
        if (ln==0){ 
          OneResult.MatchsProperty.push({p:resp[k].PropertyLabel.value, v:resp[k].PropertyValue.value, l: resp[k].PropertyValue.value.length>MaxLength, s: resp[k].PropertyValue.value.substr(0, MaxLength), c: resp[k].PropertyValue.value.substr(MaxLength)});  
        }
      }
      if (NumMode==2){

        var ln = OneResult.MatchsProperty.filter(function(e) { return e.p == SearchVar_ && e.v ==resp[k][SearchVar].value;  } ).length;
        if (ln==0)
        {
          OneResult.MatchsProperty.push({p:SearchVar_, v:resp[k][SearchVar].value, l: resp[k][SearchVar].value.length>MaxLength, s: resp[k][SearchVar].value.substr(0, MaxLength), c: resp[k][SearchVar].value.substr(MaxLength)});  
        }
      }
      OneResult.MatchsProperty.sort(compare2);

    }
    
  } 
}
//toShow.sort(compare);

return toShow;
}



function compare(a,b) {
  if (a.Weight < b.Weight)
    return 1;
  if (a.Weight > b.Weight)
    return -1;
  return 0;
}
function compare2(a,b) {
  if (a.p < b.p)
    return -1;
  if (a.p > b.p)
    return 1;
  return 0;
}


function strStartsWith(str, prefix) {
  return str.indexOf(prefix) === 0;
}


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




//--------------------------------------
function Query (endpoint, graph, query){
  var aux=undefined;
  Meteor.call('runQuery', endpoint, graph, query, function(error, result) {
    if(result) {
      aux = result;
    }else{
      aux ='';  
    }

  });
  while(aux===undefined){ 
    sleep(); 
  };
  return aux;
}


function sleep() {
  try{
    var xmlHttp = new XMLHttpRequest();
      xmlHttp.open( "GET", 'www.facebook.com', false ); // false for synchronous request
      xmlHttp.send( null );
    }catch(e){


    }
  }



}






