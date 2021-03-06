/*
    View logic for the query samples list component
    */
    this.SearchView = Backbone.View.extend({
      tagName: "div",
      id: "search",

  /////////////////////////
  // View Initialization //
  /////////////////////////
  initialize: function() {
    var me;
    me = this;
  },

  //////////////////////////
  //Render Samples Views//
  //////////////////////////
  render: function() {
    Blaze.render(Template.search, $('#sparql-content')[0]);
    this.setEvents($('#sparql-content'));
    return this;
  },
  setEvents: function(divNode) {
    $('button.runSearch').on('click', function(ev) {
      Session.set("auxAct",Session.get("auxAct")+1);
      App.resultCollection2.remove({});
      Session.set('Qmode', 1);
      var EntitySearch = get_radio_value("resourceType");

      var FromList = get_checkList_values("repositoriesList");

      var TextSearch = $("#textToSearch").val();
      

      //alert(EntitySearch);
      //alert(TextSearch);
      //alert(FromList);

	var ResultLimit = ''; //limit 100
	var ResultLimitSubQ = '';

      var DocSearchRequest = {};


      DocSearchRequest.resourceClass ='http://purl.org/ontology/bibo/Document';
      DocSearchRequest.indexProperties =['http://purl.org/ontology/bibo/abstract', 'http://purl.org/dc/terms/title', 'http://purl.org/dc/terms/subject'];
      DocSearchRequest.indexPropertiesName =['Abstract', 'Title', 'Subject'];
      DocSearchRequest.labelProperty ='http://purl.org/dc/terms/title';

      var AuthSearchRequest = {};

      AuthSearchRequest.resourceClass ='http://xmlns.com/foaf/0.1/Person';
      AuthSearchRequest.indexProperties =['http://xmlns.com/foaf/0.1/name'];
      AuthSearchRequest.indexPropertiesName =['Name'];
      AuthSearchRequest.labelProperty ='http://xmlns.com/foaf/0.1/name';

      var ColSearchRequest = {};

      ColSearchRequest.resourceClass ='http://purl.org/ontology/bibo/Collection';
      ColSearchRequest.indexProperties =['http://purl.org/dc/terms/description'];
      ColSearchRequest.indexPropertiesName =['Description'];
      ColSearchRequest.labelProperty ='http://purl.org/dc/terms/description';

Session.set('Qmode2',0);

      var ResqLis =[];
      switch(EntitySearch){
        case 't':{
          ResqLis.push(DocSearchRequest);
          ResqLis.push(AuthSearchRequest);
          ResqLis.push(ColSearchRequest);
        }break;
        case 'd':{
          ResqLis.push(DocSearchRequest);
        }break;
        case 'a':{
          ResqLis.push(AuthSearchRequest);
          Session.set('Qmode2',1);
        }break;
        case 'c':{
          ResqLis.push(ColSearchRequest);
          Session.set('Qmode2',1);
        }break;
      }


      var Query="prefix text:<http://jena.apache.org/text#>\n";

      Query+='select ?Endpoint ?EntityURI ?EntityClass ?EntityLabel ?Property ?PropertyLabel ?PropertyValue ?Score{\n';


      var SubQN=0;
      for (var oneQuery=0; oneQuery<FromList.length; oneQuery++){
        var EndpointLocal=FromList[oneQuery].attributes['data-base'] ? FromList[oneQuery].attributes['data-base'].value : false;
        var Service=FromList[oneQuery].attributes['data-endpoint'].value;
        var ServiceName=FromList[oneQuery].attributes['data-name'].value;
        for (var oneRes=0; oneRes<ResqLis.length; oneRes++){
          for (var oneProp=0; oneProp<ResqLis[oneRes].indexProperties.length; oneProp++){
            SubQN++;
            if(SubQN==1){
              Query+='{\n';
            }else{
              Query+='union {\n';
            }
            
            if (!EndpointLocal){
              Query+='service <'+Service+'> {\n';
            }
            var Class_=ResqLis[oneRes].resourceClass;
            var Property_=ResqLis[oneRes].indexProperties[oneProp];
            var PropertyName_=ResqLis[oneRes].indexPropertiesName[oneProp];
            var Label_=ResqLis[oneRes].labelProperty;

            Query+='select distinct ?Score (\''+ServiceName+'\' AS ?Endpoint) ?EntityURI (IRI(<'+Class_+'>) AS ?EntityClass) ?EntityLabel (IRI(<'+Property_+'>) AS ?Property) (\''+PropertyName_+'\' AS ?PropertyLabel) ?PropertyValue\n';
            Query+='{\n';
            Query+='(?EntityURI ?Score ?PropertyValue) text:query (<'+Property_+'> \'('+TextSearch+')\' '+ResultLimitSubQ+') .\n?EntityURI <'+Label_+'> ?EntityLabel .\n';
            Query+='filter(str(?PropertyValue)!=\'\') .\n';




            Query+='}\n';
            if (!EndpointLocal){
              Query+='}\n';
            }
            Query+='}\n';
          }
        }
      }


      Query+='} order by DESC(?Score)\n  '+ResultLimit;

    //alert(Query);
    waitingDialog.show();

    var jsonRequest = {"sparql": Query, "validateQuery": false};
    Meteor.call('doQuery', jsonRequest, function(error, result) {
      if(result.statusCode != 200) {
        console.log(result.stack);
        $('#modalLog .console-log').html(result.stack ? (result.stack.replace(/[<]/g,'&#60;').replace(/[\n\r]/g, '<br/>')):'');
            //$('#sparqlEditor button#consoleError').show();
            var message = result.msg + (result.stack ? (': ' + result.stack.substring(0, 30) + '...'):'');
            $('.top-right').notify({
              message: { text: message },
              type: 'danger'
            }).show();
          } else {
            if(result.resultSet) {

		              
              App.resultCollection2.insert(result.resultSet);
            }
          }
          waitingDialog.hide();
          
        });


  });
}
});

