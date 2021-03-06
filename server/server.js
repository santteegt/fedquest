if (Meteor.isServer) {


	Meteor.startup(function () {

		Properties._ensureIndex({'endpoint': 1, 'graphURI': 1});
		// code to run on server at startup
		//Meteor.call('getEndpointStructure', 'http://190.15.141.102:8890/sparql', 'http://dspace.ucuenca.edu.ec/resource/');
		//Meteor.call('pingServer', 'http://190.15.141.102:8890/sparql');

		var SparqlParser = Meteor.npmRequire('sparqljs').Parser;
		var parserInstance = new SparqlParser();
		
		Meteor.methods({

			validateSPARQL: function(sparqlQuery) {
				var response = {};
				try{
					parserInstance.parse(sparqlQuery);
					response.statusCode = 200;
					response.msg = "OK";
				}catch(e) {
					response.statusCode = 400;
					response.msg = 'Error parsing SPARQL Query';
					response.stack = e.toString();
				}
				return response;
			},

			doQuery: function(jsonRequest) {
				console.log ('ConsultaQ');
				console.log (jsonRequest);
				var timeout = jsonRequest.timeout ? jsonRequest.timeout: 30000
				var response = {}
				response.statusCode = 200;
				response.msg = undefined;
				response.stack = undefined;
				var endpointBase = Endpoints.findOne({base: true});
				if(!endpointBase) {
					response.statusCode = 400;
					response.msg = "Base Endpoint is not registered!";
				} else {
					try{
						if(jsonRequest.validateQuery) {
							parserInstance.parse(jsonRequest.sparql);
						} else {
							console.log('==Avoiding SPARQL validation on client');
						}
						response.resultSet = Meteor.call('runQuery', endpointBase.endpoint, endpointBase.graphURI, jsonRequest.sparql, undefined, timeout);
					}catch(e){
						console.log(e);
						response.statusCode = 400;
						response.msg = "Error executing SPARQL Query: See console for details";
						response.stack = e.toString();
					}
				}
				return response;

			}, doQueryDesc: function(jsonRequest , endpoint ) {
				console.log ('ConsultaQ');
				console.log (jsonRequest);
				var timeout = jsonRequest.timeout ? jsonRequest.timeout: 30000
				var response = {}
				response.statusCode = 200;
				response.msg = undefined;
				response.stack = undefined;
				
				var endpointBase = endpoint;
				 //Endpoints.findOne({base: true});

				if(!endpointBase) {
					response.statusCode = 400;
					response.msg = "Base Endpoint is not registered!";
				} else {
					try{
						if(jsonRequest.validateQuery) {
							parserInstance.parse(jsonRequest.sparql);
						} else {
							console.log('==Avoiding SPARQL validation on client');
						}
						response.resultSet = Meteor.call('runQueryDescr', endpointBase.endpoint, endpointBase.graphURI , jsonRequest.sparql, 'application/ld+json', timeout);
					}catch(e){
						console.log(e);
						response.statusCode = 400;
						response.msg = "Error executing SPARQL Query: See console for details";
						response.stack = e.toString();
					}
				}
				return response;

			},

			saveQuery: function(request) {
				result = {};
				result.statusCode = 200;
				result.msg = 'OK';
				try{


					var queryMod = Queries.findOne({_id: request._id_});
					if (queryMod){

						if (request.del){
							Queries.remove({_id: request._id_});
						}else{
							Queries.update({_id: request._id_},{$set:{user: '', title: request.title, description: request.description, 
							jsonGraph: JSON.stringify(request.jsonQuery), sparql: request.sparql, image: request.imageData , commend : request.commend }});
							result.queryId=request._id_;
						}

						


					}else{

						var id = Queries.insert({user: '', title: request.title, description: request.description, 
						jsonGraph: JSON.stringify(request.jsonQuery), sparql: request.sparql, image: request.imageData , commend : request.commend });
						result.queryId = id;
					}
				}catch(e){
					console.log(e);
					result.statusCode = 500;
					result.msg = e
				}
				return result;
			},
               
			updatePrefixes: function() {
				HTTP.get( 'http://prefix.cc/context', function(error, result){
					if(result.statusCode == '200' && !error) {
						result = EJSON.parse(result.content);
						result = result['@context'];
						var ci = 0;
						var ce = 0;
						if(!_.isUndefined(result)) {
							for(var prfx in result) {
								var prfCursor = Prefixes.find({prefix: prfx});
								if(prfCursor.count() <= 0) {
									Prefixes.insert({ prefix: prfx, URI: result[prfx] });
									ci++;
								} else {
									ce++;
								}
							}
						}
						console.log('Updating prefixes schema using prefix.cc service: Already Saved: ' + ce + ' New Records: ' + ci);
					} else {
						console.log('Error while getting Prefixes from service prefix.cc. Possible cause: ' + error);
					}
				});
				
			},	

			runQuery: function(endpointURI, defaultGraph, query, format, timeout) {
				format = _.isUndefined(format) ? 'application/sparql-results+json':format;
				timeout = _.isUndefined(timeout) ? '0': timeout;
				return HTTP.get( endpointURI, 
						{
							'params':
								{
									'default-graph-uri': defaultGraph,
									'query': query,
									'format': format,
									'timeout': timeout
								}
						});

			},


			runQueryDescr: function(endpointURI, defaultGraph, query, format, timeout) {
				format = _.isUndefined(format) ? 'application/rdf+json':format;
				timeout = _.isUndefined(timeout) ? '0': timeout;
				console.log ('Consulta'+ endpointURI +'+'+query+'+'+format);
				return HTTP.get( endpointURI, 
						{
							'params':
								{
									'default-graph-uri': defaultGraph,
									'query': query,
									'format': format,
									'timeout': timeout
								}
						});

			},

			pingServer: function(endpointURI, defaultGraph) {
				var response = {};
				try {
					var result = Meteor.call('runQuery', endpointURI, '', 'ask {graph <' + defaultGraph + '> {?s ?p ?o}}', undefined, 10000);
					var content = EJSON.parse(result.content);
					
					response.statusCode = result.statusCode;
					if(result.statusCode != 200) {
						response.msg = "Error trying to communicate with endpoint " + endpointURI;
					} else if(result.statusCode == 200  && content.boolean == true) {
						response.msg = '';
					} else if(result.statusCode == 200  && content.boolean == false) {
						response.statusCode = 404;
						response.msg = "Graph <"+ defaultGraph + "> does not exists on endpoint " + endpointURI;
					}
				}catch(e){
					response.statusCode = 500;
					response.msg = "Error trying to communicate with endpoint " + endpointURI;
					response.stack = e.stack;
				}
				
				return response;
			},  
			 findendpointactual: function ( resource ) {
                
                var response = {};
                    response.endpoint = {};
                    response.content = false;
                    console.log ('!!!!!!!!!!!!!!EntraEndpoint');
                var endpointsArray = Endpoints.find().fetch();
                     console.log (endpointsArray);
                for  (var i = 0; i< endpointsArray.length ; i++) {
                 console.log ('EndpointServer');
                 console.log ( endpointsArray[i]);
                  var graph =  endpointsArray[i].graphURI;
                  var endpoint = endpointsArray[i].endpoint;
                 
            
                	try {
					var result = Meteor.call('runQuery', endpoint , '', 'ASK { graph   <'+graph+'> { <'+resource+'> ?a ?b } }', undefined, 10000);
					var content = EJSON.parse(result.content);

					response.statusCode = result.statusCode;
					if(result.statusCode != 200) {
						response.msg = "Error trying to communicate with endpoint " + endpoint;
					} else if(result.statusCode == 200  && content.boolean == true) {
						response.msg = '';
						response.endpoint =  endpointsArray[i] ;
						response.content = true;
						return response ;
						  i = endpointsArray.length;
                         

					} else if(result.statusCode == 200  && content.boolean == false) {
						response.statusCode = 404;
						response.msg = "Graph <"+ defaultGraph + "> does not exists on endpoint " + endpoint;
					}
				}catch(e){
					response.statusCode = 500;
					response.msg = "Error trying to communicate with endpoint " + endpoint;
					//response.stack = e.stack;
				}
                 


                }
                    return response ;
				
			 },

			findPrefix: function(URIMap) {
				var idx = URIMap.lastIndexOf('#') > 0 ? URIMap.lastIndexOf('#'): URIMap.lastIndexOf('/');
				var uri = URIMap.substring(0, idx+1);
				var response = {};
				var Prefix = Prefixes.findOne({URI: uri});
				response.prefix = _.isUndefined(Prefix) ? '': Prefix.prefix;
				response.property = URIMap.substring(idx+1);
				return response;
			},

			fetchGraphSchema: function(endpointURI, defaultGraph) {
				var muestra;
				console.log('Entra1 ');
				console.log('==Obtaining graph description of <' + defaultGraph + '> from ' + endpointURI + '==');
						
				var result = Meteor.call('runQuery', endpointURI, defaultGraph, 
					'select distinct ?o where{ ?s a ?o . '
					+'BIND(STR(?s) AS ?strVal) '
  					+'FILTER(STRLEN(?strVal) >= '+ defaultGraph.length + ' && SUBSTR(?strVal, 1, ' + defaultGraph.length + ' ) = "' 
  					+ defaultGraph +'")}'
					);
				
				var rsEntities = EJSON.parse(result.content);

				var dataset = [];
				var datasetRDF = {};
				_.each(rsEntities.results.bindings, function(el, idx, list) {
					var subject = el.o.value;

					console.log('=>Obtaining subject properties of: ' + subject);
					var rsMuestra = Meteor.call('runQuery', endpointURI, defaultGraph, 
						'select distinct ?s where{ ?s a <' + subject + '>} limit 10');

					var rsMuestra = EJSON.parse(rsMuestra.content);
					var predicateArray = {};
					_.each(rsMuestra.results.bindings, function(el, idx, list) {
						var entity = el.s.value;
						
						console.log('==>Graph Entity sample: ' + entity);
						var rsPredicate = Meteor.call('runQueryDescr', endpointURI, defaultGraph, 'describe <' + entity + '>');
						//Cambios
						rsPredicate = EJSON.parse(rsPredicate.content);
						_.each(rsPredicate, function(el, idx, list) {

								var Suj = new Object();
								Suj = el  ;
						var s = idx ;
						console.log('Este Sujeto:'+ idx);

							//if(el.s.value == entity) { //just process entity own properties
						//	console.log ('Ob '+list[idx]+el+el.value);
						//		var result = '';
						//		var result2 = '';
						//	for (var i in list) {
   						//	 if (list.hasOwnProperty(i)) {
      					//		  result = 'lista' + "." + i + " = " + list[i] + "\n";
      					//		  console.log ('Lista'+result);
      					//		  var Obj = new Object();
      					//		  	Obj = list[i];
      					//		  for (var l in Obj) {
      					//		  	result2 = l;
      					//		  	console.log ('I'+result2+'val'+Obj[l]+'-'+Obj[l].value+'/'+Obj[l].type);
      					//		  	var Obj2 = new Object();
      					//		  	Obj2 = Obj[l];
      					//		  	 for (var m in Obj2) {
      					//		  	 	console.log ('Obj2'+'-'+m+'*'+Obj2[m].value+'/'+Obj2[m].type);


      					//		  	 }

      					//		  }
      							 // console.log ('I'+result2+'val'+Obj[l]+'-'+Obj[l].value+'/'+Obj[l].type);

    					//	}}
    				

							if(idx == entity) { 
								var Obj2 = new Object
								console.log ("Ini"+entity);

								  _.each (Suj,function(el, idx, list) {
                                 // 	console.log ('Valor'+idx + 'val'+list[idx]+el.value+el[0].value+'*'+el[0].type);


								  	var p = idx ;
								  	var o = el[0];
                                  console.log ('Sujeto'+s+'Predicado'+p+'Objeto'+o.value +'!'+o.type);

                                //  _.each (Suj,function(el, idx, list) {

                                  //	console.log ('Valor'+idx + 'val'+list[idx]+el.value+el[0].value+'*'+el[0].type);
                                //  });

							//just process entity own properties
								//console.log('Predicate:' + el);
							//	var sujetos = list ;
						//		_.each(sujetos, function(el, idx, list) { 
						//			console.log ('valor'+idx+el+el.valor+list[0]);
						//		});

								////////////////////
								var predicateObj = {};
							//	predicateObj.fullName = el.p.value;
						     	predicateObj.fullName = p;
								predicateObj.prefix = '';
								predicateObj.name = '';
								
								/////////////////////

								if(p == "http://rdaregistry.info/Elements/a/P50161") {
									console.log('*******sujeto: ' + entity + '******');
								}

								if(_.isUndefined(predicateArray[p])) {
									var objectObj = {};
									objectObj.objectEntity = {};
									objectObj.dataType = o.datatype;
									objectObj.sampleValue = isNaN(o.value) ? o.value.substring(0,100):o.value;
								
									if(o.type === 'uri' && subject != o.value) {
										
										console.log('==>Looking entity type for object <' + o.value +'>');
										var rsObjSubject = Meteor.call('runQuery', endpointURI, defaultGraph, 
											'select ?o where { <' + o.value +'> a ?o }');
										
										rsObjSubject = EJSON.parse(rsObjSubject.content);

										objectObj.objectEntity.fullName = null;
										objectObj.objectEntity.prefix = null;
										objectObj.objectEntity.name = null;
										//if found results
										if(rsObjSubject.results.bindings.length > 0) {
											var objectURI = rsObjSubject.results.bindings[0].o.value;
											var responsePrefix = Meteor.call('findPrefix', objectURI);
											objectObj.objectEntity.fullName = objectURI;
											objectObj.objectEntity.prefix = responsePrefix.prefix;
											objectObj.objectEntity.name = responsePrefix.property;
										}			
									}
									predicateArray[p] = objectObj;
								}
								
								
								muestra = predicateArray;
								//muestra = {subjectObj: subject, predicate: predicateObj, objectP: objectObj};
								//console.log('===>Subject: ' + subject + '| Predicate:' + el.p.value + '| Object:' + object + '| Type:' + type + '| Datatype:' + datatype);
								/*
								console.log('===>Subject: ' + subject + '| Predicate:' + predicateObj.fullName 
									+ '| Object:' + (objectObj.objectEntity||objectObj.dataType) + '| SampleValue:' + objectObj.sampleValue);
								*/
							
								});
							}

						});

					});
					
					
					var aux = {};
					var cont = 0;
					for(var predicate in predicateArray) {
						cont++;
						var responsePrefix = Meteor.call('findPrefix', predicate);
						/*var idx = predicate.lastIndexOf('#') > 0 ? predicate.lastIndexOf('#'): predicate.lastIndexOf('/');
						var uri = predicate.substring(0, idx+1);
						var property = predicate.substring(idx+1);
						var Prefix = Prefixes.findOne({URI: uri});
						Prefix.prefix = _.isUndefined(Prefix) ? '': Prefix.prefix;
						*/
						var objectObj = predicateArray[predicate];
						var subjectPrefix = Meteor.call('findPrefix', subject);
						var register = {
				                endpoint: endpointURI,
				                graphURI: defaultGraph,
				                subject: {fullName: subject, prefix: subjectPrefix.prefix, name: subjectPrefix.property },
				                predicate: { fullName: predicate, prefix: responsePrefix.prefix, name: responsePrefix.property},
				                objectType: objectObj
				            };
				        Graphs.insert(register);
				        dataset.push(register);
						/*Graphs.insert(
				            {
				                endpoint: endpointURI,
				                graphURI: defaultGraph,
				                subject: {fullName: subject, prefix: subjectPrefix.prefix, name: subjectPrefix.property },
				                predicate: { fullName: predicate, prefix: responsePrefix.prefix, name: responsePrefix.property},
				                objectType: objectObj
				            }
				        );*/



				        console.log('===>SAVED: Subject: ' + subject + ' prefix: ' + subjectPrefix.prefix + ' property: ' + subjectPrefix.property 
				        		+ '| Predicate:' + predicate + ' prefix: ' + responsePrefix.prefix + ' property: ' + responsePrefix.property
								+ '| Object:' 
									+ (_.isUndefined(objectObj.objectEntity.fullName) ? '': (objectObj.objectEntity.fullName + ' prefix: ' + objectObj.objectEntity.prefix + ' property: ' + objectObj.objectEntity.name)) 
									+ (objectObj.dataType ? objectObj.dataType:'')
								+ '| SampleValue:' + objectObj.sampleValue);

						
				        var subjectItem = {fullName: subject, prefix: subjectPrefix.prefix, name: subjectPrefix.property};
						if(_.isUndefined(datasetRDF[predicate])) {
							datasetRDF[predicate] = {};
							datasetRDF[predicate].endpoint = endpointURI;
							datasetRDF[predicate].graphURI = defaultGraph;
							datasetRDF[predicate].fullName = predicate;
							datasetRDF[predicate].prefix = responsePrefix.prefix;
							datasetRDF[predicate].name = responsePrefix.property;
							datasetRDF[predicate].subjects = [];
							datasetRDF[predicate].objectTypes = [];
						}
						datasetRDF[predicate].subjects.push(subjectItem);
						datasetRDF[predicate].objectTypes.push(objectObj);
						
					}
					//processing group by predicate registers model
					/*
					var arrays = {};
					c = _.groupBy(dataset, function(obj){return obj.predicate.fullName;});
					var counter = 0; 
			        for(property in c) {
			          d = c[property];
			          e = _.uniq(d, false, function(obj){return obj.subject.fullName + '-' + obj.objectType.objectEntity.fullName;});
			          f = _.pluck(e, 'subject');
			          g = _.pluck(e, 'objectType');
			          g = _.uniq(g, false, function(obj){return obj.dataType;});
			          propertyItem = {};
			          propertyItem.allowedEntities = f;
			          propertyItem.dataType = g;
			          arrays[property] = propertyItem;
			          Graphs2.insert({
			          	predicate: property, description: propertyItem
			          });
			          counter++;
			        }
			        console.log('==> prueba ' + counter + ' ' + arrays['http://id.loc.gov/vocabulary/relators/aut']);
			        */
				});

				var cont = 0;
				var str = '';
				for(var x in datasetRDF) {
					//console.log(datasetRDF[x]);
					Properties.insert(datasetRDF[x]);
					str = str + '||' + x;
					cont++;
				}
				console.log('==> contador == : ' + cont);
				console.log('==> predicados == : ' + str);
				return muestra;

			},

			fetchGraphSchema2: function(endpointURI, defaultGraph) {
                console.log ('ENtra 2')
				console.log('==Obtaining graph description of <' + defaultGraph + '> from ' + endpointURI + '==');
						
				var result = Meteor.call('runQuery', endpointURI, defaultGraph, 'select distinct ?o where{ ?s a ?o}');
				
				var rsEntities = EJSON.parse(result.content);

				var dataset = [];
				var datasetRDF = {};
				///Cambios JS
				_.each(rsEntities.results.bindings, function(el, idx, list) {
					var subject = el.o.value;
					console.log('=>Obtaining subject properties of: ' + subject);
					var rsMuestra = Meteor.call('runQuery', endpointURI, defaultGraph, 
						'select distinct ?s where{ ?s a <' + subject + '>} limit 5');

					var rsMuestra = EJSON.parse(rsMuestra.content);
					var predicateArray = {};
					_.each(rsMuestra.results.bindings, function(el, idx, list) {
						var entity = el.s.value;
						
						console.log('==>Graph Entity sample: ' + entity);
						var rsPredicate = Meteor.call('runQuery', endpointURI, defaultGraph, 'describe <' + entity + '>');
						
						rsPredicate = EJSON.parse(rsPredicate.content);
						_.each(rsPredicate.results.bindings, function(el, idx, list) {
							console.log('-****Predicate: ' + el.p.value);

							////////////////////
							var predicateObj = {};
							predicateObj.fullName = el.p.value;
							predicateObj.prefix = '';
							predicateObj.name = '';
							
							/////////////////////

							if(_.isUndefined(predicateArray[el.p.value])) {
								var objectObj = {};
								objectObj.objectEntity = {};
								objectObj.dataType = el.o.datatype;
								objectObj.sampleValue = isNaN(el.o.value) ? el.o.value.substring(0,100):el.o.value;
							
								if(el.o.type === 'uri' && subject != el.o.value) {
									
									console.log('==>Looking entity type for object <' + el.o.value +'>');
									var rsObjSubject = Meteor.call('runQuery', endpointURI, defaultGraph, 
										'select ?o where { <' + el.o.value +'> a ?o }');
									
									rsObjSubject = EJSON.parse(rsObjSubject.content);

									objectObj.objectEntity.fullName = null;
									objectObj.objectEntity.prefix = null;
									objectObj.objectEntity.name = null;
									//if found results
									if(rsObjSubject.results.bindings.length > 0) {
										var objectURI = rsObjSubject.results.bindings[0].o.value;
										var responsePrefix = Meteor.call('findPrefix', objectURI);
										objectObj.objectEntity.fullName = objectURI;
										objectObj.objectEntity.prefix = responsePrefix.prefix;
										objectObj.objectEntity.name = responsePrefix.property;
									}			
								}
								predicateArray[el.p.value] = objectObj;
							}
							//muestra = {subjectObj: subject, predicate: predicateObj, objectP: objectObj};
							//console.log('===>Subject: ' + subject + '| Predicate:' + el.p.value + '| Object:' + object + '| Type:' + type + '| Datatype:' + datatype);
							/*
							console.log('===>Subject: ' + subject + '| Predicate:' + predicateObj.fullName 
								+ '| Object:' + (objectObj.objectEntity||objectObj.dataType) + '| SampleValue:' + objectObj.sampleValue);
							*/

						});

					});
					
					
					var aux = {};
					var cont = 0;
					var currentRegId = null;
					for(var predicate in predicateArray) {
						cont++;
						var responsePrefix = Meteor.call('findPrefix', predicate);
						var objectObj = predicateArray[predicate];
						var subjectPrefix = Meteor.call('findPrefix', subject);

				        console.log('===>SAVED: Subject: ' + subject + ' prefix: ' + subjectPrefix.prefix + ' property: ' + subjectPrefix.property 
				        		+ '| Predicate:' + predicate + ' prefix: ' + responsePrefix.prefix + ' property: ' + responsePrefix.property
								+ '| Object:' 
									+ (_.isUndefined(objectObj.objectEntity.fullName) ? '': (objectObj.objectEntity.fullName + ' prefix: ' + objectObj.objectEntity.prefix + ' property: ' + objectObj.objectEntity.name)) 
									+ (objectObj.dataType ? objectObj.dataType:'')
								+ '| SampleValue:' + objectObj.sampleValue);

						
				        var subjectItem = {fullName: subject, prefix: subjectPrefix.prefix, name: subjectPrefix.property};
						if(_.isUndefined(datasetRDF[predicate])) {
							datasetRDF[predicate] = {};
							datasetRDF[predicate].endpoint = endpointURI;
							datasetRDF[predicate].graphURI = defaultGraph;
							datasetRDF[predicate].fullName = predicate;
							datasetRDF[predicate].prefix = responsePrefix.prefix;
							datasetRDF[predicate].name = responsePrefix.property;
							datasetRDF[predicate].subjects = [];
							datasetRDF[predicate].objectTypes = [];

							//first insertion
							currentRegId = Properties.insert(datasetRDF[predicate]);
						}
						datasetRDF[predicate].subjects.push(subjectItem);
						datasetRDF[predicate].objectTypes.push(objectObj);
						Properties.update({_id: currentRegId}, {$set: 
							{subjects: datasetRDF[predicate].subjects, 
								objectTypes: datasetRDF[predicate].objectTypes
							}
						});
						
					}
					//processing group by predicate registers model
					/*
					var arrays = {};
					c = _.groupBy(dataset, function(obj){return obj.predicate.fullName;});
					var counter = 0; 
			        for(property in c) {
			          d = c[property];
			          e = _.uniq(d, false, function(obj){return obj.subject.fullName + '-' + obj.objectType.objectEntity.fullName;});
			          f = _.pluck(e, 'subject');
			          g = _.pluck(e, 'objectType');
			          g = _.uniq(g, false, function(obj){return obj.dataType;});
			          propertyItem = {};
			          propertyItem.allowedEntities = f;
			          propertyItem.dataType = g;
			          arrays[property] = propertyItem;
			          Graphs2.insert({
			          	predicate: property, description: propertyItem
			          });
			          counter++;
			        }
			        console.log('==> prueba ' + counter + ' ' + arrays['http://id.loc.gov/vocabulary/relators/aut']);
			        */
				});
			},

			getEndpointStructure: function(graphName, endpointURI, defaultGraph, graphDescription, colorId, baseEndpoint, updateGraph, optional) {
				var endpoint = Endpoints.findOne({endpoint: endpointURI, graphURI: defaultGraph});
				var response = Meteor.call('pingServer', endpointURI, defaultGraph);
				if(response.statusCode != 200 || response.msg.length > 0) return response;
				var statusCode = response.msg.length == 0 ? 'A':'I';
				if(baseEndpoint) {
					Endpoints.update({base: true},{$set: {base: false}},{multi: true});
				}
				if(_.isUndefined(endpoint)) {
					console.log('==Inserting new endpoint');
					var color_id = colorId ? colorId:'#'+Math.floor(Math.random()*16777215).toString(16);
					Endpoints.insert({name: graphName, colorid: color_id, endpoint: endpointURI, graphURI: defaultGraph, description: graphDescription, base: baseEndpoint, status: statusCode, lastMsg: response.msg , opt:optional});	
					//updateGraph = true;
				} else {
					console.log('==Updating endpoint ' + endpointURI + '<' + defaultGraph + '>');
					Endpoints.update({_id: endpoint._id}, {$set: {name: graphName, colorid: colorId, endpoint: endpointURI, graphURI: defaultGraph, description: graphDescription, base: baseEndpoint, status: statusCode, lastMsg: response.msg, opt:optional }});
				}
				if(updateGraph) {
					Properties.remove({endpoint: endpointURI, graphURI: defaultGraph});
					Meteor.call('fetchGraphSchema', endpointURI, defaultGraph, function(error, result){
						if(error) {
							console.log("Error ==>" + error);
							response.statusCode = 500;
							response.stack = error;	
						}else {
							console.log("Graph Schema fetching process finished for endpoint: " + endpointURI + ' <' + defaultGraph + '>');
						}
					});
				} else {
					console.log("Skipping Graph Schema fetching process for endpoint: " + endpointURI + ' <' + defaultGraph + '>');
				}
				return response;

			},


			updateBaseEndpoint: function(endpointURI, defaultGraph) {
				var endpoint = Endpoints.findOne({endpoint: endpointURI, graphURI: defaultGraph});
				Endpoints.update({base: true},{$set: {base: false}},{multi: true});
				//Endpoints.update({_id: endpoint._id}, {$set: {base: true}});
				Endpoints.update({_id: endpoint._id}, {$set: {base: true,opt:false}});
				console.log("==NEW endpoint base: " + endpointURI + " - " + defaultGraph);
			},

			deleteEndpoint: function(id, endpointURI, defaultGraph) {
				Properties.remove({endpoint: endpointURI, graphURI: defaultGraph});
				Endpoints.remove(id);
				console.log("==Endpoint removed: " + endpointURI + " - " + defaultGraph);	
			} ,
			updateOptEndpoint: function(endpointURI, defaultGraph, optional) {
				var endpoint = Endpoints.findOne({endpoint: endpointURI, graphURI: defaultGraph});
			//	Endpoints.update({base: true},{$set: {base: false}},{multi: true});
				//Endpoints.update({_id: endpoint._id}, {$set: {base: true}});
				Endpoints.update({_id: endpoint._id}, {$set: {opt:optional}});
				console.log("==OPtional endpoint opt: " + endpointURI + " - " + defaultGraph+" Opt"+optional);
			} ,
			findoptional : function   (endpointURI, defaultGraph) {
            console.log (endpointURI + defaultGraph);
            var endpoint = Endpoints.findOne({endpoint: endpointURI, graphURI: defaultGraph});
				console.log ("Resp"+endpoint.opt );
				return endpoint.opt;

			} 
		});

		//Update Prefixes schema on every server startup
		Meteor.call('updatePrefixes');
	});
}
