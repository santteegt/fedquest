var jsonld = require('jsonld');
var d3 = require("d3");
var d3tip = require('d3-tip')(d3);

 this.GraphView = Backbone.View.extend({
      tagName: "div",
      id: "graph",

  /////////////////////////
  // View Initialization //
  /////////////////////////
  initialize: function(v1, v2 , v3) {
    var me;
    me = this;

    //var vv1=v1;
    Session.set('v1', v1);
    Session.set('v2', v2);
    Session.set('v3', v3);
    //var vv2=v2;
    //var vv3=v3;
  // const Configuration = Meteor.subscribe('configuration');
    /*const ConfigStatus = Session.get ("Conf");
    Tracker.autorun(() => {
    const isReady = ConfigStatus.ready();
    console.log ("Listo");
    console.log(isReady);  
    });*/
     

            //var endpoints = Endpoints.find({status: 'A'},{fields:{endpoint: 1, graphURI: 1}}).fetch();
             console.log ("Listo?");
            console.log (Session.get ("Conf"));
          // const s = Session.get ("Sub");
         // const  con =  s.ready();
          if (Session.get ("Conf")) {
            var config = Configuration.find().fetch();

           // Session.set ( "Config" , config );
            console.log ("Tracker Config");
            console.log (config);

          // configent =  _.pluck(config , 'ConfEntity');
              var hashimg = {};
              var hashDes = {};
            _.map( config , function(c){
             _.map (c.ConfEntity , function (d){
              // var U = d.URI ;
                if (!hashimg.hasOwnProperty(d.URI)) {
                  hashimg [d.URI] = d.file ;
                } 
                 if (!hashDes.hasOwnProperty(d.URI)) {
                  hashDes [d.URI] = d.descriptiveprop ;
                } 

              });
             });
             hashimg ["unknow"] = "/images/documento.png";
             hashDes ["unknow"] = "Title";
             console.log ("Calcimg");
             console.log (hashimg);
             Session.set ('img' , hashimg );
             Session.set ('restitle' , hashDes );
             console.log ("directo");
             console.log (Session.get('restitle'));
   } 


                calcexclusion (Session.get ('v2'));
          /*  console.log ("Calcular exclusion");
            var all = Entities.find({ endpoint: Session.get ('v2') }).fetch()[0].entities;
            var alltext = _.pluck (all , "fullName");
            console.log (alltext);
            var some = Configuration.find({Endpoint: Session.get ('v2') }).fetch()[0].VisGraph;
            console.log (some);
            var exclusion =  _.difference (alltext , some);
            Session.set ("exclusion" , exclusion);
            console.log (exclusion);*/
         
  },

  //////////////////////////
  //Render Samples Views//
  //////////////////////////
  render: function() {
   
     
        
    Blaze.render(Template.graph, $('#sparql-content')[0]);

    this.setEvents($('#sparql-content'));
    console.log('render Graph');
    return this;
     

  },
  setEvents: function(divNode) {
 //   console.log ("Configuraciones");
   // console.log (App.GetConfig ());

   //alert ('Nodos');
  //  $("#areagrafo").css( "background", "red" );
   
   
  /* d3.select("#areagrafo").style("background", function() {
  return "hsl(" + Math.random() * 360 + ",100%,50%)";
  });*/
  //var  area =  d3.select("#areagrafo");
  //var width = d3.select("#areagrafo").attr ('width');

  var element = $('#areagrafo');
  var width = $(element).width();
  var  height = $(element).height();

  console.log (width+height);
      //  var height = $(area).height();
     // Create  a SVG root  element
  var svg = d3.select(element[0]).append("svg");

 /* var circle = svg.append("circle")
                         .attr("cx", 30)
                         .attr("cy", 30)
                         .attr("r", 20)
                         .attr ("color","red");*/

 // alert ('valor'+width);
  /*
   var dataset = [ 5, 10, 15, 20, 25];
   d3.select("#areagrafo").selectAll("div")
  .data(dataset)
  .enter()
  .append("div")
  .style("color","teal")
  .style("height",function (d) {
  var barheight = d * 5 ;
  return barheight + "px" ;
  } );
  */
  var result = Meteor.call('loadQueryFirstNode', 'http://purl.org/ontology/bibo/Document', function(error, result) {
               console.log ("Querys");
               console.log (result);
          });

  //var id = "http://190.15.141.66:8899/uce/contribuyente/VELASCO__MARIA_DE_LOURDES";
//  var id = "http://190.15.141.66:8899/uce/contribuyente/ACURIO_DEL_PINO__SANTIAGO"
  //var endpointbase = { "endpoint" : "http://190.15.141.66:8891/myservice/query" , "graphURI" : "http://190.15.141.66:8899/uce/" };





  var id = Session.get('v1');
  var endpointbase = { "endpoint" : Session.get('v2') , "graphURI" : Session.get('v3') };



 // var endpointbase = { "endpoint" : "http://localhost:8891/myservice/query" , "graphURI" : "http://190.15.141.66:8899/uce/" };
   //var data = initiaload (id);
  initiaload (id , endpointbase , width , height , svg ) ;
  // var data = {"@id": "http://190.15.141.66:8899/uce/contribuyente/VELASCO__MARIA_DE_LOURDES" , author : { "http://xmlns.com/foaf/0.1/firstName":"María de Lourdes" , "http://xmlns.com/foaf/0.1/lastName": "Velasco" , "http://xmlns.com/foaf/0.1/name": "Velasco, María de Lourdes"}  };
   //var data = {"@id": "http://190.15.141.66:8899/uce/contribuyente/VELASCO__MARIA_DE_LOURDES" , author : { "foaf:firstName":"María de Lourdes" , "foaf:lastName": "Velasco" , "foaf:name": "Velasco, María de Lourdes"}  };
  // console.log ("Datos");
  // console.log (data);
  //var data =   {"@context":{"foaf":"http://xmlns.com/foaf/0.1/"},"@graph":[{"@id":"http://190.15.141.102:8080/dspace/contribuidor/autor/EspinozaMejia_Mauricio","@type":"foaf:Person","foaf:name":"Espinoza Mejia, Mauricio"}],"@id":"http://190.15.141.85:8080/marmotta/context/default"};

/*
    $( "#dialog-confirm" ).dialog({
      resizable: true,
      height:250,
      autoOpen: false,
 //     width:300,
       modal: true,
      buttons: {
        "Muestra": function() {
          $( this ).dialog( "close" );
        },
        "Todos ": function() {
          $( this ).dialog( "close" );
        }
      }
    });
*/

     
  
    
  }
});
    function calcexclusion ( endpointactual ) {

        console.log ("Calcular exclusion");
        console.log (endpointactual);
            var all = Entities.find({ endpoint: endpointactual }).fetch()[0].entities;
            var alltext = _.pluck (all , "fullName");
            console.log (alltext);
            var some = Configuration.find({Endpoint: endpointactual }).fetch()[0].VisGraph;
            console.log (some);
            var exclusion =  _.difference (alltext , some);
            //Session.set ("exclusion" , exclusion);
            console.log (exclusion);
            return exclusion;

    } ;


   function initiaload (idbase , endpointbase ,  width , height ,  svg ) 
   {
           // var sparql = 'select * where { <'+idbase+'> ?b ?c . filter isLiteral (?c) }';
         /*  var prefix =  ' PREFIX dct: <http://purl.org/dc/terms/> '
                       + ' PREFIX bibo: <http://purl.org/ontology/bibo/> '
                       + ' PREFIX foaf: <http://xmlns.com/foaf/0.1/>  ' ; */
          //  var sparql = 'select * where { <'+idbase+'> ?b ?c}';
            var objroot = {}; 
            var scope =  "scope" ;

           //var exc =  Session.get ('exclusion');
           var exc = calcexclusion (endpointbase ['endpoint']);
             var exclusion = '';
            if (exc.length > 0) {
              var noexist = " . FILTER NOT EXISTS { ";
              var exceptions = '';
              for (var i= 0 ; i< exc.length ;i++){
                 exception =  '?c a  <'+exc[i]+'> ';
                   if ( i > 0 ){
                   exceptions = exceptions + ' . '+exception;
                   } else {
                    exceptions = exception;
                   }
              }
              exclusion = noexist+exceptions+' }';
            }
           



           var sparql = 'Construct {'
                      + '<'+idbase+'> ?b ?c }'
                      + 'where  { <'+idbase+'> ?b ?c '+exclusion+'} limit 1000' ;

         var context = {
                                "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
                                "foaf": "http://xmlns.com/foaf/0.1/",
                                "dc": "http://purl.org/dc/elements/1.1/",
                                "dcterms": "http://purl.org/dc/terms/",
                                "bibo": "http://purl.org/ontology/bibo/",
                                "uc": "http://ucuenca.edu.ec/wkhuska/resource/"
                            };



            
          //  jsonsparql = { "sparql": sparql , 'validateQuery': false} ;
           // var endpoint = Endpoints.findOne({endpoint: endpointURI, graphURI: defaultGraph});
             var  jsonsparql = { "sparql": sparql , 'validateQuery': false} ;
            //var endpointBase = Endpoints.findOne({base: true}); 
             console.log ("call");
         // Meteor.call('runQuery', endpointbase.endpoint ,  endpointbase.graphURI , sparql, "application/ld+json" , 30000 , function (error , result) {
         //    Meteor.call('runQuery', endpointbase.endpoint ,  endpointbase.graphURI , sparql, "application/sparql-results+json" , 30000 , function (error , result) {
              Meteor.call('doQueryDesc' , jsonsparql , endpointbase  , function (error , result) {
           if(result.resultSet) {
                  $('#modalLog .console-log').html('');
                    var resourcebase = {};
                    console.log (result.resultSet);
                    var data = jQuery.parseJSON( result.resultSet.content);
                  
                    

                   //  var resultjson = jQuery.parseJSON( result.resultSet.content);

                    /* console.log ("Compactcall");
                     jsonld.compact(data , context, function(err, compacted) {
                     console.log (err);
                     console.log ("Compacted");
                     console.log(JSON.stringify(compacted, null, 2)); 
                     
                   //  child [entityname] = {'@id' : objson["@id"] , 'data' : dataresult[i] , children : [] } ;
                     resourcebase["@id"] =  compacted["@id"] ;
 
                         var  entityname= '';
                       if (compacted['@type'] ==  'bibo:Collection' ) {
                            
                              entityname = 'collection';
                           } else if ( compacted['@type'] == "foaf:Person") {
                              entityname ='author';

                           }else //if (  "bibo:Document" in compacted['@type'] )  //CHange
                            {
                               
                              entityname = 'publication';
                           }
                     resourcebase [ entityname] = {'@id' : compacted["@id"] , 'data' : compacted , children : [] };
                     draw(svg, width, height, resourcebase , scope , endpointbase); 

                           */
                     jsonld.expand(data, function(err, expanded) {
                          console.log ("Expand");                      
                          console.log (expanded[0]);
                          expanded = expanded[0];
                         
                        resourcebase["@id"] =  expanded["@id"] ;
                        var typeA = expanded['@type'];
                         var entityname = '';
                         if (Array.isArray(typeA)) {
                          entityname = typeA[0];
                         } else {
                           entityname = typeA;
                         }

                      resourcebase [ entityname] = {'@id' : expanded["@id"] , 'data' : expanded , children : [] };
                     resourcebase [ 'tipo'] = entityname;
                     draw(svg, width, height, resourcebase , scope , endpointbase); 

                            });


                     
                //     datachildren (idbase , compacted , node , "publication");
                     // _.without(compacted, _.findWhere(compacted, {id: 3}));
                     


                    } else {

                        alert ("Endpoints No disponibles");
                    }
/*
                    console.log (data);
                    var arrayprop = [];
                    var dataresult =  data.results.bindings;    
                    console.log (dataresult);
                    var typeresource = '' ;
                     objroot = {};               
                    var properties = {};
                       for ( var i =0 ; i< dataresult.length ; i++){
                      
                      if (dataresult[i].c.type == 'literal'){
                          properties[dataresult[i].b.value] = dataresult[i].c.value ;
                         //  arrayprop.push(properties);
                       } else if ( dataresult[i].c.value == 'http://xmlns.com/foaf/0.1/Person' )
                       {
                            typeresource = 'author';
                       }else if ( dataresult[i].c.value == 'http://purl.org/ontology/bibo/Collection')
                       {
                            typeresource =  'collection';
                       }else if (dataresult[i].c.value  == 'http://purl.org/ontology/bibo/Document') {
                             typeresource =  'publication';
                       }

                   // datachildren (idbase , result.resultSet.content , node , "publication");
                    }
                       if (typeresource == '' ) { typeresource =  'publication';};
                    objroot = {"@id": idbase } ;
                    objroot[typeresource] = { "@id": idbase ,"data": properties } ;
                    console.log ("Datos objroot");
                    console.log (objroot) ;
                    draw(svg, width, height, objroot, scope , endpointbase); 

                    
                 } else {

                    alert ("nada");
                 }
                
               */


            } );
                  
    };


 function draw(svg, width, height, data, scope , endpoint ) {
         var tip = d3.tip()
                        .attr('class', 'tree-d3-tip')
                       /*  .offset(function() {
                        // console.log (this);
                          return [this.getBBox().height / 2, 0]
                        })*/
                        .html(function (d) {
                            return ' ';
                        });
/*
         var tip2 = d3.tip()
                        .attr('class', 'tree-d3-tip-rel')
                        //.offset([-10, 0])
                        .html(function (d) {
                            return ' ';
                        });*/

            //alert('graph');
            // Misc. variables
            var endpointactual = endpoint ;
            var i = 0;
            var duration = 750;
            var root;
            var rightPaneWidth = 350;
            var exploredArtistIds = [];
            var exploredPublicationsIds = [];
            // avoid clippath issue by assigning each image its own clippath
            var clipPathId = 0;
            var lastExpandedNode;
            // size of the diagram
            var viewerWidth = width;
            var viewerHeight = height;
            var tree = d3.layout.tree()
                    .size([height, width]);
            var diagonal = d3.svg.diagonal()
                    .projection(function (d) {
                        return [d.y, d.x];
                    });

           // console.log (data);
            exploredArtistIds = [];
            initWithArtist(data);
            root = data ;
            root.x0 = viewerHeight / 2;
            root.y0 = 0;
            console.log ("Root");
            console.log (root);
            
        //    click(root);

              function zoom() {
                svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            }

            var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);
            svg
                    .attr("width", viewerWidth)
                    .attr("height", viewerHeight)
                    .attr("class", "tree-overlay")
                    .call(zoomListener);
            function updateWindow() {
                viewerWidth = $(window).width() - rightPaneWidth;
                viewerHeight = $(window).height();
                svg.attr("width", viewerWidth).attr("height", viewerHeight);
                if (lastExpandedNode) {
                    centerNode(lastExpandedNode);
                }
            }
       
             function contextMenu() {
                var height,
                        width,
                        margin = 0.1, // fraction of width
                        items = [],
                        rescale = false,
                        style = {
                            'rect': {
                                'mouseout': {
                                    'fill': 'rgb(244,244,244)',
                                    'stroke': 'white',
                                    'stroke-width': '1px'
                                },
                                'mouseover': {
                                    'fill': 'rgb(200,200,200)'
                                }
                            },
                            'text': {
                                'fill': 'steelblue',
                                'font-size': '13'
                            }
                        };
                function menu(x, y) {
                    alert('Entra menu');
                    console.log ('Entra menu');
                    d3.select('.context-menu').remove();
                    scaleItems();
                    // Draw the menu
                    d3.select('svg')
                            .append('g').attr('class', 'context-menu')
                            .selectAll('tmp')
                            .data(items).enter()
                            .append('g').attr('class', 'menu-entry')
                            .style({'cursor': 'pointer'})
                            .on('mouseover', function () {
                                d3.select(this).select('rect').style(style.rect.mouseover)
                            })
                            .on('mouseout', function () {
                                d3.select(this).select('rect').style(style.rect.mouseout)
                            });
                    d3.selectAll('.menu-entry')
                            .append('rect')
                            .attr('x', x)
                            .attr('y', function (d, i) {
                                return y + (i * height);
                            })
                            .attr('width', width)
                            .attr('height', height)
                            .style(style.rect.mouseout);
                    d3.selectAll('.menu-entry')
                            .append('text')
                            .text(function (d) {
                                return d;
                            })
                            .attr('x', x)
                            .attr('y', function (d, i) {
                                return y + (i * height);
                            })
                            .attr('dy', height - margin / 2)
                            .attr('dx', margin)
                            .style(style.text);
                    // Other interactions
                    d3.select('body')
                            .on('click', function () {
                                d3.select('.context-menu').remove();
                            });
                }

                menu.items = function (e) {
                    if (!arguments.length)
                        return items;
                    for (i in arguments)
                        items.push(arguments[i]);
                    rescale = true;
                    return menu;
                }

                // Automatically set width, height, and margin;
                function scaleItems() {
                    if (rescale) {
                        d3.select('g.tree-node').selectAll('tmp')
                                .data(items).enter()
                                .append('text')
                                .text(function (d) {
                                    return d;
                                })
                                .style(style.text)
                                .attr('x', -1000)
                                .attr('y', -1000)
                                .attr('class', 'tmp');
                        var z = d3.selectAll('.tmp')[0]
                                .map(function (x) {
                                    return x.getBBox();
                                });
                        width = d3.max(z.map(function (x) {
                            return x.width;
                        }));
                        margin = margin * width;
                        width = width + 2 * margin;
                        height = d3.max(z.map(function (x) {
                         //   return x.height + margin / 2;
                          return x.height + margin;
                        }));
                        // cleanup
                        d3.selectAll('.tmp').remove();
                        rescale = false;
                    }
                }

                return menu;
            }

            var menu = contextMenu().items('first item', 'second option', 'whatever, man'); 


           var svgGroup = svg.append("g");

          function initWithArtist(dataini) {
                console.log ("nodobase");
                console.log (dataini);
                var id = dataini["@id"];
            
               // var id = author["@graph"][0]["@id"];
                exploredArtistIds.push(id);
                console.log ('exploredAr');
                console.log (exploredArtistIds);
                
              //  var dataini;
              /*
                if (isAuthor(dataini)){
                return  { "@id": id ,
                 'author': {"@id": id, data: dataini.author.data},
                  'children': null }

                }else if (isPublication(dataini)) 
                {
                 return  { "@id": id ,
                 'publication': {"@id": id, data: dataini.publication.data },
                  'children': null }
                } else if (isCollection(dataini)) {
                 return  { "@id": id ,
                 'collection': {"@id": id, data: dataini.collection.data },
                  'children': null }
                }
               return dataini;

             /*{
                 'author': {"@id": id, data: dataini},
                  'children': null
                }*/
            }  ;
           
            function searchTree(element, matchingTitle){
            if(element["@id"] == matchingTitle){
            return element;
            }else if (element.children != null){
            var result = null;
            for(i=0; result == null && i < element.children.length; i++){
               result = searchTree(element.children[i], matchingTitle);
            }
            return result;
            }
            return null;
            };


            function update(source, expand) {
                var levelWidth = [1];
                var childCount = function (level, n) {
                    if (n.children && n.children.length > 0) {
                        console.log ("Arbol");
                        console.log (n["@id"]);
                        if (levelWidth.length <= level + 1)
                            levelWidth.push(0);
                        levelWidth[level + 1] += n.children.length;
                        n.children.forEach(function (d) {
                            childCount(level + 1, d);
                        });
                    }
                };

               

                childCount(0, root);
                console.log ('child count');
                console.log (childCount);
              //  var newHeight = d3.max(levelWidth) * 100;
               var newHeight = d3.max(levelWidth) * 200;//100
                tree = tree.size([newHeight, viewerWidth]);
                // Compute the new tree layout.
                console.log ('Raiz');
                console.log (root);
                var nodes = tree.nodes(root).reverse();
                var links = tree.links(nodes);
                // Set widths between levels
                nodes.forEach(function (d) {
                    d.y = (d.depth * 350);//220
                });
                // Update the nodes…
                var node = svgGroup.selectAll("g.tree-node")
                        .data(nodes, function (d) {
                            return d.id || (d.id = ++i);
                        });
                // Tip Creation for title

          /*      var tip = d3.tip()
                        .attr('class', 'tree-d3-tip')
                        .html(function (d) {
                            return ' ';
                        });*/


                // Enter any new nodes at the parent's previous position.

                var nodeEnter = node.enter().append("g")
                        // .call(dragListener)
                        .call(expand ? tip : function () {
                        })
                        .attr("class", "tree-node")
                        .attr("transform", function (d) {
                            return "translate(" + source.y0 + "," + source.x0 + ")";
                        })
                        .on("mouseover", function (d) {
                            var node = d;
                           var id;
                               id =  d["@id"];
                           /* if ('publication' in d) {
                                 id = d.publication["@id"];
                              //  var title = _.findWhere(node.publication.jsonld["@graph"], {"@id": id, "@type": "bibo:Document"})["dcterms:title"];
                              //  tip.html(title);
                              //  tip.html(id);
                              //  tip.show(d);
                                //AE.getInfo(d.author);
                            } else if ('author' in d)
                            {
                                var id = d.author["@id"];
                             //   tip.html(id);
                              //  tip.show(d);
                            } else  if ('collection' in d) {
                                var id = d.collection["@id"];
                              //  tip.html(id);
                               // tip.show(d);
                            }
                            // console.log ( d3.select(this));
                            // console.log (scale);
                            // console.log ($("svg.tree-overlay").children('g'));
                            /* tip.offset(function() {
                             return [10, 0]
                             })*/
                          tip.offset(function() {
                      
                                  return [ 0 , 0] ;
                          });
                           tip.direction('n');

                                tip.html(id);
                                tip.show(d);
                        })
                        .on("mouseout", function (d) {
                           /* if ('publication' in d) {
                                tip.hide(d);
                                //AE.getInfoCancel();
                            }
                            else if ('author' in d) {
                                tip.hide(d);
                                //AE.getInfoCancel();
                            } else if ('collection' in d){
                                tip.hide (d);
                            }else {tip.hide (d); 
                            }*/
                            tip.hide(d);
                        })
                        .on('contextmenu', function (d) {
                            d3.event.preventDefault();
                            toggleChildrenRightClick(d);
                        })
                        .on('click', click);
                nodeEnter.append("circle")
                        .attr("r", 32)
                        .style("fill", function (d) {
                            return d._children ? "black" : "#fff";
                        });
                clipPathId++;
                nodeEnter.append("clipPath")
                        .attr("id", "clipCircle" + clipPathId)
                        .append("circle")
                        .attr("r", 32);
                /*
                 nodeEnter.append("svg:a")
                 .attr("xlink:href", function(d) {
                 if(isAuthor(d)) {
                 var id = d.author["@id"];
                 var author = _.findWhere( d.author.jsonld["@graph"], {"@id": id, "@type": "foaf:Person"} );
                 return author && author['foaf:name'] ? '':id;  
                 }
                 }).attr('target','_blank');
                 */


                nodeEnter.append("image")
                        .attr("xlink:href", function (d) {
                      /* if (isAuthor(d)) {
                                return '/images/author-default.png';
                                //return AE.getSuitableImage(d.author.images);
                           } else if (isCollection(d)) {
                               return '/images/collection.png' ;
                              
                            }else {

                                return '/images/documento.png' ;
                            }*/
                             return resourceicon(d);
                        })
                        .attr("x", "-32px")
                        .attr("y", "-32px")
                        .attr("clip-path", "url(#clipCircle" + clipPathId + ")")
                        .attr("width",
                                function (d) {
                                    return 64;
                
                                })
                        .attr("height",
                                function (d) {
                                    return 64;

                                });

                nodeEnter.append("text")
                        .attr("x", function (d) {
                            return -125;
                        })
                        .attr("dy", "50")
                        .attr('class', 'tree-nodeText')
                        .attr("text-anchor", function (d) {
                            return "start";
                            //return "middle";
                        })
                        .text(function (d) {
                         var title =   resourcetitle(d);
                            var t = '';

                           // console.log ("TITULO");
                            //console.log (title);
                            if (Array.isArray(title)) {
                                    t = title [0];
                                  } else {
                                    t = title;
                                  }
                     //      console.log ("3");
                                   console.log ("Entrando Title");
                                   console.log (d);
                                   var restitle = {};
                                if (t.length>1){
                                   console.log ("sI"+t+t.length);

                                  if (typeof d[d.tipo]['data'][t] === "undefined" ){
                                   restitle['@value'] =  relativeURI(d.tipo);
                                   }else {
                                   restitle = d[d.tipo]['data'][t];
                                  }
                                  console.log (restitle);
                                } else {
                               //   console.log ("no"+t+t.length);
                                   restitle['@value']= relativeURI(d.tipo);
                                }
                                // console.log ("2");

                                   if (Array.isArray(restitle)) {
                                       restitle = restitle[0];
                                      } 
                                       restitle = restitle['@value']; 
                                   console.log ("3");
                                   console.log (restitle);
                              if (restitle.length > 40){
                                 restitle  = restitle.substring (0,40)+ '...';

                              }

                              return restitle;

                        })
                        .style("fill-opacity", 0);


                // Transition nodes to their new position.
                var nodeUpdate = node.transition()
                        .duration(duration)
                        .attr("transform", function (d) {
                            return "translate(" + d.y + "," + d.x + ")";
                        });
                // Fade the text in
                nodeUpdate.select("text")
                        .style("fill-opacity", 1);
                // Transition exiting nodes to the parent's new position.
                var nodeExit = node.exit().transition()
                        .duration(duration)
                        .attr("transform", function (d) {
                            return "translate(" + source.y + "," + source.x + ")";
                        })
                        .remove();
                nodeExit.select("circle")
                        .attr("r", 0);
                nodeExit.select("text")
                        .style("fill-opacity", 0);
                // Update the links…
                var link = svgGroup.selectAll("path.tree-link")
                        .data(links, function (d) {
                            return d.target.id;
                        }) ;
                   /*       .enter()
                          .append("g")
                          .attr("class", "tree-link")
                        ;*/
                  
                // Enter any new links at the parent's previous position.
             //             link.append("path")
                 link.enter().insert("path", "g")
                 //    link.enter().insert("path", "g")
                 .attr("class", "tree-link")
                        .on("mouseover", function (d) {
                         tip.offset(function() {
                          console.log ("Offset");
                          var s = zoomListener.scale();
                          if (s < 1) {
                            s  = s + (0.05);
                          }
                          console.log (s);
                        //  console.log (Math.abs((d.source.x - d.target.x)/10));
                          return [ 0 , -190*s] ;
                          });

                         tip.direction('e');
                         console.log ("Etiqueta");
                         console.log (d);
                          tip.html( function (d) 
                          {
                            var enlace = "" ;
                            enlace = d.target[d.target.tipo]["relation"];
                       /*   if (isAuthor(d.target)) {
                          
                              enlace = d.target["author"]["relation"];
                          } else if (isPublication(d.target)) {
                             
                             enlace = d.target["publication"]["relation"];
                    
                          } else if (isCollection(d.target)) {
                      
                             enlace = d.target["collection"]["relation"];
                           }
                           */
                           return   equivalencias (enlace);

                          }
                            );
                          tip.show(d);})
                         .on("mouseout", function (d) { tip.hide (d); })
                        .attr("d", function (d) {
                           //   console.log ("Ruta Link");
                           //   console.log (diagonal.projection);
                           //   console.log (d);
                            var o = {
                                x: source.x0,
                                y: source.y0
                            };
                            return diagonal({
                                source: o,
                                target: o
                            });
                        }) ;
                       
                  
            

                     

               // Add label to Link
                link.append("text")
              // .attr("font-family", "Arial, Helvetica, sans-serif")
                //.attr("fill", "Black")
              //  .style("font", "normal 12px Arial")
               /* .attr("transform", function(d) {
                       console.log ("Ruta Link");
                           //   console.log (diagonal.projection);
                       console.log (d);
                return "translate(" +
                ((d.source.y0 + d.target.y)/2) + "," + 
                ((d.source.x0 + d.target.x)/2) + ")";
                 })  */
           //     .attr("dy", ".35em")
                .attr("x", function (d) {
                     return (d.source.y + d.target.y)/2;
                        })
                .attr("dy", function (d) {
                        return   (d.source.x + d.target.x)/2;
                        })
                //.attr("dy", "50")
                .attr("text-anchor", "start")
                .attr('class', 'tree-textLink')
                .text(function(d) {
                 //console.log("Enlace");
                 return "Enlace";
                }).style("fill-opacity", 0);
                  
               link.select("text")
                        .style("fill-opacity", 1);


                // Transition links to their new position.
                link.transition()
                        .duration(duration)
                        .attr("d", diagonal);

                  link.select("text")
                        .style("fill-opacity", 1);

                // Transition exiting nodes to the parent's new position.
                link.exit().transition()
                        .duration(duration)
                        .attr("d", function (d) {
                            var o = {
                                x: source.x,
                                y: source.y
                            };
                            return diagonal({
                                source: o,
                                target: o
                            });
                        })
                        .remove();
                // Stash the old positions for transition.
                nodes.forEach(function (d) {
                    d.x0 = d.x;
                    d.y0 = d.y;
                });
            }
                function equivalencias(text) {
                    if (text == "http://rdaregistry.info/Elements/a/P50195"){
                        return "author of";
                      }
                      else if (text == "http://rdaregistry.info/Elements/a/P50161"){
                         return  "contributor of";
                      }else {

                         return relativeURI (text);
                      }

                }

                function relativeURI (text) {
                     if ( text.indexOf(":") > 0) {
                          text = text.substr(text.indexOf(":") + 1);
                        }

                   var index =  text.lastIndexOf("/") ? text.lastIndexOf("/") : text.lastIndexOf("#"); 
                          if (index > 0) {
                            text = text.substr(index+1);
                          }

                        return text ;
                      
                 }

             function toggleChildrenRightClick(d) {
                if (d.children) {
                    removeChildrenFromExplored(d);
                    d.children = null;
                    update(d, false);
                    centerNode(d);
                } else {
                    if (isAuthor(d)) {
                        setChildrenAndUpdateForAuthor(d, true);
                    }
                }
                return d;
            }

            function removeExpandedId(d) {
                if (d.children) {
                    d.children.forEach(function (node) {
                        removeExpandedId(node);
                        tip.hide(node);
                        console.log("ocultar2");
                        console.log(node);

                    });
                }
                
                var indexToRem = exploredArtistIds.indexOf(d.id);
                    exploredArtistIds.splice(indexToRem, 1);
             /*   if (isAuthor(d)) {
                    var indexToRem = exploredArtistIds.indexOf(d.author.id);
                    exploredArtistIds.splice(indexToRem, 1);
                } else {

                }*/
            }

            function removeChildrenFromExplored(d) {
                d.children.forEach(function (node) {
                    removeExpandedId(node);
                        tip.hide(node);
                        console.log("ocultar2");
                        console.log(node);

                });
            }

            function centerNode(source) {
                lastExpandedNode = source;
                var scale = zoomListener.scale();
                var x = -source.y0;
                var y = -source.x0;
                x = x * scale + viewerWidth / 2;
                y = y * scale + viewerHeight / 3;
                // d3.select('#tree-container g').transition()
                svg.select('g').transition()
                        .duration(duration)
                        .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
                zoomListener.scale(scale);
                zoomListener.translate([x, y]);
            }

                function resourceicon(d) {
                   console.log (Session.get ('img'));
                   var imag = Session.get('img');
                  
                   console.log ("Imagen -------");
                   console.log (imag);
                   console.log (imag [d.tipo]);
                   return imag [d.tipo];
                 // d.tipo;

                 } 

                   function resourcetitle(d) {
                   var des = Session.get('restitle');
                   console.log ("obtener des");
                   console.log (d.tipo);
                   console.log (des[d.tipo]);
                 //  if (des[d.tipo] != undefined ){
                   if ( typeof des[d.tipo] === "undefined" ){
                   return "";
                   }else {
                     return des [d.tipo];
                   
                   }
                 // d.tipo;

                 } 


               function isAuthor(d) {
                return 'author' in d;
            }

            function isPublication(d) {
                return 'publication' in d;
            }
            function isCollection (d){
                return 'collection' in d ;
            }
                
                function click(d) {
                $('div.tree-node-info .entityInfo').html('');
                console.log ('Click d');
                console.log (d);
                console.log ("BASE TREE");
                console.log (root);

                if (d.children) {
                  Expand (d);
                } else {
                var levelWidth = [1];
                var nodorepetido;
                var childCount = function (level, n , id) {
                    if (n.children && n.children.length > 0) {
                       if (id ==  n["@id"]){
                        console.log ("Arbol encontrado");
                        console.log (n["@id"]);
                        console.log (n["x"]);
                        console.log (n["y"]);
                        nodorepetido = n;
                        }else {
                        console.log ("Arbol");
                        console.log (n["@id"]);
                        console.log (n["x"]);
                        console.log (n["y"]);
                        }
                        if (levelWidth.length <= level + 1)
                            levelWidth.push(0);
                        levelWidth[level + 1] += n.children.length;
                        n.children.forEach(function (d) {
                            childCount(level + 1, d , id);
                        });
                    }
                };

                childCount(0, root, d["@id"]);
                
              
                 console.log ("Valor Nodo");
                 console.log (nodorepetido);

                if ( typeof nodorepetido === "undefined" )
                {
                   Expand (d);
                } else {
                  console.log ("Valor encontrado");
                  console.log (nodorepetido);
                  centerNode (nodorepetido) ;
                     
                }
                }

                 //var copia = _.clone( root);
               /* var nodot = searchTree ( root , d["@id"]);
                console.log ("NODO REPETIDO --------------------");
                console.log (nodot);
               // d = toggleChildren(d);
                if (nodot.children &&  nodot.children.length > 0 ) {
                  //centerNode(d);
                 } else {  
                  Expand (d);
                }*/
             
            }
       

            function  Expand (d) {
               if (d.children) {
                    removeChildrenFromExplored(d);
                    d.children = null;
                    update(d, false);
                    centerNode(d);
                } else {
                   
                      drawpanel (d , d.tipo);

                     Datachild(d , endpointactual , true );
                    //console.log ("Node");
                    //console.log (d);
                   // Datachild(d);
                }  
             }



               function Datachild (node  , endpointselect , wait )
                {   // var idbase =  'http://190.15.141.66:8899/uce/contribuyente/VELASCO__MARIA_DE_LOURDES';
                   
                    console.log ("Consulta");
                    console.log (node);
                    var idbase = node["@id"];
                    if (wait) {
                       waitingDialog.show();
                       } 
                  //   if (isCollection(node)) { waitingDialog.show(); }

                    var prefix =  ' PREFIX dct: <http://purl.org/dc/terms/> '
                                + ' PREFIX bibo: <http://purl.org/ontology/bibo/> '
                                + ' PREFIX foaf: <http://xmlns.com/foaf/0.1/>  ' ; 

                      
                   // jsonsparql = { sparql: 'select * where {<http://190.15.141.66:8899/uce/contribuyente/VELASCO__MARIA_DE_LOURDES> ?b ?c . filter (str(?b) != str(<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>))}' , validateQuery: false} ;
                    /*
                    var sparql = ' Construct { '  
                  + '<'+idbase+'> ?b ?c .'
                  + '?c <http://purl.org/dc/terms/title> ?t .'
                  + '?c <http://purl.org/dc/terms/subject> ?s .'
                  + '?c <http://purl.org/dc/terms/language> ?l .'
                  + '?c <http://purl.org/ontology/bibo/handle> ?h . '
                  + '?c <http://purl.org/dc/terms/provenance> ?p .'
                  + '?c <http://purl.org/ontology/bibo/abstract> ?ab .'
                  + '?c <http://purl.org/dc/terms/license>  ?lic .'
                  + '?c <http://purl.org/dc/terms/dateSubmitted> ?ds . '
                  +  '?c <http://purl.org/dc/terms/available>  ?da .'
                  +  '?c <http://xmlns.com/foaf/0.1/name> ?na  . '
                  +  '?c <http://xmlns.com/foaf/0.1/lastName> ?ln .'
                  +  '?c <http://xmlns.com/foaf/0.1/firstName>  ?fn .'
                  +  '?c <http://purl.org/dc/terms/description> ?cdes .'
                  +  '?c <http://purl.org/ontology/bibo/uri> ?ur .'
                  +  '?c   <http://www.w3.org/1999/02/22-rdf-syntax-ns#type>   ?tipe }' 
                  +  'where {<'+idbase+'> ?b ?c .'
                  +   'OPTIONAL { ?c <http://purl.org/dc/terms/title> ?t  }'
                  +   'OPTIONAL { ?c <http://purl.org/dc/terms/subject> ?s  }'
                  +   'OPTIONAL { ?c <http://purl.org/dc/terms/language> ?l}'
                  +   'OPTIONAL { ?c <http://purl.org/ontology/bibo/handle> ?h}'
                  +   'OPTIONAL { ?c <http://purl.org/dc/terms/provenance> ?p}'
                  +   'OPTIONAL { ?c <http://purl.org/ontology/bibo/abstract> ?ab }'
                  +   'OPTIONAL { ?c <http://purl.org/dc/terms/license>  ?lic }'
                  +   'OPTIONAL { ?c <http://purl.org/dc/terms/dateSubmitted> ?ds }'
                  +   'OPTIONAL { ?c <http://purl.org/dc/terms/issued> ?di }'
                  +   'OPTIONAL { ?c <http://purl.org/dc/terms/available>  ?da }'
                  +   'OPTIONAL {  ?c   <http://xmlns.com/foaf/0.1/name> ?na }'
                  +   'OPTIONAL {  ?c   <http://xmlns.com/foaf/0.1/lastName> ?ln }'
                  +   'OPTIONAL {  ?c  <http://xmlns.com/foaf/0.1/firstName>  ?fn }'
                  +   'OPTIONAL { ?c <http://purl.org/dc/terms/description> ?cdes }'
                  +   'OPTIONAL { ?c <http://purl.org/ontology/bibo/uri> ?ur } ' 
                  +  'OPTIONAL {?c   <http://www.w3.org/1999/02/22-rdf-syntax-ns#type>   ?tipe}}' 
                  +  'Order by (?b)' ;
               //   + 'filter (str(?b) != str(<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>))'

                  */
            
               calcexclusion (endpointselect['endpoint']);

             //var exc =  Session.get ('exclusion');
             var exc =   calcexclusion (endpointselect['endpoint']);
             var exclusion = '';
             var Filter = '';
            if (exc.length > 0) {
            //  var noexist = " . FILTER NOT EXISTS { ";
              var exceptions = '';
              for (var i= 0 ; i< exc.length ;i++){
                 exception = ' ?y != <'+exc[i]+'>  ';
                   if ( i > 0 ){
                   exceptions = exceptions + ' && '+exception;
                   } else {
                    exceptions = exception;
                   }
              }
               exclusion = exceptions+' ';
              //exclusion = exceptions+' && ';
                Filter = '. FILTER  ( '+exclusion+' )';
            }   

                  
                  var sparql =  'Construct {  <'+idbase+'> ?b ?c . <'+idbase+'> a ?z . <'+idbase+'> ?n ?m '+
                    '. ?c ?a ?x . ?c a ?y } where { <'+idbase+'> ?b ?c  . <'+idbase+'> a ?z .   <'+idbase+'> ?n ?m .' +
                   '?c ?a ?x .  ?c a ?y '+Filter+' }';


                   var  jsonsparql = { "sparql": sparql , 'validateQuery': false} ;
                    Meteor.call('doQueryDesc', jsonsparql , endpointselect , function(error, result) {
                   if(result.statusCode != 200) {
                   console.log(result.stack);
                   $('#modalLog .console-log').html(result.stack ? (result.stack.replace(/[<]/g,'&#60;').replace(/[\n\r]/g, '<br/>')):'');
            //$('#sparqlEditor button#consoleError').show();
                   var message = result.msg + (result.stack ? (': ' + result.stack.substring(0, 30) + '...'):'');
                   $('.top-right').notify({
                    message: { text: message },
                    type: 'danger'
                    }).show();
                   if(!$(ev.target).attr('id')) {
              $('#sparqlEditor').attr('data-run','true');
              $('#sparqlEditor').modal();
                   } else {
                        alert ('Error')
                   $('#sparqlEditor button#consoleError').show();
                    }
                } else {
                if(result.resultSet) {
                  $('#modalLog .console-log').html('');
                 //$('#sparqlEditor button#consoleError').hide();
               //  App.resultCollection.insert(result.resultSet);
                //  $('#resultQuery').modal();
                   //alert (result.resultSet);
                    
                    
                   // console.log ("Resultado");
                  //  console.log (result.resultSet);

                     var context = {
                                "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
                                "foaf": "http://xmlns.com/foaf/0.1/",
                                "dc": "http://purl.org/dc/elements/1.1/",
                                "dcterms": "http://purl.org/dc/terms/",
                                "bibo": "http://purl.org/ontology/bibo/",
                                "uc": "http://ucuenca.edu.ec/wkhuska/resource/" ,
                                "owl" : "http://www.w3.org/2002/07/owl#"
                            };
                    
                   var resultjson = jQuery.parseJSON( result.resultSet.content);
                     console.log ("RESULTADO");
                     console.log (resultjson);
                    // console.log ("Compactcall");
                   
                     
                     if (resultjson.hasOwnProperty("@graph")) {
                        waitingDialog.hide();
                    jsonld.expand(resultjson, function(err, expanded) {
                          console.log ("Expand");                      
                          console.log (expanded);
                        //  expanded = expanded[0]; 
                            var dataresult =  expanded;


                        var num = 0;
                     
                      for (var j = 0 ; j <dataresult.length; j++){ 
                            if (dataresult[j]["@id"] == idbase && j > 0){
                                 var  aux = dataresult[0];
                                 dataresult[0] = dataresult[j];
                                 dataresult[j] = aux;
                            }else if (dataresult[j]["@type"] != "owl:Thing"){
                                 num ++;
                            }
                      }
      

                              
                           Session.set('numresultgraph', num);


                          if (num > 20){
                         
                           // confirm ("Muchos registros");
                       //     $( "#dialog-confirm" ).dialog( "open" );
                              $( "#Despl-todos").click (function () 
                              {
                                datachildren (idbase , dataresult , node , "publication" , false);
                                $( "#myModal").modal('hide');
                              });
                            
                                $( "#Despl-Muestra").click (function () 
                              {  //alert ();
                                datachildren (idbase , dataresult , node , "publication" , true);
                                $( "#myModal").modal('hide');
                              });

                            $( "#myModal").modal();

                          

                        

                          } else {
                            datachildren (idbase , dataresult , node , "publication" , false);
                          }

                        });


                  /*   jsonld.compact(resultjson , context, function(err, compacted) {
                     console.log ("Compacted");
                     console.log(JSON.stringify(compacted, null, 2)); 

                        var dataresult  = compacted['@graph'];

                        var num = 0;
                     
                      for (var j = 0 ; j <dataresult.length; j++){ 
                            if (dataresult[j]["@id"] == idbase && j > 0){
                                 var  aux = dataresult[0];
                                 dataresult[0] = dataresult[j];
                                 dataresult[j] = aux;
                            }else if (dataresult[j]["@type"] != "owl:Thing"){
                                 num ++;
                            }
                      }


                      


                          /* $( "#dialog-confirm" ).dialog({
                              resizable: true,
                              height:250,
                              autoOpen: false,
 //     width:300,
                               modal: true,
                              buttons: {
                              "Muestra": function() {
                                
                                datachildren (idbase , dataresult, node , "publication" , true);
                                $( this ).dialog( "close" );
                                 },
                                 "Todos ": function() {
                                 
                                 datachildren (idbase , dataresult , node , "publication" , false);
                                 $( this ).dialog( "close" );
                                }
                                 }
                               });
                              
                           Session.set('numresultgraph', num);


                          if (num > 20){
                         
                           // confirm ("Muchos registros");
                       //     $( "#dialog-confirm" ).dialog( "open" );
                              $( "#Despl-todos").click (function () 
                              {
                                datachildren (idbase , dataresult , node , "publication" , false);
                                $( "#myModal").modal('hide');
                              });
                            
                                $( "#Despl-Muestra").click (function () 
                              {  //alert ();
                                datachildren (idbase , dataresult , node , "publication" , true);
                                $( "#myModal").modal('hide');
                              });

                            $( "#myModal").modal();

                          

                        

                          } else {
                            datachildren (idbase , dataresult , node , "publication" , false);
                          }

                           

                   //  datachildren (idbase , compacted , node , "publication");
                      });

                          */

                     } else {
                            
                           Meteor.call('findendpointactual', idbase  , function(error, result) { 
                               console.log ("Entra findend");
                               console.log (result);
                             if (result.statusCode == 200 && result.content && endpointselect['endpoint']!=  result.endpoint["endpoint"] )
                             {    console.log ("Ahora si");
                                 
                                   endpointactual['endpoint'] = result.endpoint["endpoint"];
                                   endpointactual['graphURI'] = result.endpoint["graphURI"];

                                   console.log ("No grap");
                                  $('.top-right').notify({
                                  message: { text: 'Accediendo a nuevo endpoint: '+ endpointactual['endpoint'] },
                                  type: 'warning'
                                  }).show();

                                   console.log ("LLama de nuevo");
                                  // waitingDialog.hide();
                               
                                   Datachild (node , endpointactual , false ) ;
                             }else {
                                alert ("No es posible extraer mas datos, verifique que se encuentra registrado el endpoint");
                                waitingDialog.hide();

                             }

                           });
                           // findendpointactual ();

                     }
                 //   datachildren (idbase , result.resultSet.content , node , "publication");
                    
                   //var resultados = resultjson["results"]["bindings"];
                 //  console.log (resultjson["results"]);
               //   console.log (resultjson);
                //   console.log (resultjson.results.bindings);
                   //console.log (resultados);
                 }
                 }
          
                 });

                  
               }

               function datachildren (idbase ,jsondata , node , entityname , trial){
                 
                  //   var resultjson = jsondata;
                  // var resultjson = jQuery.parseJSON( jsondata);
                   //var dataresult = resultjson['@graph'] ;
                   var dataresult = jsondata ;
                    if (trial)
                    {   dataresult = dataresult.slice (0,10);
                        
                    }

                   console.log ("Resultadojson");
                  // console.log (resultjson);
                   console.log (dataresult);
                   //var objbase = resultjson[idbase];
                  // var dataresult =   resultjson.results.bindings ;
                   var objectnode = {};
                   var arrayprop = [];
                   var arraychild = [];

                //   var id = "http://190.15.141.66:8899/uce/contribuyente/VELASCO__MARIA_DE_LOURDES";

                     if (!node.children) {
                    node.children = []
                   }  

                   ///ordenar 
                  

                    var relations = {};

                    for (var i = 0 ; i<dataresult.length; i++){
                          var objson = dataresult[i];

                          
                    
                              

                         if (objson["@id"] == idbase   ) 
                          {
                              console.log ("Entra datos");
                              console.log (node);

                          relations = hrelations (objson);
                          console.log ("Propiedades");
                          console.log (relations);

                                       var tipo = objson['@type'];
                                             
                                            if (Array.isArray(tipo)){
                                             console.log ("Es array"); 
                                              if ( node['tipo']!= undefined && node['tipo']!= 'unknow'){

                                              for (var i = 0 ; i < tipo.length ;i++) {
                                                
                                                if (tipo[i] == node['tipo']){
                                                tipo = tipo[i];
                                                break;
                                                }
                                              }


                                              } else {  
                                                 console.log ("No tiene TIPO");    
                                                tipo = tipo[0];  }
                                            }

                                            console.log (tipo);
                              console.log ("NODO TIPO");  
                              console.log (node);
                                     
                              
                                 if ( typeof node[tipo] === 'undefined') {
                                   node[tipo] = {'data':objson , 'tipo': tipo};
                                    node['tipo']=tipo;
                                   delete node['unknow'];

                                 }else {
                                  node[tipo]['data']= objson;
                                    node['tipo']=tipo;
                                 }
                                   console.log (node);



                          /*/    if ( objson["@type"] == "foaf:Person" ){
                                 node['author']['data'] =  objson;
                             //    node ['author']['data']['Relation'] = "SameAs";
                             // node['author']['data'] = _.union( objson , node['author']['data'] );
                              }else if ( objson["@type"] == "bibo:Collection" ) {
                              // node['collection']['data'] = _.union( objson , node['collection']['data'] );
                                  node['collection']['data'] = objson;
                               //   node['collection']['data']['Relation'] = "SameAs";
                              }else if ( objson["@type"] == "bibo:Document" )  // Change
                              {
                               // node['publication']['data'] = _.union( objson , node['publication']['data'] );
                                 node['publication']['data'] =  objson;
                               //  node['publication']['data']['Relation'] =  "SameAs";
                              }*/


                               
                               if (objson.hasOwnProperty ("http://www.w3.org/2002/07/owl#sameAs")) {

                                 node = relateditems  (objson , "http://www.w3.org/2002/07/owl#sameAs" , relations , node );

                               }

                              if (objson.hasOwnProperty ("http://www.w3.org/2000/01/rdf-schema#seeAlso")) {
                                node = relateditems  (objson , "http://www.w3.org/2000/01/rdf-schema#seeAlso" , relations , node );

                               }

                               /* 
                              console.log (node);

                                if (objson.hasOwnProperty ("http://www.w3.org/2000/01/rdf-schema#seeAlso"))
                           {  
                             console.log("Si sameAs");
                              var objsame = [] ;
                           if (  Array.isArray(objson["http://www.w3.org/2000/01/rdf-schema#seeAlso"]) ) {
       
                                  objsame = objson["http://www.w3.org/2000/01/rdf-schema#seeAlso"] ;
                                  console.log ("Varios");


                           } else 
                               {
                                  objsame[0] = objson["http://www.w3.org/2000/01/rdf-schema#seeAlso"];
                                  console.log ("Solo uno");
                        
                               }
                          

                             for (var j = 0 ; j < objsame.length ;j++)
                              {  
                           var child = {};*/
                          /*  console.log ("Same as");
                            console.log ("ObjCompleto");
                            console.log (objsame);

                            console.log ("Obj1");
                            console.log (objsame[j]);*/
                           /*  console.log ("Nuevo See also");
                             console.log (objsame);
                            console.log (relations[objsame[j]["@id"]]);
                           // var typeRelation["Relation"] = "SameAs";
                           child ['@id'] =  objsame[j]["@id"]; 
                           child ["unknow"] = {'@id' : objsame[j]["@id"] , 'data' : { 'Title': {"@value":"SeeAlso" } } , children : [] , 'relation': relations[objsame[j]["@id"]] };
                          child ['tipo'] = "unknow";
                           node.children.push(child);
                          
                          // exploredArtistIds.push(objsame[j]["@id"]);
                          // console.log ("Explorados");
                           //console.log (exploredArtistIds);

                              }

                           }*/
                          /* if (objson.hasOwnProperty ("owl:sameAs"))
                           {  
                             console.log("Si sameAs");
                              var objsame = [] ;
                           if (  Array.isArray(objson["owl:sameAs"]) ) {
                               //   console.log ("Si Objeto");
                                 //  objsame[0] = objson["owl:sameAs"]["@id"];
                                  objsame = objson["owl:sameAs"] ;
                                  console.log ("Varios");


                           } else 
                               {
                                  objsame[0] = objson["owl:sameAs"];
                                  console.log ("Solo uno");
                             //  objsame = objson ;
                               }
                          
                            // console.log ("Valor");
                            //  console.log (objson);
                             for (var j = 0 ; j < objsame.length ;j++)
                              {  
                           var child = {};
                          /*  console.log ("Same as");
                            console.log ("ObjCompleto");
                            console.log (objsame);

                            console.log ("Obj1");
                            console.log (objsame[j]);

                            console.log (relations[objsame[j]["@id"]]);
                           // var typeRelation["Relation"] = "SameAs";
                           child ['@id'] =  objsame[j]["@id"]; 
                           child ["author"] = {'@id' : objsame[j]["@id"] , 'data' : { 'Relation': "SameAs" } , children : [] , 'relation': relations[objsame[j]["@id"]] };
                           node.children.push(child);
                          
                          // exploredArtistIds.push(objsame[j]["@id"]);
                          // console.log ("Explorados");
                           //console.log (exploredArtistIds);

                              }

                           }*/

                   
                       /*  for (x in objson) {
                       
                      //   console.log (x);
                        // console.log (objson[x]);
                         if (typeof(objson[x])== "object"){ 
                       //     console.log (objson[x]);
                               if (!Array.isArray(objson[x])){
                                 relations[objson[x]["@id"]] = x;
                               } else {
                                 for ( y in objson[x])
                                 {
                                   console.log (y);
                                   relations[objson[x][y]["@id"]]= x;

                                 }

                               }
                            }
                          }*/
                              
                           
                         }else 
                         { var child = {};
                           console.log ("ComienzaCHild");
                           console.log (dataresult[i]);
                           child = {'@id' : objson["@id"]};
                              var valtype = dataresult[i]['@type'];
                               var typedata = [];

                           if ( !Array.isArray(valtype) ){
                             typedata[0] = dataresult[i]['@type'];
                           } else  {
                           	 typedata = dataresult[i]['@type'];
                           }


                           _.map(typedata, function (value, idx) {
                             
                             if (idx == 0){
                            console.log("VALOR");
                            console.log(value);
                            entityname = value;
                           /*
                           if (value ==  'bibo:Collection' ) {
                            
                              entityname = 'collection';
                           } else if ( value == "foaf:Person") {
                              entityname ='author';

                           }else if ( value == "bibo:Document" )  // Change
                           {
                              entityname = 'publication';
                           }else {
                           	  entityname  =   'false';
                           } */


                            if (entityname != 'false'){

                           child [entityname] = {'@id' : objson["@id"] , 'data' : dataresult[i] , children : [] ,  'relation': relations[objson["@id"]] };
                           child ['tipo'] = entityname; 
                           node.children.push(child);
                        //   exploredArtistIds.push(objson[j]["@id"]);
                        console.log (relations[objson["@id"]]);
                          console.log ("Nuevo Child");
                          console.log (child);
                        }
                          // console.log ("Explorados");
                          // console.log (exploredArtistIds);
                             }


                        });

                          

                         
                         }

                      /*      
                       if (dataresult[i].c.type == 'literal'){
                          arrayprop.push (dataresult[i]);

                       } else
                       {
                          arraychild.push (dataresult[i]); 
                          console.log ("entidad");
                          console.log (entityname);
                          var child = {};
                          child = { '@id': dataresult[i].c.value , children : [] } ;
                          if (entityname == "author") {
                           child['author'] =  { '@id': dataresult[i].c.value } ;
                          }
                          else if (entityname == "publication")
                            {
                          child['publication'] =  { '@id': dataresult[i].c.value } ;

                          }else {

                    //      child['collection'] =  { '@id': dataresult[i].c.value } ;      
                          }
                        //  child['var'] = 's';
                        //  child[''+entityname] = {'@id': dataresult[i].c.value } ;
                          console.log (child);
                          node.children.push(child);
                          exploredPublicationsIds.push(dataresult[i].c.value);
                       }*/

                    }
                    //return objectnode = { '@id': id , properties: arrayprop , children :arraychild }
                update(node, true);
                centerNode(node);
               }

                function relateditems  (objson , clase , relations , node) {

                    if (objson.hasOwnProperty (clase))
                           {  
                             console.log("Si sameAs");
                              var objsame = [] ;
                           if (  Array.isArray(objson[clase]) ) {
       
                                  objsame = objson[clase] ;
                                  console.log ("Varios");
                           } else 
                               {
                                  objsame[0] = objson[clase];
                                  console.log ("Solo uno");
                               }
                          

                             for (var j = 0 ; j < objsame.length ;j++)
                              {  
                           var child = {};
                           
                             console.log ("Nuevo See also");
                             console.log (objsame);
                            console.log (relations[objsame[j]["@id"]]);
                           // var typeRelation["Relation"] = "SameAs";
                           child ['@id'] =  objsame[j]["@id"]; 
                           child ["unknow"] = {'@id' : objsame[j]["@id"] , 'data' : { 'Title': {"@value":"SeeAlso" } } , children : [] , 'relation': relations[objsame[j]["@id"]] };
                          child ['tipo'] = "unknow";
                         // return child;
                           node.children.push(child);
                        

                              }

                           }
                           return node;
                }

                function hrelations (objson ){
                         var relations = {};
                         for (x in objson) {
                       
                      //   console.log (x);
                        // console.log (objson[x]);
                         if (typeof(objson[x])== "object"){ 
                       //     console.log (objson[x]);
                               if (!Array.isArray(objson[x])){
                                 relations[objson[x]["@id"]] = x;
                               } else {
                                 for ( y in objson[x])
                                 {
                                 //  console.log (y);
                                   relations[objson[x][y]["@id"]]= x;

                                 }

                               }
                            }
                          }
                           return relations;

                }

               function  drawpanel (node , entityname) {

               var infoBar = $('div.tree-node-info');
               /* var model = {"dcterms:title": {label: "Title", containerType: "div"},
                    "bibo:uri": {label: "URL", containerType: "a"},
                    "dcterms:contributor": {label: "Contributor", containerType: "a"},
                    "dcterms:isPartOf": {label: "Is Part Of", containerType: "a"},
                    "dcterms:license": {label: "License", containerType: "a"},
                    "dcterms:provenance": {label: "Source", containerType: "div"}
                    "dcterms:publisher": {label: "Publisher", containerType: "div"},
                   "bibo:numPages": {label: "Pages", containerType: "div"}
                };*/
                if (infoBar) {
                    
                    //var sparqlDescribe = "DESCRIBE <" + id + ">";
                    var id;
                    //view data in infoBar
                   // var entity = _.findWhere(node.publication.data["@graph"], {"@id": id, "@type": "bibo:Document"});
                   var entity ;
                   var model = {} ; 
                   id = node["@id"];
                   console.log  ("NODO");
                   console.log  (node);
                  var tipe = node.tipo; 
                  console.log  (tipe);
                  console.log ("Modelo"); 
                  entity = node[tipe]['data'] ;

                  /* if ( Session.get ('model') ){
                     model =  Session.get ('model');
                     console.log ("Ya existe MODELO");
                     console.log (model);
                     } else { */

                  console.log ("Array Ent");
                  console.log (entity);

                  var prop = Properties.find({ endpoint: Session.get ('v2') }).fetch();
                   _.map  ( prop , function (p) {
                   if (entity [p.fullName]){
                    if (typeof entity[p.fullName][0]["@value"] == 'string'  ) {
                      console.log ("Sacar subtstring");
                      console.log (entity[p.fullName][0]["@value"]);
                      var uri = entity[p.fullName][0]["@value"].substring(0, 5).indexOf ("http");
                      console.log (entity[p.fullName][0]["@value"].substring(0, 5));
                       var labelty = "";
                     if (uri > -1){ 
                         labelty = "a";
                     } else {
                         labelty = "div";
                     }
                      model[p.fullName] = { label : relativeURI (p.fullName) , containerType: labelty };
                     }
                     }  // console.log (p);
                //  return  relativeURI ("");
                   }); 
                   console.log ("MODELO creado");
                   console.log (model);
                  // Session.set ("model", model);
                    //}
                  
                      



                   /*
                    if (entityname == 'publication') {
                      id = node.publication["@id"];
                      entity = node.publication.data ;
                        model = {"dcterms:title": {label: "Title", containerType: "div"},
                        "bibo:abstract": {label: "Abstract", containerType: "div"},
                        "dcterms:language": {label: "Language", containerType: "div"},
                        "dcterms:subject": {label: "Subject", containerType: "div"},
                        "@type": {label: "Type", containerType: "div"},
                        "bibo:uri": {label: "URL", containerType: "div"},
                        "bibo:handle": {label: "More Info", containerType: "a"},
                        "dcterms:publisher": {label: "Publisher", containerType: "div"},
                        "bibo:numPages": {label: "Pages", containerType: "div"}
                         };
                  //      "bibo:Quote": {label: "Keywords", containerType: "div"}
                         
                     } else if (entityname == 'author') {
                        id = node.author["@id"];
                        entity = node.author.data ;
                        console.log ("draw");
                        console.log (entity);
                      /* // model = {"http://xmlns.com/foaf/0.1/name": {label: "Name", containerType: "div"},
                       // "http://xmlns.com/foaf/0.1/firstName": {label: "First Name", containerType: "div"},
                      //  "http://xmlns.com/foaf/0.1/lastName": {label: "Last Name", containerType: "div"},
                     //    };
                          model = { "Relation" : {label : "Relation" , containerType: "div"} ,
                        "foaf:name": {label: "Name", containerType: "div"},
                        "foaf:firstName": {label: "First Name", containerType: "div"},
                        "foaf:lastName": {label: "Last Name", containerType: "div"},
                         };
                        
                     }else if ( entityname == 'collection') {
                        id = node.collection["@id"];
                        entity = node.collection.data ;
                        console.log ("draw");
                        console.log (entity);
                       // model = {"http://purl.org/dc/terms/description": {label: "collection", containerType: "div"},
                         model = {"dcterms:description": {label: "collection", containerType: "div"},
                      //  "http://xmlns.com/foaf/0.1/firstName": {label: "First Name", containerType: "div"},
                      //  "http://xmlns.com/foaf/0.1/lastName": {label: "Last Name", containerType: "div"},
                         };
                     }*/
                 //   infoBar.find('h4').text("Publication Info");
               //  console.log ('Info Barra');
               //  console.log (entity['http://purl.org/dc/terms/title']);
                   // infoBar.find('div#title').text("Title: " + entity['http://purl.org/dc/terms/title']);
                   infoBar.find('div#title').text("Title:  titulo");
                   // infoBar.find('a').attr('href', "http://190.15.141.85:8080/marmottatest/meta/text/html?uri=" + entity["@id"])
                   //         .text("More Info...");
                    var pubInfo = $('div.tree-node-info .entityInfo');
                    pubInfo.html('');
                    _.each(_.keys(model), function (key, idx) {
                              
                            if (entity[key]) {
                           /* if (model[key].containerType == 'a') {
                              
                              
                             
                                var values =  entity[key]["@value"]; //entity[key].length ?
                                       // _.pluck(entity[key], '@id') : [entity[key]["@id"]];
                                var div = $('<div>');
                                var label = $('<span class="label label-primary">').text(lang.lang(model[key].label));
                                div.append(label);
                                div.append("</br>");
                                
                               // _.map(values, function (value) {
                                    var anchor = $("<a target='blank'>").attr('href', values).text(values);
                                    div.append(anchor);
                                    div.append("</br>");
                                    pubInfo.append(div);
                               //     return anchor;*/
                             //   });
                           // } else { //append into a div container
                                var div = $('<div>');
                                var label = $('<span class="label label-primary">').text(lang.lang(model[key].label));
                                div.append(label);
                                div.append("</br>");
                                pubInfo.append(div);
                                var values = entity[key].length ? entity[key] : [entity[key]];
                                console.log ("VALOR");
                                console.log (values);
                                if (typeof (values) === 'string') {
                                    var span = $("<a target='blank'>").attr('href', values).text(values);
                                    div.append(span);
                                } else {
                                    _.map(values, function (value, idx) {
                                       console.log (value);
                                       if (model[key].containerType == 'a') {
                                        if (typeof (value) === 'string') {
                                                var span =  $("<a target='blank'>").attr('href', value).text(value);
                                                div.append(span);
                                                 div.append("</br>");
                                       } else {
                                        var span = $("<a target='blank'>").attr('href', value['@value']).text(value['@value']);
                                        div.append(span);
                                        div.append("</br>");}

                                       }
                                        else {
                                      if (typeof (value) === 'string') {
                                                var span = $('<span class="field-value">').text(value);
                                                div.append(span);
                                                div.append("</br>");
                                       } else {
                                        var lan = "";
                                        if (!(typeof value['@language'] === 'undefined'))
                                        {  lan = " ("+value['@language']+")" ;

                                        }
                                        var span = $('<span class="field-value">').text(value['@value']+lan);
                                        div.append(span);
                                        div.append("</br>");}
                                        }
                                    });
                                }
                            //}
                             
                      //  }
                             
                        }

                    });
                             //  var info = "More Info";
                             //  var infolink = info.link(entity[handle]);
                             //  pubInfo.append(infolink);
                }


               }

            
               
             //  }

            update(root, true);
            centerNode(root);
      };

    