function get_checkList_values(CheckName) {
  var inputs = document.getElementsByName(CheckName);
  var values=[];
  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].checked) {
      values.push(inputs[i]);
    }
  }
  return values;
};

function get_radio_value(RadioName) {
  var inputs = document.getElementsByName(RadioName);
  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].checked) {
      return inputs[i].value;
    }
  }
};



highfn = function () {
                //$('.contvarpro').empty();
                var TextSearch = $("#textToSearch").val(); 
                var res = TextSearch.split(" ");
                for (var i=0; i<res.length; i++){
                  if(!(res[i].trim().length===0)) {
                    $('.hglttxt').highlight(res[i].trim(), { caseSensitive: false });
                  }
                }
              };

              unhighfn = function () {
                $('.hglttxt').unhighlight();
              };





              function contieneType(elemento) {
                return elemento.indexOf("type") > -1;
              };


              linkg = function (e) {
                var obj =e.target;
                if (obj.tagName =="IMG"){
                  obj=obj.parentElement;

                }
                var en =   Endpoints.find({name: obj.attributes['data-endpoint'].value}).fetch()[0]
                var v1 = encodeURIComponent(obj.attributes['data-uri'].value);
                var v2 = encodeURIComponent(en.endpoint); 
                var v3 = encodeURIComponent(en.graphURI); 
                window.open('/graph/'+v1+'/'+v2+'/'+v3);
              };


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




              linkg2 = function (e) {
                var obj =e.target;
                if (obj.tagName =="SPAN"){
                  obj=obj.parentElement;

                }
                var en =   Endpoints.find({name: obj.attributes['data-endpoint'].value}).fetch()[0];
                var v1 = obj.attributes['data-uri'].value;
                var v2 = en.endpoint; 
                var v3 = en.graphURI; 

		//var r= Query(v2,v3,'select ?a {<'+v1+'> <http://purl.org/ontology/bibo/handle> ?a} limit 1');


var redirectWindow = window.open('', '_blank');


  Meteor.call('runQuery', v2, v3, 'select ?a {<'+v1+'> <http://purl.org/ontology/bibo/handle> ?a} limit 1', function(error, result) {
    if(result) {
      var r = JSON.parse(result.content).results.bindings;
	if (r.length == 0) {
		//window.open(v1);
		redirectWindow.location=v1;
	} else {
		//window.open(r[0].a.value);
		redirectWindow.location=r[0].a.value;
	}
    }else{
	//window.open(v1);
		redirectWindow.location=v1;
    }
}		
);




              };

		ValidateSuggestionQuery = function (query) {

		    var errMsj='';

			try {  
				var sq = query;
                errMsj="'filter regex' missing, suggestion queries need a filter statement";                	
                var resp = sq.match(new RegExp("REGEX\\((.*),","g"))[0];
                errMsj="filtering variable missing into regex";                	
                var SearchVar = resp.split('(')[1].split(',')[0];
                errMsj="Main variable not found";                	
                resp = sq.match(new RegExp("(.*) a","g"))[0];
                var MainVar = resp.split(' ')[0];
                errMsj="Type variable not found";                	
                resp = sq.match(new RegExp(" (.*) \.","g")).filter(contieneType)[0];
                resp = resp.split(' ');
                var TypeVar = resp[resp.length-2];
                var NewSQ = sq.replace(new RegExp("SELECT","g"), 'SELECT '+SearchVar+'');
                NewSQ = NewSQ.replace(new RegExp("FROM(.*)","g"),'');
                var TextSearch = 'x';
                
                var v2 = NewSQ;
                NewSQ = NewSQ.replace(new RegExp("'wildcard'","g"),TextSearch);
                errMsj="'wildcard' missing";                	
                if (v2 == NewSQ){
               		throw "Too big";
                }

				var Query ='select * {\n';
                var SubQN=0;
                var TitleVar = sq.match(new RegExp("SELECT (.*)","g"))[0].replace(new RegExp("SELECT ","g"),'').split(' ');
                var i = TitleVar.indexOf(MainVar);
                TitleVar.splice(i, 1);
                i = TitleVar.indexOf(TypeVar);
                TitleVar.splice(i, 1);
                TitleVar.filter(function (v) { return v.trim() != ''; });
                errMsj="Title variable not found";
                var tem = TitleVar[0].length;

				errMsj='';
			}
			catch(e) {
				//return false;
			}
			return errMsj;
		};





              actAHyper = function (e) {
                Session.set("auxAct",Session.get("auxAct")+1);
                App.resultCollection2.remove({});
                Session.set('Qmode', 2);
                var r = e.currentTarget.attributes['data-title'];
                var w = Queries.find({title: r.value}).fetch();
                var sq = w[0].sparql;
                var resp = sq.match(new RegExp("REGEX\\((.*),","g"))[0];
                  var SearchVar = resp.split('(')[1].split(',')[0];
                    resp = sq.match(new RegExp("(.*) a","g"))[0];
                    var MainVar = resp.split(' ')[0];
                    resp = sq.match(new RegExp(" (.*) \.","g")).filter(contieneType)[0];
                    resp = resp.split(' ');
                    var TypeVar = resp[resp.length-2];
                    var NewSQ = sq.replace(new RegExp("SELECT","g"), 'SELECT '+SearchVar+'');
                    NewSQ = NewSQ.replace(new RegExp("FROM(.*)","g"),'');
                    var TextSearch = $("#textToSearch").val();
                    NewSQ = NewSQ.replace(new RegExp("'wildcard'","g"),TextSearch);
                    var FromList = get_checkList_values("repositoriesList");
                    var Query ='select * {\n';
                    var SubQN=0;


                    var TitleVar = sq.match(new RegExp("SELECT (.*)","g"))[0].replace(new RegExp("SELECT ","g"),'').split(' ');

                    var i = TitleVar.indexOf(MainVar);
                    TitleVar.splice(i, 1);
                    i = TitleVar.indexOf(TypeVar);
                    TitleVar.splice(i, 1);

                    TitleVar.filter(function (v) { return v.trim() != ''; });


                    Session.set('SearchVar', SearchVar);
                    Session.set('MainVar', MainVar);
                    Session.set('TypeVar', TypeVar);
                    Session.set('TitleVar', TitleVar[0]);
                    

                    for (var oneQuery=0; oneQuery<FromList.length; oneQuery++){
                      var EndpointLocal=FromList[oneQuery].attributes['data-base'] ? FromList[oneQuery].attributes['data-base'].value : false;
                      var Service=FromList[oneQuery].attributes['data-endpoint'].value;
                      var ServiceName=FromList[oneQuery].attributes['data-name'].value;
                      SubQN++;
                      if(SubQN==1){
                        Query+='{\n';
                      }else{
                        Query+='union {\n';
                      }
                      if (!EndpointLocal){
                        Query+='service <'+Service+'> {\n';
                      }
                      var NewSQ2 = NewSQ.replace(new RegExp("SELECT","g"), "SELECT ('"+ServiceName+"' AS ?Endpoint)");
                      Query+=NewSQ2+"\n";
                      if (!EndpointLocal){
                        Query+='}\n';
                      }
                      Query+='}\n';
                    }
                    Query+='}\n';



            //alert(Query);


            waitingDialog.show();

            var jsonRequest = {"sparql": Query, "validateQuery": false};
            Meteor.call('doQuery', jsonRequest, function(error, result) {
              if(result.statusCode != 200) {
                console.log(result.stack);
                $('#modalLog .console-log').html(result.stack ? (result.stack.replace(/[<]/g,'&#60;').replace(/[\n\r]/g, '<br/>')):'');
            //$('#sparqlEditor button#consoleError').show();
            var message = result.msg + (result.stack ? (': ' + result.stack.substring(0, 30) + '...'):'');
            $('.top-right').notify({
              message: { text: message },
              type: 'danger'
            }).show();
          } else {
            if(result.resultSet) {
              App.resultCollection2.insert(result.resultSet);
            }
          }
          waitingDialog.hide();
          
        });


          };

