import {
    Meteor
}
from
'meteor/meteor';
if (Meteor.isServer) {


    function merge_(obj1, obj2) {
        var result = {};
        for (var key in obj1)
            result[key] = obj1[key];
        for (var key in obj2)
            result[key] = obj2[key];
        return result;
    }
 

    String.prototype.hashCode = function () {
        var a = 0, b, c, d;
        if (0 === this.length)
            return a;
        for (b = 0, d = this.length; b < d; b++) {
            c = this.charCodeAt(b);
            a = (a << 5) - a + c;
            a |= 0;
        }
        return a;
    };

    Meteor.startup(function () {

        Properties._ensureIndex({'endpoint': 1, 'graphURI': 1});
        // code to run on server at startup
        //Meteor.call('getEndpointStructure', 'http://190.15.141.102:8890/sparql', 'http://dspace.ucuenca.edu.ec/resource/');
        //Meteor.call('pingServer', 'http://190.15.141.102:8890/sparql');

        var SparqlParser = Meteor.npmRequire('sparqljs').Parser;
        var parserInstance = new SparqlParser();

        Meteor.methods({
            updateStats: function () {
                Statsc.remove({});
                var endp = Endpoints.find().fetch();
                //Numero totales
                var sparql_p = "select (count(*) AS ?P) ('__' AS ?EP) {?x a <http://xmlns.com/foaf/0.1/Person>}";
                var sparql_d = "select (count(*) AS ?D) ('__' AS ?EP) {?x a <http://purl.org/ontology/bibo/Document>}";
                var sparql_c = "select (count(*) AS ?C) ('__' AS ?EP) {?x a <http://purl.org/ontology/bibo/Collection>}";
                //Consulta	
                var sparql_ = 'select * {\n';
                for (var i = 0; i < endp.length; i++) {
                    var endpoint = endp[i];
                    sparql_ += '{service <' + endpoint.endpoint + '> {' + '\n';
                    sparql_ += sparql_p.replace(new RegExp("__", "g"), endpoint.name) + '\n';
                    sparql_ += '}}union' + '\n';
                    sparql_ += '{service <' + endpoint.endpoint + '> {' + '\n';
                    sparql_ += sparql_d.replace(new RegExp("__", "g"), endpoint.name) + '\n';
                    sparql_ += '}}union' + '\n';
                    sparql_ += '{service <' + endpoint.endpoint + '> {' + '\n';
                    sparql_ += sparql_c.replace(new RegExp("__", "g"), endpoint.name) + '\n';
                    sparql_ += '}}' + '\n';
                    if (i != endp.length - 1) {
                        sparql_ += 'union' + '\n';
                    }
                }
                sparql_ += '}';
                //Preprocesamiento	
                var r = Meteor.call('doQueryCacheStats', {sparql: sparql_}).resultSet.value;
                var Obj = JSON.parse(r).results.bindings;
                var Stats1 = [];
                for (var i = 0; i < endp.length; i++) {
                    var ls = Obj.filter(function (a) {
                        return a.EP.value == endp[i].name;
                    });
                    var result1 = {};
                    var result = {};
                    result1 = merge_(ls[0], ls[1]);
                    result = merge_(result1, ls[2]);
                    Stats1.push(result);
                }
                Statsc.insert({cod: 1, val: Stats1});
                var Stats__ = Stats1;
                //console.log(Stats1);
                //Numero recursos totales

                //Palabras clave
                var topK = '20';
                sparql_ = "select * {service <==>{ select  ?D (count(*) AS ?cou) ('__' AS ?EP) where { { [] <http://purl.org/saws/ontology#refersTo> ?d . BIND (lcase(?d) AS ?D) }union{ [] <http://purl.org/dc/terms/subject> ?d . filter (isLiteral (?d)) . BIND (lcase(?d) AS ?D) }union{  [] <http://vivoweb.org/ontology/core#freetextKeyword> ?d . BIND (lcase(?d) AS ?D) } } group by ?D order by desc(?cou) limit " + topK + ' }} ';
                var lsKW = [];
                for (var i = 0; i < endp.length; i++) {
                    var endpoint = endp[i];
                    var r = Meteor.call('doQueryCacheStats', {sparql: sparql_.replace(new RegExp("__", "g"), endpoint.name).replace(new RegExp("==", "g"), endpoint.endpoint)}).resultSet.value;
                    var Obj1 = JSON.parse(r).results.bindings;


                    var stopWords = ['cuenca-ecuador', 'ecuador', 'cuenca', 'azuay', 'tesis', 'quito', 'quito-ecuador', 'guayaquil'];

                    Obj1_ = Obj1.filter(function (a) {
                        return stopWords.indexOf(a.D.value.trim()) == -1;
                    });

                    lsKW.push({EP: endpoint.name, Data: Obj1_});
                }
                Statsc.insert({cod: 2, val: lsKW});
                //Palabras clave
                //Por tipo de documento

                var sparql_td = "select ?t ?l ?y (count (*) as ?c) ('__' AS ?EP) { ?d a <http://purl.org/ontology/bibo/Document> . ?d a ?t . ?d <http://purl.org/dc/terms/language> ?l. ?d <http://purl.org/dc/terms/issued> ?y2. bind( strbefore( ?y2, '-' ) as ?y3 ).  bind( strafter( ?y2, ' ' ) as ?y4 ). bind( if (str(?y3)='' && str(?y4)='',?y2,if(str(?y3)='',?y4,?y3)) as ?y ). } group by ?t ?l ?y";
                sparql_ = 'select * {\n';
                for (var i = 0; i < endp.length; i++) {
                    var endpoint = endp[i];
                    sparql_ += '{service <' + endpoint.endpoint + '> {' + '\n';
                    sparql_ += sparql_td.replace(new RegExp("__", "g"), endpoint.name) + '\n';
                    sparql_ += '}}' + '\n';

                    if (i != endp.length - 1) {
                        sparql_ += 'union' + '\n';
                    }
                }
                sparql_ += '}';
                r = Meteor.call('doQueryCacheStats', {sparql: sparql_}).resultSet.value;
                //console.log(sparql_);
                Obj = JSON.parse(r).results.bindings;

                Stats1 = [];
                for (var i = 0; i < endp.length; i++) {
                    var ls = Obj.filter(function (a) {
                        return a.EP.value == endp[i].name;
                    });

                    Stats1.push({EP: endp[i].name, val: ls});
                }
                Statsc.insert({cod: 3, val: Stats1});
//Por tipo de documento
//
//Autores por tipo de contribucion
                sparql_td = "select ?p (count (*) as ?c) ('__' AS ?EP) {  select distinct ?a ?p {   ?a a <http://xmlns.com/foaf/0.1/Person> .   ?a ?p ?v.    ?v a <http://purl.org/ontology/bibo/Document>  } } group by ?p ";
                sparql_ = 'select * {\n';
                for (var i = 0; i < endp.length; i++) {
                    var endpoint = endp[i];
                    sparql_ += '{service <' + endpoint.endpoint + '> {' + '\n';
                    sparql_ += sparql_td.replace(new RegExp("__", "g"), endpoint.name) + '\n';
                    sparql_ += '}}' + '\n';

                    if (i != endp.length - 1) {
                        sparql_ += 'union' + '\n';
                    }
                }
                sparql_ += '}';
                r = Meteor.call('doQueryCacheStats', {sparql: sparql_}).resultSet.value;
                //console.log(sparql_);
                Obj = JSON.parse(r).results.bindings;
                Stats1 = [];
                for (var i = 0; i < endp.length; i++) {
                    var ls = Obj.filter(function (a) {
                        return a.EP.value == endp[i].name;
                    });
                    var TotDoc = Stats__.filter(function (a) {
                        return a.EP.value == endp[i].name;
                    }) [0];
                    Stats1.push({EP: endp[i].name, val: {total: Number(TotDoc.P.value), val: ls}});
                }
                Statsc.insert({cod: 4, val: Stats1});
//Autores por tipo de contribucion
//Top Autores
                var topKA = 20;
                sparql_td = "select ?a (max (?n) as ?name) (max (?coun) as ?counter) ('__' AS ?EP) {   ?a <http://xmlns.com/foaf/0.1/name> ?n.   {      select ?a (count(*) as ?coun)      {         ?a a <http://xmlns.com/foaf/0.1/Person> .            ?a ?p ?v.             ?v a <http://purl.org/ontology/bibo/Document> .      } group by (?a) order by desc (?coun) limit " + topKA + "    } } group by (?a) order by desc(?co)";
                sparql_ = 'select * {\n';
                for (var i = 0; i < endp.length; i++) {
                    var endpoint = endp[i];
                    sparql_ += '{service <' + endpoint.endpoint + '> {' + '\n';
                    sparql_ += sparql_td.replace(new RegExp("__", "g"), endpoint.name) + '\n';
                    sparql_ += '}}' + '\n';

                    if (i != endp.length - 1) {
                        sparql_ += 'union' + '\n';
                    }
                }
                sparql_ += '} order by desc (?coun)';
                r = Meteor.call('doQueryCacheStats', {sparql: sparql_}).resultSet.value;
                Obj = JSON.parse(r).results.bindings;
                Stats1 = Obj;
                Statsc.insert({cod: 5, val: Stats1});
//Top Autores


//Colecciones
                var topKC = 20000;
                sparql_td = "select ?c (max(?n) as ?name) (count(*) as ?counter) ('__' AS ?EP) {    ?c a <http://purl.org/ontology/bibo/Collection>.    ?c <http://purl.org/dc/terms/description> ?n.   ?d <http://purl.org/dc/terms/isPartOf> ?c. } group by ?c order by desc (?co) limit "+topKC;
                sparql_ = 'select * {\n';
                for (var i = 0; i < endp.length; i++) {
                    var endpoint = endp[i];
                    sparql_ += '{service <' + endpoint.endpoint + '> {' + '\n';
                    sparql_ += sparql_td.replace(new RegExp("__", "g"), endpoint.name) + '\n';
                    sparql_ += '}}' + '\n';

                    if (i != endp.length - 1) {
                        sparql_ += 'union' + '\n';
                    }
                }
                sparql_ += '}  order by desc (?counter)';
                r = Meteor.call('doQueryCacheStats', {sparql: sparql_}).resultSet.value;
                Obj = JSON.parse(r).results.bindings;
                var StopWords2 = ['Tesis de Grado - ', 'Tesis en ', 'Carrera de ', 'Facultad de ', 'Tesis - Carrera de ', 'Tesis - ', 'Tesis de ', 'Instituto de ', 'Facultad ', 'Licenciatura en ', 'Tesis ', 'Escuela de ', 'Exámenes - '];

                for (var i = 0; i < Obj.length; i++) {
                    for (var j = 0; j < StopWords2.length; j++) {
                        Obj[i].name.value = Obj[i].name.value.replace(new RegExp(StopWords2[j], "g"), '');

                    }
                    //Obj[i].name.value = Obj[i].name.value.toLowerCase();
                }

                /*
                var result = [];
                Obj.reduce(function (res, value) {
                    if (!res[value.name.value]) {
                        res[value.name.value] = {
                            counter: 0,
                            name: value.name.value,
                            c: value.c.value,
                            EP: value.EP.value
                        };
                        result.push(res[value.name.value])
                    }
                    res[value.name.value].qty += Number(value.counter.value);
                    return res;
                }, {});
                */
                Stats1 = Obj;
                Statsc.insert({cod: 6, val: Stats1});
//Colecciones






            },
            validateSPARQL: function (sparqlQuery) {
                var response = {};
                try {
                    parserInstance.parse(sparqlQuery);
                    response.statusCode = 200;
                    response.msg = "OK";
                } catch (e) {
                    response.statusCode = 400;
                    response.msg = 'Error parsing SPARQL Query';
                    response.stack = e.toString();
                }
                return response;
            },
            doQuery: function (jsonRequest) {
                console.log('ConsultaQ');
                console.log(jsonRequest);
                var timeout = jsonRequest.timeout ? jsonRequest.timeout : 30000
                var response = {}
                response.statusCode = 200;
                response.msg = undefined;
                response.stack = undefined;
                var endpointBase = Endpoints.findOne({base: true});
                if (!endpointBase) {
                    response.statusCode = 400;
                    response.msg = "Base Endpoint is not registered!";
                } else {
                    try {
                        if (jsonRequest.validateQuery) {
                            parserInstance.parse(jsonRequest.sparql);
                        } else {
                            console.log('==Avoiding SPARQL validation on client');
                        }
                        response.resultSet = Meteor.call('runQuery', endpointBase.endpoint, endpointBase.graphURI, jsonRequest.sparql, undefined, timeout);
                    } catch (e) {
                        console.log(e);
                        response.statusCode = 400;
                        response.msg = "Error executing SPARQL Query: See console for details";
                        response.stack = e.toString();
                    }
                }
                return response;

            },
            doQueryCacheStats: function (a) {
                var g = a.timeout ? a.timeout : 30000;
                var h = {};
                h.statusCode = 200;
                h.msg = void 0;
                h.stack = void 0;
                var i = Endpoints.findOne({
                    base: true
                });
                if (!i) {
                    h.statusCode = 400;
                    h.msg = "Base Endpoint is not registered!";
                } else
                    try {
                        var j = a.sparql.trim().hashCode();
                        var k = Cache.find({key: j}).fetch();
                        var l = {};
                        if (0 == k.length) {
                            l = Meteor.call("runQuery", i.endpoint, i.graphURI, a.sparql, undefined, g);
                            Cache.insert({
                                key: j,
                                value: l.content,
                                ttl_date: new Date(),
                                nresult: 0,
                                original: true
                            });
                            k = Cache.find({key: j}).fetch();
                        }
                        h.resultSet = k[0];
                    } catch (C) {
                        console.log(C.stack);
                        h.statusCode = 400;
                        h.msg = "Error executing SPARQL Query: See console for details";
                        h.stack = C.toString();
                    }
                return h;
            },
            doQueryCache: function (a) {
                var c = a.ApplyFilter ? a.ApplyFilter : false;
                var d = a.MainVar ? a.MainVar : "";
                var e = a.offset ? a.offset : 0;
                var f = a.limit ? a.limit : 10;
                var g = a.timeout ? a.timeout : 30000;
                var h = {};
                h.statusCode = 200;
                h.msg = void 0;
                h.stack = void 0;
                var i = Endpoints.findOne({
                    base: true
                });
                if (!i) {
                    h.statusCode = 400;
                    h.msg = "Base Endpoint is not registered!";
                } else
                    try {
                        if (a.validateQuery)
                            b.parse(a.sparql);
                        else
                            console.log("==Avoiding SPARQL validation on client");
                        var j = a.sparql.trim().hashCode();
                        var k = Cache.find({
                            key: j,
                            nresult: {
                                $gte: e,
                                $lt: e + f
                            }
                        }).fetch();
                        var l = "";
                        if (0 == k.length) {
                            l = Meteor.call("runQuery", i.endpoint, i.graphURI, a.sparql, undefined, g);
                            var m = JSON.parse(l.content);
                            if (c) {
                                var n = Math.max.apply(Math, m.results.bindings.map(function (a) {
                                    return a.Score.value;
                                }));
                                var o = Math.min.apply(Math, m.results.bindings.map(function (a) {
                                    return a.Score.value;
                                }));
                                var p = .5 * (n - o);
                                m.results.bindings = m.results.bindings.filter(function (a) {
                                    return a.Score.value >= n - p;
                                });
                            }
                            var q = m.results.bindings.length;
                            var r = {};
                            var s = 0;
                            for (var t = 0; t < q; t++) {
                                var v = m.results.bindings[t]["" + d].value;
                                if (r["" + v]) {
                                } else {
                                    r["" + v] = s;
                                    s += 1;
                                }
                                var back = l.content;
                                var JSONOut2 = {};
                                var orgi = false;
                                if (t == 0) {
                                    var u = JSON.parse(l.content);
                                    u.results.bindings = [m.results.bindings[t]];
                                    JSONOut2 = l;
                                    JSONOut2.content = JSON.stringify(u);
                                    orgi = true;
                                } else {
                                    var u = m.results.bindings[t];
                                    JSONOut2 = l;
                                    JSONOut2.content = JSON.stringify(u);
                                    orgi = false;
                                    if (JSONOut2.headers) {
                                        delete JSONOut2.headers;
                                    }
                                    if (JSONOut2.statusCode) {
                                        delete JSONOut2.statusCode;
                                    }
                                }
                                Cache.insert({
                                    key: j,
                                    value: JSONOut2,
                                    ttl_date: new Date(),
                                    nresult: r["" + v],
                                    original: orgi
                                });
                                l.content = back;
                            }
                            k = Cache.find({
                                key: j,
                                nresult: {
                                    $gte: e,
                                    $lt: e + f
                                }
                            }, {
                                sort: {
                                    nresult: +1
                                }
                            }).fetch();
                            if (0 == q) {
                                k = [{
                                        key: j,
                                        value: l
                                    }];
                            }
                        }
                        var w = Cache.find({
                            key: j
                        }, {
                            sort: {
                                nresult: -1
                            },
                            limit: 1
                        }).fetch();
                        var x = 0;
                        if (w.length > 0) {
                            x = w[0].nresult + 1;
                        }
                        var k2 = Cache.find({key: j, original: true}, {limit: 1, skip: 0}).fetch();
                        var y = {};
                        var z = {};
                        if (k2.length > 0) {
                            y = k2[0].value;
                            z = JSON.parse(y.content);
                            if (z.results) {
                                z.results.bindings = [];
                            } else {
                                console.log(y.content);
                            }
                        } else {
                            y = k[0].value;
                            z = JSON.parse(y.content);
                        }
                        for (var t = 0; t < k.length; t++) {
                            var A = k[t].value;
                            var B = JSON.parse(A.content);
                            if (B.results) {
                                if (B.results.bindings.length > 0) {
                                    z.results.bindings.push(B.results.bindings[0]);
                                }
                            } else {
                                z.results.bindings.push(B);
                            }
                        }
                        y.content = JSON.stringify(z);
                        h.resultSet = y;
                        h.resultCount = x;
                    } catch (C) {
                        console.log(C.stack);
                        h.statusCode = 400;
                        h.msg = "Error executing SPARQL Query: See console for details";
                        h.stack = C.toString();
                    }
                return h;
            },
            doQueryDesc: function (jsonRequest, endpoint) {
                console.log('ConsultaQ');
                console.log(jsonRequest);
                var timeout = jsonRequest.timeout ? jsonRequest.timeout : 30000
                var response = {}
                response.statusCode = 200;
                response.msg = undefined;
                response.stack = undefined;

                var endpointBase = endpoint;
                //Endpoints.findOne({base: true});

                if (!endpointBase) {
                    response.statusCode = 400;
                    response.msg = "Base Endpoint is not registered!";
                } else {
                    try {
                        if (jsonRequest.validateQuery) {
                            parserInstance.parse(jsonRequest.sparql);
                        } else {
                            console.log('==Avoiding SPARQL validation on client');
                        }
                        response.resultSet = Meteor.call('runQueryDescr', endpointBase.endpoint, endpointBase.graphURI, jsonRequest.sparql, 'application/ld+json', timeout);
                    } catch (e) {
                        console.log(e);
                        response.statusCode = 400;
                        response.msg = "Error executing SPARQL Query: See console for details";
                        response.stack = e.toString();
                    }
                }
                return response;

            },
            saveQuery: function (request) {
                result = {};
                result.statusCode = 200;
                result.msg = 'OK';
                try {
                    var queryMod = Queries.findOne({_id: request._id_});
                    if (queryMod) {

                        if (request.del) {
                            Queries.remove({_id: request._id_});
                        } else {
                            Queries.update({_id: request._id_}, {$set: {user: '', title: request.title, description: request.description,
                                    jsonGraph: JSON.stringify(request.jsonQuery), sparql: request.sparql, image: request.imageData, commend: request.commend}});
                            result.queryId = request._id_;
                        }
                    } else {
                        var id = Queries.insert({user: '', title: request.title, description: request.description,
                            jsonGraph: JSON.stringify(request.jsonQuery), sparql: request.sparql, image: request.imageData, commend: request.commend});
                        result.queryId = id;
                    }
                } catch (e) {
                    console.log(e);
                    result.statusCode = 500;
                    result.msg = e
                }
                return result;
            },
            updatePrefixes: function () {
                HTTP.get('http://prefix.cc/context', function (error, result) {
                    if (result.statusCode == '200' && !error) {
                        result = EJSON.parse(result.content);
                        result = result['@context'];
                        var ci = 0;
                        var ce = 0;
                        if (!_.isUndefined(result)) {
                            for (var prfx in result) {
                                var prfCursor = Prefixes.find({prefix: prfx});
                                if (prfCursor.count() <= 0) {
                                    Prefixes.insert({prefix: prfx, URI: result[prfx]});
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
            runQuery: function (endpointURI, defaultGraph, query, format, timeout) {
                format = _.isUndefined(format) ? 'application/sparql-results+json' : format;
                timeout = _.isUndefined(timeout) ? '0' : timeout;
                return HTTP.get(endpointURI,
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
            runQueryDescr: function (endpointURI, defaultGraph, query, format, timeout) {
                format = _.isUndefined(format) ? 'application/rdf+json' : format;
                timeout = _.isUndefined(timeout) ? '0' : timeout;
                console.log('Consulta' + endpointURI + '+' + query + '+' + format);
                return HTTP.get(endpointURI,
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
            pingServer: function (endpointURI, defaultGraph) {
                var response = {};
                try {
                    var result = Meteor.call('runQuery', endpointURI, '', 'ask {graph <' + defaultGraph + '> {?s ?p ?o}}', undefined, 10000);
                    var content = EJSON.parse(result.content);

                    response.statusCode = result.statusCode;
                    if (result.statusCode != 200) {
                        response.msg = "Error trying to communicate with endpoint " + endpointURI;
                    } else if (result.statusCode == 200 && content.boolean == true) {
                        response.msg = '';
                    } else if (result.statusCode == 200 && content.boolean == false) {
                        response.statusCode = 404;
                        response.msg = "Graph <" + defaultGraph + "> does not exists on endpoint " + endpointURI;
                    }
                } catch (e) {
                    response.statusCode = 500;
                    response.msg = "Error trying to communicate with endpoint " + endpointURI;
                    response.stack = e.stack;
                }

                return response;
            },
            findendpointactual: function (resource) {

                var response = {};
                response.endpoint = {};
                response.content = false;
                console.log('!!!!!!!!!!!!!!EntraEndpoint');
                var endpointsArray = Endpoints.find().fetch();
                console.log(endpointsArray);
                for (var i = 0; i < endpointsArray.length; i++) {
                    console.log('EndpointServer');
                    console.log(endpointsArray[i]);
                    var graph = endpointsArray[i].graphURI;
                    var endpoint = endpointsArray[i].endpoint;


                    try {
                        var result = Meteor.call('runQuery', endpoint, '', 'ASK { graph   <' + graph + '> { <' + resource + '> ?a ?b } }', undefined, 10000);
                        var content = EJSON.parse(result.content);

                        response.statusCode = result.statusCode;
                        if (result.statusCode != 200) {
                            response.msg = "Error trying to communicate with endpoint " + endpoint;
                        } else if (result.statusCode == 200 && content.boolean == true) {
                            response.msg = '';
                            response.endpoint = endpointsArray[i];
                            response.content = true;
                            return response;
                            i = endpointsArray.length;


                        } else if (result.statusCode == 200 && content.boolean == false) {
                            response.statusCode = 404;
                            response.msg = "Graph <" + defaultGraph + "> does not exists on endpoint " + endpoint;
                        }
                    } catch (e) {
                        response.statusCode = 500;
                        response.msg = "Error trying to communicate with endpoint " + endpoint;
                        //response.stack = e.stack;
                    }



                }
                return response;

            },
            findPrefix: function (URIMap) {
                var idx = URIMap.lastIndexOf('#') > 0 ? URIMap.lastIndexOf('#') : URIMap.lastIndexOf('/');
                var uri = URIMap.substring(0, idx + 1);
                var response = {};
                var Prefix = Prefixes.findOne({URI: uri});
                response.prefix = _.isUndefined(Prefix) ? '' : Prefix.prefix;
                response.property = URIMap.substring(idx + 1);
                return response;
            },
            fetchGraphSchema: function (endpointURI, defaultGraph) {
                var muestra;
                console.log('Entra1 ');
                console.log('==Obtaining graph description of <' + defaultGraph + '> from ' + endpointURI + '==');

                var result = Meteor.call('runQuery', endpointURI, defaultGraph,
                        'select distinct ?o where{ ?s a ?o . '
                        + 'BIND(STR(?s) AS ?strVal) '
                        + 'FILTER(STRLEN(?strVal) >= ' + defaultGraph.length + ' && SUBSTR(?strVal, 1, ' + defaultGraph.length + ' ) = "'
                        + defaultGraph + '")}'
                        );

                var rsEntities = EJSON.parse(result.content);

                var dataset = [];
                var datasetRDF = {};
                _.each(rsEntities.results.bindings, function (el, idx, list) {
                    var subject = el.o.value;

                    console.log('=>Obtaining subject properties of: ' + subject);
                    var rsMuestra = Meteor.call('runQuery', endpointURI, defaultGraph,
                            'select distinct ?s where{ ?s a <' + subject + '>} limit 10');

                    var rsMuestra = EJSON.parse(rsMuestra.content);
                    var predicateArray = {};
                    _.each(rsMuestra.results.bindings, function (el, idx, list) {
                        var entity = el.s.value;

                        console.log('==>Graph Entity sample: ' + entity);
                        var rsPredicate = Meteor.call('runQueryDescr', endpointURI, defaultGraph, 'describe <' + entity + '>');
                        //Cambios
                        rsPredicate = EJSON.parse(rsPredicate.content);
                        _.each(rsPredicate, function (el, idx, list) {

                            var Suj = new Object();
                            Suj = el;
                            var s = idx;
                            console.log('Este Sujeto:' + idx);

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


                            if (idx == entity) {
                                var Obj2 = new Object
                                console.log("Ini" + entity);

                                _.each(Suj, function (el, idx, list) {
                                    // 	console.log ('Valor'+idx + 'val'+list[idx]+el.value+el[0].value+'*'+el[0].type);


                                    var p = idx;
                                    var o = el[0];
                                    console.log('Sujeto' + s + 'Predicado' + p + 'Objeto' + o.value + '!' + o.type);

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

                                    if (p == "http://rdaregistry.info/Elements/a/P50161") {
                                        console.log('*******sujeto: ' + entity + '******');
                                    }

                                    if (_.isUndefined(predicateArray[p])) {
                                        var objectObj = {};
                                        objectObj.objectEntity = {};
                                        objectObj.dataType = o.datatype;
                                        objectObj.sampleValue = isNaN(o.value) ? o.value.substring(0, 100) : o.value;

                                        if (o.type === 'uri' && subject != o.value) {

                                            console.log('==>Looking entity type for object <' + o.value + '>');
                                            var rsObjSubject = Meteor.call('runQuery', endpointURI, defaultGraph,
                                                    'select ?o where { <' + o.value + '> a ?o }');

                                            rsObjSubject = EJSON.parse(rsObjSubject.content);

                                            objectObj.objectEntity.fullName = null;
                                            objectObj.objectEntity.prefix = null;
                                            objectObj.objectEntity.name = null;
                                            //if found results
                                            if (rsObjSubject.results.bindings.length > 0) {
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
                    for (var predicate in predicateArray) {
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
                            subject: {fullName: subject, prefix: subjectPrefix.prefix, name: subjectPrefix.property},
                            predicate: {fullName: predicate, prefix: responsePrefix.prefix, name: responsePrefix.property},
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
                                + (_.isUndefined(objectObj.objectEntity.fullName) ? '' : (objectObj.objectEntity.fullName + ' prefix: ' + objectObj.objectEntity.prefix + ' property: ' + objectObj.objectEntity.name))
                                + (objectObj.dataType ? objectObj.dataType : '')
                                + '| SampleValue:' + objectObj.sampleValue);


                        var subjectItem = {fullName: subject, prefix: subjectPrefix.prefix, name: subjectPrefix.property};
                        if (_.isUndefined(datasetRDF[predicate])) {
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
                for (var x in datasetRDF) {
                    //console.log(datasetRDF[x]);
                    Properties.insert(datasetRDF[x]);
                    str = str + '||' + x;
                    cont++;
                }
                console.log('==> contador == : ' + cont);
                console.log('==> predicados == : ' + str);
                return muestra;

            },
            fetchGraphSchema2: function (endpointURI, defaultGraph) {
                console.log('ENtra 2')
                console.log('==Obtaining graph description of <' + defaultGraph + '> from ' + endpointURI + '==');

                var result = Meteor.call('runQuery', endpointURI, defaultGraph, 'select distinct ?o where{ ?s a ?o}');

                var rsEntities = EJSON.parse(result.content);

                var dataset = [];
                var datasetRDF = {};
                ///Cambios JS
                _.each(rsEntities.results.bindings, function (el, idx, list) {
                    var subject = el.o.value;
                    console.log('=>Obtaining subject properties of: ' + subject);
                    var rsMuestra = Meteor.call('runQuery', endpointURI, defaultGraph,
                            'select distinct ?s where{ ?s a <' + subject + '>} limit 5');

                    var rsMuestra = EJSON.parse(rsMuestra.content);
                    var predicateArray = {};
                    _.each(rsMuestra.results.bindings, function (el, idx, list) {
                        var entity = el.s.value;

                        console.log('==>Graph Entity sample: ' + entity);
                        var rsPredicate = Meteor.call('runQuery', endpointURI, defaultGraph, 'describe <' + entity + '>');

                        rsPredicate = EJSON.parse(rsPredicate.content);
                        _.each(rsPredicate.results.bindings, function (el, idx, list) {
                            console.log('-****Predicate: ' + el.p.value);

                            ////////////////////
                            var predicateObj = {};
                            predicateObj.fullName = el.p.value;
                            predicateObj.prefix = '';
                            predicateObj.name = '';

                            /////////////////////

                            if (_.isUndefined(predicateArray[el.p.value])) {
                                var objectObj = {};
                                objectObj.objectEntity = {};
                                objectObj.dataType = el.o.datatype;
                                objectObj.sampleValue = isNaN(el.o.value) ? el.o.value.substring(0, 100) : el.o.value;

                                if (el.o.type === 'uri' && subject != el.o.value) {

                                    console.log('==>Looking entity type for object <' + el.o.value + '>');
                                    var rsObjSubject = Meteor.call('runQuery', endpointURI, defaultGraph,
                                            'select ?o where { <' + el.o.value + '> a ?o }');

                                    rsObjSubject = EJSON.parse(rsObjSubject.content);

                                    objectObj.objectEntity.fullName = null;
                                    objectObj.objectEntity.prefix = null;
                                    objectObj.objectEntity.name = null;
                                    //if found results
                                    if (rsObjSubject.results.bindings.length > 0) {
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
                    for (var predicate in predicateArray) {
                        cont++;
                        var responsePrefix = Meteor.call('findPrefix', predicate);
                        var objectObj = predicateArray[predicate];
                        var subjectPrefix = Meteor.call('findPrefix', subject);

                        console.log('===>SAVED: Subject: ' + subject + ' prefix: ' + subjectPrefix.prefix + ' property: ' + subjectPrefix.property
                                + '| Predicate:' + predicate + ' prefix: ' + responsePrefix.prefix + ' property: ' + responsePrefix.property
                                + '| Object:'
                                + (_.isUndefined(objectObj.objectEntity.fullName) ? '' : (objectObj.objectEntity.fullName + ' prefix: ' + objectObj.objectEntity.prefix + ' property: ' + objectObj.objectEntity.name))
                                + (objectObj.dataType ? objectObj.dataType : '')
                                + '| SampleValue:' + objectObj.sampleValue);


                        var subjectItem = {fullName: subject, prefix: subjectPrefix.prefix, name: subjectPrefix.property};
                        if (_.isUndefined(datasetRDF[predicate])) {
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
            getEndpointStructure: function (graphName, endpointURI, defaultGraph, graphDescription, colorId, baseEndpoint, updateGraph, optional) {
                var endpoint = Endpoints.findOne({endpoint: endpointURI, graphURI: defaultGraph});
                var response = Meteor.call('pingServer', endpointURI, defaultGraph);
                if (response.statusCode != 200 || response.msg.length > 0)
                    return response;
                var statusCode = response.msg.length == 0 ? 'A' : 'I';
                if (baseEndpoint) {
                    Endpoints.update({base: true}, {$set: {base: false}}, {multi: true});
                }
                if (_.isUndefined(endpoint)) {
                    console.log('==Inserting new endpoint');
                    var color_id = colorId ? colorId : '#' + Math.floor(Math.random() * 16777215).toString(16);
                    Endpoints.insert({name: graphName, colorid: color_id, endpoint: endpointURI, graphURI: defaultGraph, description: graphDescription, base: baseEndpoint, status: statusCode, lastMsg: response.msg, opt: optional});
                    //updateGraph = true;
                } else {
                    console.log('==Updating endpoint ' + endpointURI + '<' + defaultGraph + '>');
                    Endpoints.update({_id: endpoint._id}, {$set: {name: graphName, colorid: colorId, endpoint: endpointURI, graphURI: defaultGraph, description: graphDescription, base: baseEndpoint, status: statusCode, lastMsg: response.msg, opt: optional}});
                }
                if (updateGraph) {
                    Properties.remove({endpoint: endpointURI, graphURI: defaultGraph});
                    Meteor.call('fetchGraphSchema', endpointURI, defaultGraph, function (error, result) {
                        if (error) {
                            console.log("Error ==>" + error);
                            response.statusCode = 500;
                            response.stack = error;
                        } else {
                            console.log("Graph Schema fetching process finished for endpoint: " + endpointURI + ' <' + defaultGraph + '>');
                        }
                    });
                } else {
                    console.log("Skipping Graph Schema fetching process for endpoint: " + endpointURI + ' <' + defaultGraph + '>');
                }
                return response;

            },
            updateBaseEndpoint: function (endpointURI, defaultGraph) {
                var endpoint = Endpoints.findOne({endpoint: endpointURI, graphURI: defaultGraph});
                Endpoints.update({base: true}, {$set: {base: false}}, {multi: true});
                //Endpoints.update({_id: endpoint._id}, {$set: {base: true}});
                Endpoints.update({_id: endpoint._id}, {$set: {base: true, opt: false}});
                console.log("==NEW endpoint base: " + endpointURI + " - " + defaultGraph);
            },
            deleteEndpoint: function (id, endpointURI, defaultGraph) {
                Properties.remove({endpoint: endpointURI, graphURI: defaultGraph});
                Endpoints.remove(id);
                console.log("==Endpoint removed: " + endpointURI + " - " + defaultGraph);
            },
            updateOptEndpoint: function (endpointURI, defaultGraph, optional) {
                var endpoint = Endpoints.findOne({endpoint: endpointURI, graphURI: defaultGraph});
                //	Endpoints.update({base: true},{$set: {base: false}},{multi: true});
                //Endpoints.update({_id: endpoint._id}, {$set: {base: true}});
                Endpoints.update({_id: endpoint._id}, {$set: {opt: optional}});
                console.log("==OPtional endpoint opt: " + endpointURI + " - " + defaultGraph + " Opt" + optional);
            },
            findoptional: function (endpointURI, defaultGraph) {
                console.log(endpointURI + defaultGraph);
                var endpoint = Endpoints.findOne({endpoint: endpointURI, graphURI: defaultGraph});
                console.log("Resp" + endpoint.opt);
                return endpoint.opt;

            },
            findbase: function () {
               // console.log(endpointURI + defaultGraph);
                var endpoint = Endpoints.findOne({base : true});
               // console.log("Resp" + endpoint.opt);
                return endpoint;

            }
        });

        //Update Prefixes schema on every server startup
        Meteor.call('updatePrefixes');
        Meteor.call('updateStats');

    });
}

