/*
    View logic for the dashboard component
 */
this.DashboardView = Backbone.View.extend({
  graph: null,
  paper: null,
  graphScale: 1,
  cellViewRight: null,
  template: null,
  tagName: "div",
  id: "dashboard",

  //////////
  //unused//
  //////////
  events: {
    'click button': 'newEndpoint'
  },

  /////////////////////////
  //Endpoint Registration//
  /////////////////////////
  newEndpoint: function(e) {
    $("#newEndpoint button[type='submit']").attr('disabled','')
    $('#newEndpoint #loadingEndpoint img').show();
    var id = $('#newEndpoint #new-endpoint-identifier').val();
    var endpoint = $('#newEndpoint #new-endpoint').val();
    var graphURI = $('#newEndpoint #new-endpoint-graph').val();
    var description = $('#newEndpoint #new-endpoint-desc').val();
    var colorId = $('#newEndpoint #new-endpoint-color').val();
    var base = $('#newEndpoint #new-endpoint-base')[0].checked;
    //console.log('click en register' + id+endpoint+graphURI+description);
    e.preventDefault();
    Meteor.call('getEndpointStructure', id, endpoint, graphURI, description, colorId, base, function (error, result) {
      if(error) {
        $('#newEndpoint #loadingEndpoint img').hide();
        $('.top-right').notify({
              message: { text: "Error" },
              type: 'danger'
        }).show();

      } else {
        if(result.statusCode != 200) {
          $('#newEndpoint #loadingEndpoint img').hide();
          $('.top-right').notify({
                message: { text: result.msg },
                type: 'danger'
          }).show();
        } else {
          var counter = 0;
          for(var x in result) {
            counter++;
          }
          $('#newEndpoint').find('button.close[data-dismiss=modal]').click();
          e.currentTarget.reset();
          $('#newEndpoint #loadingEndpoint img').hide();
          $('.top-right').notify({
                message: { text: "Endpoint Registered Successful" },
                type: 'success'
          }).show();

        }
      }
      $("#newEndpoint button[type='submit']").removeAttr('disabled');
    });
  },

  /////////////////////////
  // View Initialization //
  /////////////////////////
  initialize: function(id) {
    var me;
    me = this;
    //jsonGraph =_.pluck(querie, 'jsonGraph');
    Session.set('graphQuery', id.idSample); 
    /*Session.set('querieTitle', _.pluck(querie, 'title')); 
    Session.set('querieDescription', _.pluck(querie, 'description')); */
    Session.set('endpointEdit', []);
    Tracker.autorun(function(){
      //var endpoints = Endpoints.find({status: 'A'},{fields:{endpoint: 1, graphURI: 1}}).fetch();
      var endpoints = Endpoints.find({status: 'A'}, {sort: {base: -1}}).fetch();
      if(endpoints.length > 0) {
        Session.set('endpoints', endpoints);  
      } else {
        Session.set('endpoints', []);  
      }
      console.log("Endpoints Disponibles: " + endpoints.length);
    });

    /////////////////////////
    //  Init Joint Shapes  //
    /////////////////////////
    joint.shapes.html = {};
    joint.shapes.html.Element = joint.shapes.basic.Rect.extend({  
      markup: ['<g class="rotatable">',
                  '<g class="scalable">',
                      //'<g class="prefix">',
                      //    '<text class"prefix-text"/>',
                      //</g>',
                      '<rect/>',
                      //'<g class="link-tools tool-remove">',
                      '<g class="link-tools-element" event="remove">',
                          '<circle r="5" transform="translate(0)"/>',
                          '<path transform="scale(.4) translate(0, 2)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z"/>',
                          '<title>Remove entity.</title>',
                      '</g>',
                  '</g>',
                  '<text class="subject-name"/>',
              '</g>'].join(''),
          
      defaults: joint.util.deepSupplement({
          type: 'html.Element',
          attrs: {
              circle: {cx: 7, cy: 8, fill: '#FF3D3D'},
              rect: { fill: '#2C3E50', rx: '5', ry: '5', 'stroke-width': 2, stroke: 'black' },
              text: {
                text: 'my label', fill: '#FFFFFF',
                'font-size': 14, 'font-weight': 'bold', 'font-variant': 'small-caps', 'text-transform': 'capitalize', 'text-shadow': '1px 1px 1px lightgray'
              }
          }
      }, joint.shapes.basic.Rect.prototype.defaults)
    });
    
    joint.shapes.html.ElementView = joint.dia.ElementView.extend({
      initialize: function() {
          _.bindAll(this, 'updateBox');
          _.bindAll(this, 'removeBox');
          joint.dia.ElementView.prototype.initialize.apply(this, arguments);
          //this.$box = $(_.template(this.template)());
          this.$el.on('click', this.removeBox);
          this.model.on('change', this.updateBox, this);
          // Remove the box when the model gets removed from the graph.
          this.model.on('remove', this.removeBox, this);
          this.updateBox();
      },
      showDeleteButton: function(evt) {
          console.log('entro');
      },
      render: function() {
          joint.dia.ElementView.prototype.render.apply(this, arguments);
          //this.paper.$el.prepend(this.$box);
          this.updateBox();
          return this;
      },
      updateBox: function() {
          // Set the position and dimension of the box so that it covers the JointJS element.
          this.$el.attr('text/text',this.model.get('label'));
          var bbox = this.model.getBBox();
          
          // Example of updating the HTML with a data stored in the cell model.
          //this.$box.find('span').text(this.model.get('input'));
          
          //this.$box.css({ width: bbox.width, height: bbox.height, left: bbox.x, top: bbox.y, transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)' });
      },
      removeBox: function(evt) {
          
          if(evt.target && (evt.target.tagName === 'circle' || evt.target.tagName === 'path')){
              this.model.remove();
              this.remove();
          }
          //this.$box.remove();
      }
    });

  },

  /////////////////////////
  //     Init Utils      //
  /////////////////////////
  renderUtils: function() {
    var fedQueryUtils = function(graph) {
      this.graphBoard = graph;
      this.initOffset = -200;
      this.nodeInsertionOffset = 0;

      this.getnodeInsertionOffset = function() {
        this.nodeInsertionOffset += 120;
        return this.initOffset = this.initOffset + this.nodeInsertionOffset;
      }

      this.allowDrop = function (ev) {
          ev.preventDefault();
      };
      /////////////////////////
      //    Drag the node    //
      /////////////////////////
      this.dragNode = function(ev) {
        ev.dataTransfer.setData("class", ev.target.getAttribute('class'));
        ev.dataTransfer.setData("endpoint", ev.target.getAttribute('data-endpoint'));
        ev.dataTransfer.setData("graphURI", ev.target.getAttribute('data-graphuri'));
        ev.dataTransfer.setData("subject", ev.target.getAttribute('data-entity'));
        ev.dataTransfer.setData("color", ev.target.getAttribute('data-colorid'));
        ev.dataTransfer.setData("predicate", ev.target.getAttribute('data-property'));
        ev.dataTransfer.setData("predicatePrefix", ev.target.getAttribute('data-prefix'));
        ev.dataTransfer.setData("propertyLabel", ev.target.getAttribute('data-label'));
        ev.dataTransfer.setData("raw", ev.target.getAttribute('data-raw'));

        //how to get data from specific property
        //var predicate = ev.target.getAttribute('data-property');
        //var predicateDef = _.find(a.properties, function(obj){return obj.fullName == predicate});
         
      };
      this.allowDrop = function (ev) {
          ev.preventDefault();
      };
      /////////////////////////////
      //Droping the node on Board//
      /////////////////////////////
      this.onDropEv = function(ev) {
        ev.preventDefault();    
        // just for example
        var OFFSET = $('#paper').offset();
        var x = ev.pageX - OFFSET.left;
        var y = ev.pageY - OFFSET.top;   
        var endpointList = Session.get('endpoints'); 
        var nodeClass = ev.dataTransfer.getData('class');
        var endpoint = ev.dataTransfer.getData('endpoint');
        endpoint = endpoint == '' && endpointList.length > 0 ? endpointList[0].endpoint:endpoint; //if rawNode
        var graphURI = ev.dataTransfer.getData('graphURI'); 
        graphURI = graphURI == '' && endpointList.length > 0 ? endpointList[0].graphURI:graphURI; //if rawNode
        var subject = ev.dataTransfer.getData('subject');
        var predicate = ev.dataTransfer.getData('predicate');
        var color = ev.dataTransfer.getData('color');
        var predicate = ev.dataTransfer.getData('predicate');
        var predicatePrefix = ev.dataTransfer.getData('predicatePrefix');
        var property = ev.dataTransfer.getData('propertyLabel');
        var rawNode = ev.dataTransfer.getData('raw');

        var label = nodeClass == 'entity' ? property:'?'+property;

        var rect = new joint.shapes.html.Element({ 
          position: { x: x, y: y }, size: { width: 100, height: 40 }, 
          attrs: { rect: {fill: color}, text: { text: label }},
        });
        rect.attr('text/text-decoration','underline');
        rect.attr('text/label',label);
        rect.attr('text/resultSet',1);
        rect.attr('text/regex',0);
        rect.set('endpoint', endpoint);
        rect.set('graphuri', graphURI);
        rect.set('subject', subject);
        rect.set('predicate', predicate);
        rect.set('rawNode', rawNode != "null");
        
        

        this.graphBoard.addCells([rect]);
      
      };


    this.showMenu = function(control, e) {
              var posx = e.pageX + 'px';//e.clientX + window.pageXOffset +'px'; //Left Position of Mouse Pointer
              var posy = e.pageY + 'px';//e.clientY + window.pageYOffset + 'px'; //Top Position of Mouse Pointer
              document.getElementById(control).style.position = 'absolute';
              document.getElementById(control).style.display = 'inline';
              document.getElementById(control).style.left = posx;
              document.getElementById(control).style.top = posy; 
          //document.getElementById(control).style.background = 'white';
          /*document.getElementById("resultSet").click(
            alert('change ResultSet');
          );  */
      };

      this.hideMenu = function(control) {
              document.getElementById(control).style.display = 'none'; 
      };

      ///////////////////////////////////
      //New Link Instance between nodes//
      ///////////////////////////////////
      this.createLink = function(elementBelow, cellView, nodeLabel) {
        var link = new joint.dia.Link({
                  source: { id: elementBelow.id },
                  target: { id: cellView.model.id }
                  
        });

        link.attr({
          '.connection': { stroke: 'black' , 'stroke-width': '2'},
          //'.marker-source': { fill: 'red', d: 'M 10 0 L 0 5 L 10 10 z' }, //flecha
          '.marker-target': { fill: 'black', d: 'M 10 0 L 0 5 L 10 10 z' } //flecha
        });

        link.label(0, {position: 0.5, attrs: {text: {text: nodeLabel } } })
         
        //link.set('vertices', [{ x: 300, y: 60 }, { x: 400, y: 60 }, { x: 400, y: 20 }]);
        link.set('connector', { name: 'smooth' });
        //link.set('smooth', true);

        App.dashboard.graph.addCells([link]);
        
        // Move the element a bit to the side.
        //var offset = this.getnodeInsertionOffset();
        //cellView.model.translate(offset, 100);
        cellView.model.translate(200);
        /*$('.top-right').notify({
          message: { text: "Match sucess" },
          type: 'success'
        }).show();*/
      };

      /**
      *endpointProperties 
      *elementBelow source node
      *cellView node requesting the link
      */
      this.linkNodes = function(endpointProperties, elementBelow, cellView) {
        var predicate = cellView.model.get('predicate');
        var isRaw = cellView.model.get('rawNode');
        if(isRaw) {
          if(cellView.model.get('subject') == 'null') {
            var nodeLabel = predicate.length > 0 ? predicate:'?p';
            App.fedQueryUtils.createLink(elementBelow, cellView, nodeLabel);
          } else { //It's entity node
            $('.top-right').notify({
              message: { text: "Match not allowed" },
              type: 'danger'
            }).show();
          }
          return isRaw;
        }
        if(!endpointProperties) { //parent node is raw
          var targetEndpoint = cellView.model.get('endpoint')+'|'+cellView.model.get('graphuri');;
          endpointProperties = Session.get(targetEndpoint);
          

        }
        
        var predicateDef = _.find(endpointProperties.properties, function(obj){return obj.fullName == predicate});
        
        var subjectSource = elementBelow.attributes.subject;
        var isCompatible;
        //subject as source node. Validate from predicates
        if(predicateDef) {


          if(subjectSource && subjectSource != 'null') {
            isCompatible = _.find(predicateDef.subjects, function(obj){return obj.fullName == subjectSource});
          } else { //predicate as source node. Validate from subjects
            //var subjectType = _.find(predicateDef.subjects, function(obj){return obj.fullName == subjectSource});
            _.each(predicateDef.subjects, function(subject, idx) {
              var subjectType = subject.fullName;
            
            //var predicateValidation = elementBelow.attributes.predicate;
            //var subjectValidation = cellView.model.attributes.subject;
            var availableProperties = _.filter(endpointProperties.properties, 
              function(obj){
                return _.find(obj.subjects, function(ob){
                  //return ob.fullName == subjectValidation;
                  return ob.fullName == subjectType;
                })
              }
            );
            //isCompatible = _.find(availableProperties, function(obj){return obj.fullName == predicateValidation;});
            isCompatible = _.find(availableProperties, function(obj){return obj.fullName == cellView.model.attributes.predicate;});
            if(isCompatible) return;
            });
          }

          if(isCompatible) {
            var nodeLabel = predicateDef.prefix+':'+predicateDef.name;
            App.fedQueryUtils.createLink(elementBelow, cellView, nodeLabel);
          }else{
             cellView.model.translate(0,50); 
             $('.top-right').notify({
              message: { text: "Match not allowed" },
              type: 'danger'
              }).show();
          }   
        } else { //predicate not defined in source Endpoint
          cellView.model.translate(0,50); 
             $('.top-right').notify({
              message: { text: "Match not allowed: Predicate type not bound to Subject source" },
              type: 'danger'
            }).show();

        }
        return isCompatible;
      };

      /**
      * Parse graph to SPARQL query
      * endpoint Endpoint ID
      * queryNodes Query Graph nodes
      * _entityType Triple subject
      * _entityField Triple subject field label
      * entityObjcs Child link nodes for current node
      * linkNodes Link nodes on the dashboard
      * _whereClause Current where clause
      */
      this.parseChilds = function(endpoint, queryNodes, _entityType, _entityField, entityObjcs, linkNodes, _whereClause) {
          var endpointList = Session.get('endpoints');
          //entity child nodes
          _.each(entityObjcs, function(link) {
            var childNode = _.find(queryNodes, function(node){ return node.id == link.target.id });
            var _cid = childNode.id;
            var _cstype = childNode.subject;
            var _cptype = childNode.predicate;
            var rawNode = childNode.rawNode;
            var endpointObj = _.find(endpointList, function(obj){return obj.endpoint+'|'+obj.graphURI == childNode.endpoint+'|'+childNode.graphuri});
            var endpointIdprefix = rawNode ? 'rawNode':endpointObj.name;
            var _cfield = (childNode.attrs.text.text == childNode.attrs.text.label ? //no value specified
            childNode.attrs.text.text:childNode.attrs.text.label) + '_' + endpointIdprefix;
            var _cfieldValue = childNode.attrs.text.text;
            var applyRegexFilter = childNode.attrs.text.regex == '1';
            //value starts with question mark (?) and its predicate
            if(_cfieldValue.match('^[?]') && _cptype != 'null') {
              _whereClause += "\n" + _entityField 
                            + ' ' + (_cptype == '' ? link.labels[0].attrs.text.text + '_rawNode':'<' + _cptype + '>') + ' ' 
                            + _cfield + ' .';
            } else { //node value specified
              if(applyRegexFilter) {
                _whereClause += "\n" + _entityField
                              + ' ' + (_cptype == '' ? link.labels[0].attrs.text.text + '_rawNode':'<' + _cptype + '>') + ' ' 
                              + _cfield + ' .';
                _whereClause += "\n" + 'FILTER REGEX(' + _cfield +  ', "' + _cfieldValue +'") .';
              } else {
                var endpointGraph =Session.get(endpoint);
                var property = rawNode ? undefined:_.find(endpointGraph.properties,function(obj){return obj.fullName == _cptype});
                var propertySubject = rawNode ? undefined:_.find(property.subjects, function(obj){return obj.fullName == _entityType});
                var index = rawNode ? undefined:_.indexOf(property.subjects, propertySubject);
                var dataType = rawNode ? '':property.objectTypes[index].dataType; //rawNode case waiting for development
                _whereClause += rawNode ? ("\n" + _entityField
                                          + ' ' + (_cptype == '' ? link.labels[0].attrs.text.text + '_rawNode':'<' + _cptype + '>') + ' ' 
                                          + (_cfieldValue.match('^http')?'<'+_cfieldValue+'>':'"'+_cfieldValue+'"') 
                                          + ' .')
                                : "\n" + _entityField + ' <' + _cptype + '> "' + _cfieldValue + (dataType == null ? '" .':'"^^<' + dataType + '> .');
              }
            }
            var childObjcs = _.filter(linkNodes, function(obj){return obj.source.id == _cid});
            if(childObjcs.length > 0) {
              var endpointGraph =Session.get(endpoint);
              var property = _.find(endpointGraph.properties,function(obj){return obj.fullName == _cptype});
              var propertySubject = _.find(property.subjects, function(obj){return obj.fullName == _entityType});
              var index = _.indexOf(property.subjects, propertySubject);
              var objectType = property.objectTypes[index].objectEntity.fullName;
              //recursive function
              _whereClause = App.fedQueryUtils.parseChilds(endpoint, queryNodes, objectType, _cfield, childObjcs, linkNodes, _whereClause);
            }

          });
          return _whereClause;
      };

      /**
      * parse endpoint fields
      * endpoint Endpoint the parser is evaluating
      * queryNodes: Nodes involved in the query
      * linkNodes Links involved in the query
      * childsId Child nodes ids for the entity currently evaluated 
      * fields Current endpoint array of fields
      */
      this.parseQueryFields = function(endpoint, queryNodes, linkNodes, childsId, fields) {
        
          _.each(childsId, function(childId) {
            var subfields = _.filter(linkNodes, function(obj){return obj.source.id == childId});
            if(subfields.length > 0) {
                var subfieldsId = _.pluck( _.pluck(subfields, 'target') ,'id' );
                fields = App.fedQueryUtils.parseQueryFields(endpoint, queryNodes, linkNodes, subfieldsId, fields);
            } else {
              var childNode = _.find(queryNodes, function(obj){return obj.id == childId});
              if(childNode.attrs.text.resultSet == '1' && childNode.attrs.text.text == childNode.attrs.text.label) { //if field has to be shown on result
                var endpointList = Session.get('endpoints');
                var endpointObj = _.find(endpointList, function(obj){return obj.endpoint+'|'+obj.graphURI == childNode.endpoint+'|'+childNode.graphuri});
                if(childNode.rawNode) {
                  var predicate = _.find(linkNodes, function(obj){return obj.target.id == childId});
                  if(predicate.labels[0].attrs.text.text.match('^[?]')) {//predicate as variable
                    fields.push(predicate.labels[0].attrs.text.text + '_rawNode');    
                  }
                  fields.push(childNode.attrs.text.text + '_rawNode');  
                }
                //includes fields belonging to the current endpoint
                else if(endpoint == endpointObj.endpoint+'|'+endpointObj.graphURI) {
                  fields.push(childNode.attrs.text.text + '_' + endpointObj.name);  
                }
              }
            }
            
          });
          return fields;
      };

      ///////////////////////////////////
      //////// Node to SPARQL Parser/////
      ///////////////////////////////////
      this.graphToSPARQL = function(warning) {
        var result = undefined;
        if (App.dashboard.graph.toJSON().cells.length == 0) {
          $('.top-right').notify({
            message: { text: "The Query Graph must have at least 1 triple" },
            type: warning?'warning':'danger'
            }).show();
        } else {
          var jsonQuery = App.dashboard.graph.toJSON();
          var queryNodes = _.filter(jsonQuery.cells,function(obj){return obj.type=='html.Element'});
          var rootNode = queryNodes[0];
          var linkNodes = _.filter(jsonQuery.cells,function(obj){return obj.type=='link'});
          var endpoints = Session.get('endpoints');
          var queryCount = 0;
          var queryList = []; 
          if(rootNode.endpoint == '') {
            var endpointBase = endpoints[0];
            rootNode.endpoint = endpointBase.endpoint;
            rootNode.graphuri = endpointBase.graphURI; 
          }
          _.each(endpoints, function(objEndpoint) {
            var fields = [];
            var triples = [];
            var endpoint = objEndpoint.endpoint + '|' + objEndpoint.graphURI;
            var endpointNodes = _.filter(queryNodes, function(node){return node.endpoint+'|'+node.graphuri == endpoint;});
            var entities = _.filter(endpointNodes, function(node){return node.subject != 'null';});
            //var query = squel.select().from('<'+objEndpoint.graphURI+'>');
            if(endpointNodes.length > 0) {
              var query = {endpoint: '<'+objEndpoint.endpoint+'>', graphURI: '<'+objEndpoint.graphURI+'>', base: objEndpoint.base};          
              query.fields = [];
              query.from = '<'+objEndpoint.graphURI+'>';
              query.where = [];
              //var query = 'select ';
              var _whereClause = "";
              //nodes with subject value
              _.each(entities, function(obj) {
                var _id = obj.id;
                var _type = obj.subject;
                var _entityField = (obj.rawNode ? '':'?') + obj.attrs.text.text;
                //query.field(_entityField);
                _entityField += '_' + objEndpoint.name;
                fields.push(_entityField);
                _whereClause += obj.rawNode ? '':_whereClause + "\n" + _entityField + ' a <' + _type + '> .';
                var entityObjcs = _.filter(linkNodes, function(obj){return obj.source.id == _id});

                //get fields
                var childsId =_.pluck( _.pluck(entityObjcs, 'target') ,'id' );
                fields = App.fedQueryUtils.parseQueryFields(endpoint, queryNodes, linkNodes, childsId, fields);
                query.fields = _.union(query.fields, fields);
                //var strfields = fields.toString().replace(/,/g, ' ');
                //query.field(strfields);
                //query += strfields + ' from <'+objEndpoint.graphURI+'> ';
                
                

                ////////////
                
                //get conditions
                _whereClause = App.fedQueryUtils.parseChilds(endpoint, queryNodes, _type, _entityField, entityObjcs, linkNodes, _whereClause);
                query.where.push(_whereClause);
                //query.where(_whereClause);
                //query += 'where {' + _whereClause + '}';
                ////////////////
              });
              queryList[queryCount++] = query;
            }
          });
          var globalVars = _.pluck(queryList, 'fields').toString().replace(/,/g, ' ');
          var stringSPARQL = 'SELECT ' + globalVars + ' \nFROM ' + queryList[0].from + ' WHERE {' + queryList[0].where.toString().replace(/[.],/g, '\n');
          for(var i=1; i<queryList.length; i++) {
            var queryEndpoint = queryList[i];
            /*var queryService = '\nSERVICE ' + queryEndpoint.endpoint + '{\nSELECT ' + queryEndpoint.fields.toString().replace(/,/g, ' ')
                                            + ' \nFROM ' + queryEndpoint.graphURI + '{';*/
            var queryService = '\nSERVICE ' + queryEndpoint.endpoint + '{\nSELECT ' + queryEndpoint.fields.toString().replace(/,/g, ' ') + ' {';

            for(var o=0; o<queryEndpoint.where.length; o++) {
              queryService += queryEndpoint.where[o];
            }
            queryService += '}\n}'
            stringSPARQL += '\n' + queryService;
          }
          stringSPARQL += '\n}';
          result = stringSPARQL;
        }
        //console.log(result);
        return result;
      };
    }
    App.fedQueryUtils = new fedQueryUtils(this.graph);

  },
  
  //////////////////////////////////
  // CLear dashboard for New query//
  //////////////////////////////////
  clearDashboard: function(e){
    App.dashboard.graph.clear();
    $('div #saveQuery').removeAttr('disabled');
    $('div #graph-title').val('');
    $('div #graph-description').val('');
    $('.top-right').notify({
      message: { text: "Clear Dashboard" },
      type: 'success'
    }).show();
  },
  
  ///////////////////////////
  //zoom In the paper graph//
  ///////////////////////////
  zoomIn: function(e) {
    App.dashboard.graphScale += 0.1;
    App.dashboard.paper.scale(App.dashboard.graphScale, App.dashboard.graphScale);
    App.dashboard.paper.setDimensions(parseInt($('.paper').width() * App.dashboard.graphScale , 10), 
      parseInt(App.dashboard.paper.options.height * App.dashboard.graphScale,10));
    console.log('paper+dimension' + App.dashboard.paper.options.width + "heigh " + App.dashboard.paper.options.height);
  },
  
  ///////////////////////////
  //zoom Out the paper graph//
  ///////////////////////////
  zoomOut: function(e) {
    App.dashboard.graphScale -= 0.1;
    if(App.dashboard.graphScale>=0.1){
      App.dashboard.paper.scale(App.dashboard.graphScale, App.dashboard.graphScale);
      App.dashboard.paper.setDimensions(parseInt(App.dashboard.paper.options.width * App.dashboard.graphScale , 10), 
        parseInt(App.dashboard.paper.options.height * App.dashboard.graphScale,10));
      console.log('paper-dimension' + App.dashboard.paper.options.width + "heigh " + App.dashboard.paper.options.height + " scale" + App.dashboard.graphScale);
    }
  },
  
  ////////////////////////
  //e.data -> this.graph//
  ////////////////////////
  openGraph: function(e) {
    var jsonstring = '{"cells":[{"type":"html.Element","position":{"x":60,"y":50},"size":{"width":100,"height":40},"id":"630b11e8-dd63-45f6-b78c-d6ef599ef7ea","predicate":"null","endpoint":"1","data":"Tesis","z":5,"attrs":{"rect":{"fill":"blue"},"text":{"text":"Tesis"}}},{"type":"html.Element","position":{"x":60,"y":190},"size":{"width":100,"height":40},"id":"bd8d50bb-b63f-40f3-8e1e-80a4b2156115","predicate":"ths","endpoint":"1","data":"?director","z":6,"attrs":{"rect":{"fill":"blue"},"text":{"text":"?director"}}},{"type":"link","source":{"id":"bd8d50bb-b63f-40f3-8e1e-80a4b2156115"},"target":{"id":"630b11e8-dd63-45f6-b78c-d6ef599ef7ea"},"id":"e6d54def-7e57-43f8-9558-ba0f27952cd9","labels":[{"position":0.5,"attrs":{"text":{"text":"ths"}}}],"smooth":true,"z":7,"attrs":{".connection":{"stroke":"black","stroke-width":"2"}}},{"type":"html.Element","position":{"x":340,"y":220},"size":{"width":100,"height":40},"id":"fb6e8078-6be1-482c-9ff6-5bc9accd1210","predicate":"foaf:lastName","endpoint":"1","data":"?lastName","z":8,"attrs":{"rect":{"fill":"blue"},"text":{"text":"Ortiz Segarra"}}},{"type":"link","source":{"id":"fb6e8078-6be1-482c-9ff6-5bc9accd1210"},"target":{"id":"bd8d50bb-b63f-40f3-8e1e-80a4b2156115"},"id":"22eccf8e-22f3-4c27-96f5-268122ca928f","labels":[{"position":0.5,"attrs":{"text":{"text":"foaf:lastName"}}}],"smooth":true,"z":9,"attrs":{".connection":{"stroke":"black","stroke-width":"2"}}},{"type":"html.Element","position":{"x":350,"y":20},"size":{"width":100,"height":40},"id":"bac365f2-229e-4bd8-a4aa-587f3e0aef40","predicate":"title","endpoint":"1","data":"?title","z":10,"attrs":{"rect":{"fill":"blue"},"text":{"text":"?titleTesis"}}},{"type":"link","source":{"id":"bac365f2-229e-4bd8-a4aa-587f3e0aef40"},"target":{"id":"630b11e8-dd63-45f6-b78c-d6ef599ef7ea"},"id":"d1b71a79-c97c-4e96-ab9e-7dd37afd6132","labels":[{"position":0.5,"attrs":{"text":{"text":"title"}}}],"smooth":true,"z":11,"attrs":{".connection":{"stroke":"black","stroke-width":"2"}}},{"type":"html.Element","position":{"x":60,"y":390},"size":{"width":100,"height":40},"id":"e3f1fe35-d916-4ea7-ac0c-fff720386377","predicate":"null","endpoint":"1","data":"Article","z":12,"attrs":{"rect":{"fill":"red"},"text":{"text":"Article"}}},{"type":"html.Element","position":{"x":60,"y":280},"size":{"width":100,"height":40},"id":"d3633ce1-7a71-49bb-93a9-1421effcabac","predicate":"aut","endpoint":"1","data":"?aut","z":13,"attrs":{"rect":{"fill":"red"},"text":{"text":"?aut"}}},{"type":"link","source":{"id":"d3633ce1-7a71-49bb-93a9-1421effcabac"},"target":{"id":"e3f1fe35-d916-4ea7-ac0c-fff720386377"},"id":"f2c5301b-fc26-43bd-98a0-212c7ad1d5e1","labels":[{"position":0.5,"attrs":{"text":{"text":"aut"}}}],"smooth":true,"z":14,"attrs":{".connection":{"stroke":"black","stroke-width":"2"}}},{"type":"html.Element","position":{"x":350,"y":430},"size":{"width":100,"height":40},"id":"6c62590d-0018-4efe-9eb3-f0fe71c98e0b","predicate":"title","endpoint":"1","data":"?title","z":15,"attrs":{"rect":{"fill":"red"},"text":{"text":"?title"}}},{"type":"link","source":{"id":"6c62590d-0018-4efe-9eb3-f0fe71c98e0b"},"target":{"id":"e3f1fe35-d916-4ea7-ac0c-fff720386377"},"id":"caaee3f7-c43a-49be-ac1b-01531188cc11","labels":[{"position":0.5,"attrs":{"text":{"text":"title"}}}],"smooth":true,"z":16,"attrs":{".connection":{"stroke":"black","stroke-width":"2"}}},{"type":"link","source":{"id":"fb6e8078-6be1-482c-9ff6-5bc9accd1210"},"target":{"id":"d3633ce1-7a71-49bb-93a9-1421effcabac"},"id":"b777d4c9-4a1d-4145-906d-6b3c3995fada","labels":[{"position":0.5,"attrs":{"text":{"text":"foaf:lastName"}}}],"smooth":true,"z":17,"attrs":{".connection":{"stroke":"black","stroke-width":"2"}}}]}';
    jsonstring = '{"cells":[{"type":"html.Element","position":{"x":260,"y":50},"size":{"width":100,"height":40},"angle":0,"id":"a0c7456c-d8fc-4053-91b3-1efe91d2a256","endpoint":"http://190.15.141.102:8890/sparql","graphuri":"http://dspace.ucuenca.edu.ec/resource/","subject":"http://purl.org/ontology/bibo/Thesis","predicate":"null","z":1,"attrs":{"rect":{"fill":"#6d419d"},"text":{"text":"Thesis","text-decoration":"underline","label":"Thesis","resultSet":1,"regex":0}}},{"type":"html.Element","position":{"x":280,"y":190},"size":{"width":100,"height":40},"angle":0,"id":"99eab531-ca7b-4d8c-befa-1a572617a1d0","endpoint":"http://190.15.141.102:8890/sparql","graphuri":"http://dspace.ucuenca.edu.ec/resource/","subject":"null","predicate":"http://id.loc.gov/vocabulary/relators/ths","z":2,"attrs":{"rect":{"fill":"#6d419d"},"text":{"text":"?ths","text-decoration":"underline","label":"?ths","resultSet":1,"regex":0}}},{"type":"link","source":{"id":"a0c7456c-d8fc-4053-91b3-1efe91d2a256"},"target":{"id":"99eab531-ca7b-4d8c-befa-1a572617a1d0"},"id":"8fcb7c4e-5dc0-4e78-9931-8d9b2db3bde8","labels":[{"position":0.5,"attrs":{"text":{"text":"marcrel:ths"}}}],"connector":{"name":"smooth"},"z":3,"attrs":{".connection":{"stroke":"black","stroke-width":"2"},".marker-target":{"fill":"black","d":"M 10 0 L 0 5 L 10 10 z"}}},{"type":"html.Element","position":{"x":470,"y":50},"size":{"width":100,"height":40},"angle":0,"id":"1a624643-fc35-46fe-b018-366b5410929a","endpoint":"http://190.15.141.102:8890/sparql","graphuri":"http://dspace.ucuenca.edu.ec/resource/","subject":"null","predicate":"http://purl.org/dc/terms/title","z":4,"attrs":{"rect":{"fill":"#6d419d"},"text":{"text":"?title","text-decoration":"underline","label":"?title","resultSet":1,"regex":0}}},{"type":"link","source":{"id":"a0c7456c-d8fc-4053-91b3-1efe91d2a256"},"target":{"id":"1a624643-fc35-46fe-b018-366b5410929a"},"id":"8ee0a375-cb6e-4002-ab13-2badbeb6aaf8","labels":[{"position":0.5,"attrs":{"text":{"text":"dcterms:title"}}}],"connector":{"name":"smooth"},"z":5,"attrs":{".connection":{"stroke":"black","stroke-width":"2"},".marker-target":{"fill":"black","d":"M 10 0 L 0 5 L 10 10 z"}}},{"type":"html.Element","position":{"x":650,"y":260},"size":{"width":100,"height":40},"angle":0,"id":"92950559-6d60-4b28-ba01-0fb7dd5e4cb6","endpoint":"http://190.15.141.102:8890/sparql","graphuri":"http://dspace.ucuenca.edu.ec/resource/","subject":"null","predicate":"http://xmlns.com/foaf/0.1/name","z":6,"attrs":{"rect":{"fill":"#6d419d"},"text":{"text":"?name","text-decoration":"underline","label":"?name","resultSet":1,"regex":0}}},{"type":"link","source":{"id":"99eab531-ca7b-4d8c-befa-1a572617a1d0"},"target":{"id":"92950559-6d60-4b28-ba01-0fb7dd5e4cb6"},"id":"b7c5356c-7319-46ab-8e29-6015dff278a9","labels":[{"position":0.5,"attrs":{"text":{"text":"foaf:name"}}}],"connector":{"name":"smooth"},"z":7,"attrs":{".connection":{"stroke":"black","stroke-width":"2"},".marker-target":{"fill":"black","d":"M 10 0 L 0 5 L 10 10 z"}}},{"type":"html.Element","position":{"x":250,"y":380},"size":{"width":100,"height":40},"angle":0,"id":"d0a94036-0a1d-4a38-a3b8-6ca1190ac050","endpoint":"http://190.15.141.66:8890/sparql","graphuri":"http://repositorio.cedia.org.ec/resources/","subject":"http://purl.org/ontology/bibo/Article","predicate":"null","z":8,"attrs":{"rect":{"fill":"#e7d90f"},"text":{"text":"Article","text-decoration":"underline","label":"Article","resultSet":1,"regex":0}}},{"type":"html.Element","position":{"x":370,"y":300},"size":{"width":100,"height":40},"angle":0,"id":"a6b41f22-e612-426a-878d-d7e632ca9512","endpoint":"http://190.15.141.66:8890/sparql","graphuri":"http://repositorio.cedia.org.ec/resources/","subject":"null","predicate":"http://id.loc.gov/vocabulary/relators/aut","z":9,"attrs":{"rect":{"fill":"#e7d90f"},"text":{"text":"?aut","text-decoration":"underline","label":"?aut","resultSet":1,"regex":0}}},{"type":"link","source":{"id":"d0a94036-0a1d-4a38-a3b8-6ca1190ac050"},"target":{"id":"a6b41f22-e612-426a-878d-d7e632ca9512"},"id":"dbb33cb3-e74b-410b-8220-b5579135152c","labels":[{"position":0.5,"attrs":{"text":{"text":"marcrel:aut"}}}],"connector":{"name":"smooth"},"z":10,"attrs":{".connection":{"stroke":"black","stroke-width":"2"},".marker-target":{"fill":"black","d":"M 10 0 L 0 5 L 10 10 z"}}},{"type":"link","source":{"id":"a6b41f22-e612-426a-878d-d7e632ca9512"},"target":{"id":"92950559-6d60-4b28-ba01-0fb7dd5e4cb6"},"id":"7e166e49-89d7-4145-b1f4-cd8a1ebb0e87","labels":[{"position":0.5,"attrs":{"text":{"text":"foaf:name"}}}],"connector":{"name":"smooth"},"z":11,"attrs":{".connection":{"stroke":"black","stroke-width":"2"},".marker-target":{"fill":"black","d":"M 10 0 L 0 5 L 10 10 z"}}},{"type":"html.Element","position":{"x":470,"y":390},"size":{"width":100,"height":40},"angle":0,"id":"bb518607-ae0c-4e19-9fce-c529a19125ca","endpoint":"http://190.15.141.66:8890/sparql","graphuri":"http://repositorio.cedia.org.ec/resources/","subject":"null","predicate":"http://purl.org/dc/terms/title","z":12,"attrs":{"rect":{"fill":"#e7d90f"},"text":{"text":"?title","text-decoration":"underline","label":"?title","resultSet":1,"regex":0}}},{"type":"link","source":{"id":"d0a94036-0a1d-4a38-a3b8-6ca1190ac050"},"target":{"id":"bb518607-ae0c-4e19-9fce-c529a19125ca"},"id":"c05c3a9b-c39f-4651-9884-15606a276f1c","labels":[{"position":0.5,"attrs":{"text":{"text":"dcterms:title"}}}],"connector":{"name":"smooth"},"z":13,"attrs":{".connection":{"stroke":"black","stroke-width":"2"},".marker-target":{"fill":"black","d":"M 10 0 L 0 5 L 10 10 z"}}}]}';
    //example with raw nodes
    //jsonstring = '{"cells":[{"type":"html.Element","position":{"x":280,"y":10},"size":{"width":100,"height":40},"angle":0,"id":"664a8764-c2d3-4658-a527-f0232cbb1b84","endpoint":"","graphuri":"","subject":"","predicate":"null","rawNode":true,"z":1,"attrs":{"rect":{"fill":"#428bca"},"text":{"text":"?s","text-decoration":"underline","label":"?s","resultSet":1,"regex":0}}},{"type":"html.Element","position":{"x":80,"y":70},"size":{"width":100,"height":40},"angle":0,"id":"fe3a1e1f-9cb9-465c-912a-89b8e119ee62","endpoint":"http://190.15.141.66:8890/sparql","graphuri":"http://repositorio.cedia.org.ec/resource/","subject":"null","predicate":"http://purl.org/dc/terms/title","rawNode":false,"z":2,"attrs":{"rect":{"fill":"#a6d4e8"},"text":{"text":"?title","text-decoration":"underline","label":"?title","resultSet":1,"regex":0}}},{"type":"link","source":{"id":"664a8764-c2d3-4658-a527-f0232cbb1b84"},"target":{"id":"fe3a1e1f-9cb9-465c-912a-89b8e119ee62"},"id":"081300fc-785e-4b71-8736-d3824fbc950e","labels":[{"position":0.5,"attrs":{"text":{"text":"dcterms:title"}}}],"connector":{"name":"smooth"},"z":3,"attrs":{".connection":{"stroke":"black","stroke-width":"2"},".marker-target":{"fill":"black","d":"M 10 0 L 0 5 L 10 10 z"}}},{"type":"html.Element","position":{"x":570,"y":90},"size":{"width":100,"height":40},"angle":0,"id":"508ad7d2-d569-4e41-8a1e-7dd75fa40e93","endpoint":"http://190.15.141.66:8890/sparql","graphuri":"http://repositorio.cedia.org.ec/resource/","subject":"null","predicate":"http://purl.org/dc/terms/subject","rawNode":true,"z":4,"attrs":{"rect":{"fill":"#428bca"},"text":{"text":"GAD","text-decoration":"underline","label":"?o","resultSet":1,"regex":0}}},{"type":"link","source":{"id":"664a8764-c2d3-4658-a527-f0232cbb1b84"},"target":{"id":"508ad7d2-d569-4e41-8a1e-7dd75fa40e93"},"id":"a3736832-7b05-4d8b-af67-1fbd4d22cd4b","labels":[{"position":0.5,"attrs":{"text":{"text":"<http://purl.org/dc/terms/subject>"}}}],"connector":{"name":"smooth"},"z":5,"attrs":{".connection":{"stroke":"black","stroke-width":"2"},".marker-target":{"fill":"black","d":"M 10 0 L 0 5 L 10 10 z"}}},{"type":"html.Element","position":{"x":343.671875,"y":191},"size":{"width":100,"height":40},"angle":0,"id":"47c6646c-f559-45cc-a032-8eb348c5b61c","endpoint":"http://190.15.141.102:8890/sparql","graphuri":"http://dspace.ucuenca.edu.ec/resource/","subject":"http://purl.org/ontology/bibo/Thesis","predicate":"null","rawNode":false,"z":6,"attrs":{"rect":{"fill":"#416849"},"text":{"text":"Thesis","text-decoration":"underline","label":"Thesis","resultSet":1,"regex":0}}},{"type":"link","source":{"id":"47c6646c-f559-45cc-a032-8eb348c5b61c"},"target":{"id":"508ad7d2-d569-4e41-8a1e-7dd75fa40e93"},"id":"c02aae17-c9de-45a7-b62b-d22262e23881","labels":[{"position":0.5,"attrs":{"text":{"text":"http://purl.org/dc/terms/subject"}}}],"connector":{"name":"smooth"},"z":7,"vertices":[],"attrs":{".connection":{"stroke":"black","stroke-width":"2"},".marker-target":{"fill":"black","d":"M 10 0 L 0 5 L 10 10 z"}}},{"type":"html.Element","position":{"x":90,"y":140},"size":{"width":100,"height":40},"angle":0,"id":"6f5d249a-e975-4ff1-bd2c-93bd9d8224ab","endpoint":"http://190.15.141.102:8890/sparql","graphuri":"http://dspace.ucuenca.edu.ec/resource/","subject":"null","predicate":"http://purl.org/dc/terms/title","rawNode":false,"z":8,"attrs":{"rect":{"fill":"#416849"},"text":{"text":"?title","text-decoration":"underline","label":"?title","resultSet":1,"regex":0}}},{"type":"link","source":{"id":"47c6646c-f559-45cc-a032-8eb348c5b61c"},"target":{"id":"6f5d249a-e975-4ff1-bd2c-93bd9d8224ab"},"id":"95c4c2d0-e2d1-454e-a708-e36863ec5d97","labels":[{"position":0.5,"attrs":{"text":{"text":"dcterms:title"}}}],"connector":{"name":"smooth"},"z":9,"attrs":{".connection":{"stroke":"black","stroke-width":"2"},".marker-target":{"fill":"black","d":"M 10 0 L 0 5 L 10 10 z"}}}]}';
    e.data.fromJSON(JSON.parse(jsonstring));
  },

  ///////////////////////////////////////////////
  //Establish node var as part of the resultset//
  ///////////////////////////////////////////////
  changeResultSet: function(){

    if (cellViewRight) {
         // The context menu was brought up when clicking a cell view in the paper.
         if(cellViewRight.model.attr('text/text-decoration') == "underline"){
          cellViewRight.model.attr('text/text-decoration','none');
          cellViewRight.model.attr('text/resultSet',0);
          $('.top-right').notify({
            message: { text: cellViewRight.model.attr('text/text') +' not considered as part of the ResultSet' },
            type: 'warning'
            }).show(); 
         }else{
          cellViewRight.model.attr('text/text-decoration','underline');
          cellViewRight.model.attr('text/resultSet',1);
          $('.top-right').notify({
            message: { text: cellViewRight.model.attr('text/text')+' considered as part of the ResultSet' },
            }).show();
         }
    }
    App.fedQueryUtils.hideMenu('contextMenu');
  },

  //////////////////////////
  //Render Dashboard Views//
  //////////////////////////
  render: function() {
    Blaze.render(Template.dashboard, $('#sparql-content')[0]);
    this.graph = new joint.dia.Graph;
    this.paper = new joint.dia.Paper({ el: $('#paper'), width: $('#paper').width(), height: $('#paper').height(), gridSize: 10, model: this.graph });
    App.dashboard = {graph: this.graph, paper: this.paper, graphScale: this.graphScale, defaultColor: '#428bca'};
    this.renderUtils(this.graph);
    this.setEvents($('#sparql-content'));

    Tracker.autorun(function() {
      var queryId = Session.get('graphQuery');
      var query = Queries.findOne({_id: queryId});
      if(query) {
        $('#graph-title').val(query.title);
        $('#graph-description').val(query.description);
        App.dashboard.graph.fromJSON(JSON.parse(query.jsonGraph));
        App.dashboard.sparqlEditor.setValue(query.sparql);
        $('#saveQuery').prop('disabled', true);
      }
    });
    return this;
  },

  /////////////////////////////
  //set Dashboard View Events//
  /////////////////////////////
  setEvents: function(divNode) {

    App.dashboard.sparqlEditor = CodeMirror.fromTextArea($('#sparqlEditor #code')[0], {
        mode: "application/x-sparql-query",
        matchBrackets: true,
        lineNumbers: true,
        smartIndent: true,
        electricChars: true
    });

    divNode.find('#newEndpoint').on('show.bs.modal', function(e){
      var colorId = '#'+Math.floor(Math.random()*16777215).toString(16);
      var endpointEdit = Session.get('endpointEdit');
      if(endpointEdit.length > 0) {
        $('#newEndpoint #new-endpoint').val(endpointEdit[0].endpoint);
        $('#newEndpoint #new-endpoint-graph').val(endpointEdit[0].graphURI);
        $('#newEndpoint #new-endpoint-color').val(endpointEdit[0].colorid);
        $('#newEndpoint #new-endpoint-identifier').val(endpointEdit[0].name);
        $('#newEndpoint #new-endpoint-desc').val(endpointEdit[0].description);
        $('#newEndpoint #new-endpoint-base')[0].checked=endpointEdit[0].base;
        divNode.find('#new-endpoint-base')[0].disabled=true;
        Session.set('endpointEdit',[]);
      }else{
        var endpoints = Session.get('endpoints');
        if(endpoints && endpoints.length > 0) {
          //colorId = '#'+Math.floor(Math.random()*16777215).toString(16);
          divNode.find('#new-endpoint-base')[0].disabled=false;
        } else {
          //colorId = App.dashboard.defaultColor;
          divNode.find('#new-endpoint-base')[0].checked=true;
          divNode.find('#new-endpoint-base')[0].disabled=true;
        }
        divNode.find('#newEndpoint #new-endpoint-color').val(colorId);
      }
    });

    divNode.find('#sparqlEditor').on('show.bs.modal', function(e) {
      var sparql = App.fedQueryUtils.graphToSPARQL('warning');
      if(sparql) {
        App.dashboard.sparqlEditor.setValue(sparql);
      }
      //App.dashboard.sparqlEditor.refresh();
    });

    divNode.find('#sparqlEditor').on('shown.bs.modal', function(e) {
      App.dashboard.sparqlEditor.refresh();
    });

    divNode.find('#newEndpoint').on('hide.bs.modal', function(ev) {
        $('#newEndpoint #new-endpoint').val('');
        $('#newEndpoint #new-endpoint-graph').val('');
        $('#newEndpoint #new-endpoint-color').val('');
        $('#newEndpoint #new-endpoint-identifier').val('');
        $('#newEndpoint #new-endpoint-desc').val('');
        $('#newEndpoint #new-endpoint-base').disable=false;
        $('#newEndpoint #new-endpoint-base').checked=false;
        Session.set('endpointEdit',[]);
    });

    //////////////////////////////////
    //Update base endpoint from list//
    //////////////////////////////////
    divNode.find('#availableEndpoint').on('show.bs.modal', function(e) {
      $('#availableEndpoint input:radio').on('click', function(ev){
        var endpoint = $(ev.currentTarget).attr('data-endpoint');
        var graphURI = $(ev.currentTarget).attr('data-graphuri');
        Meteor.call('updateBaseEndpoint', endpoint, graphURI, function(error, result){
          console.log('base changed');
          //non-implemented
        });
      });  
    });

    divNode.find('#availableEndpoint').on('hide.bs.modal', function(e) {
      $('#availableEndpoint input:radio').unbind('click');
    });
    /*divNode.find('#availableEndpoint .base-endpoint').on('click', function(ev) {
      console.log('entra');*/
      /*var endpoint = $(ev.currentTarget).attr('data-endpoint');
      var graphURI = $(ev.currentTarget).attr('data-graphuri');
      Meteor.call('updateBaseEndpoint', endpoint, graphURI, function(error, result){
        console.log('base changed');
        //non-implemented
      });*/
    //});

    divNode.find('#resultQuery').on('hide.bs.modal', function(ev) {
      App.resultCollection.remove({});
    });
    
    divNode.find('#newEndpoint #new-endpoint-form').submit(this.newEndpoint);
    $("div.navbar #open").on('click', this.graph, this.openGraph);
    $("div.navbar #zoom-out").on('click', this.zoomOut);
    $("div.navbar #zoom-in").on('click', this.zoomIn);
    $("div.navbar #clear").on('click', this.clearDashboard);
    $("#changeResultSet").on('click', this.changeResultSet);

    /////////////
    //Run Query//
    /////////////
    $('button.runQuery').on('click', function(ev) {
      //if id user is running sparql query from sentence editor
      var sparql = $(ev.target).attr('id') ? App.dashboard.sparqlEditor.getValue():App.fedQueryUtils.graphToSPARQL();
      if(sparql && sparql.length > 0) {
        var jsonRequest = {"sparql": sparql};
        Meteor.call('doQuery', jsonRequest, function(error, result) {
          if(result.statusCode != 200) {
            console.log(result.stack);
            var message = result.msg + (result.stack ? (': ' + result.stack.substring(0, 30) + '...'):'');
            $('.top-right').notify({
              message: { text: message },
              type: 'danger'
            }).show();
          }
          if(result.resultSet) {
            App.resultCollection.insert(result.resultSet);
            $('#resultQuery').modal();
          }
          
        });
      }

    });

    //////////////////
    //Save the query//
    //////////////////
    $('div #saveQuery').on('click', function(ev){
      var request = {};
      request.title = $('div #graph-title').val();
      request.description = $('div #graph-description').val();
      request.jsonQuery = App.dashboard.graph.toJSON();
      var errorMessage = "";
      //at least one triple
      errorMessage = request.jsonQuery.cells.length == 0 ? "The Query Graph must have at least 1 triple":"";
      errorMessage = request.title == null || request.title == "" ? "Title is required":errorMessage;
      var sparql;
      try {
        request.sparql = App.fedQueryUtils.graphToSPARQL();
      }catch(e) {
        errorMessage = e.toString();
      }
      if (errorMessage.length > 0) {
        $('.top-right').notify({
          message: { text: errorMessage },
          type: 'danger'
          }).show();
      } else {
        var result = Meteor.call('saveQuery', request, function(error, result) {
          $('div #saveQuery').attr('disabled','true');
          $('.top-right').notify({
            message: { text: result.statusCode == 200 ?"Query saved Successful":result.msg },
            type: result.statusCode == 200 ?'success':'danger'
          }).show();
        });
        
      }
    });


    //Control the offset on paper while creating new nodes
    this.graph.on('change:position', function(cell) {
      //Al cambiar la posicion se debe controlar que el elemento no se salga del area de trabajo

      //AL llegar al limite superior o al limite izquierdo regresamos el elemento a la misma posicion
      if(cell.get('position').x<0 || cell.get('position').y<0 ){
        cell.set('position', cell.previous('position'));
      }
      
      //Si llega al limite inferior cambiamos el tamano del area de trabajo
      var yy = App.dashboard.paper.options.height-50;
      if(cell.get('position').y >= yy){
        App.dashboard.paper.setDimensions(parseInt(App.dashboard.paper.options.width , 10), parseInt(App.dashboard.paper.options.height + 50,10));
      }
      
      //Comparamos la posicion con el limite derecho y agrandamos el area de trabajo
      var xx = App.dashboard.paper.options.width-100;
      if(cell.get('position').x >= xx){
        App.dashboard.paper.setDimensions(parseInt(App.dashboard.paper.options.width + 150 , 10), parseInt(App.dashboard.paper.options.height,10));
      }
    });

    ///////////////////////////////////
    //new Link instance between Nodes//
    ///////////////////////////////////
    this.paper.on('cell:pointerup', function(cellView, evt, x, y) {

        // Find the first element below that is not a link nor the dragged element itself.
        var elementBelow = App.dashboard.graph.get('cells').find(function(cell) {
          if (cell instanceof joint.dia.Link) return false; // Not interested in links.
          if (cell.id === cellView.model.id) return false; // The same element as the dropped one.
          if (cell.getBBox().containsPoint(g.point(x, y))) {
            return true;
          }
          return false;
        });
        
        // If the two elements are connected already, don't
        // connect them again (this is application specific though).
        if (elementBelow && !_.contains(App.dashboard.graph.getNeighbors(elementBelow), cellView.model)) {

          //Get predicate information from Session
          var sourceEndpoint = elementBelow.attributes.endpoint + '|' + elementBelow.attributes.graphuri;
          var targetEndpoint = cellView.model.get('endpoint') + '|' + cellView.model.get('graphuri');
          
          var sourceEndpointProperties = Session.get(sourceEndpoint);
          var targetEndpointProperties = Session.get(targetEndpoint);

          App.fedQueryUtils.linkNodes(sourceEndpointProperties, elementBelow, cellView);
          
        }
    });

    ///////////////////////////////////////////
    ///////Submit raw node value edition///////
    //delegate functionality to hide.bs.modal//
    ///////////////////////////////////////////
    $('div #rawnodeform').submit(function(ev) {
      ev.preventDefault();
      $('div #rawnodeValue').find('button.close[data-dismiss=modal]').click();
    });

    ////////////////////////////////////////
    //Opening modal for node value edition//
    ////////////////////////////////////////
    this.paper.on('cell:pointerdblclick', function(cellView, evt, x, y) { 
      //if(cellView.model.get('predicate') != 'null') {
        var rawNode = cellView.model.attributes.rawNode;
        if(rawNode) {
          
          $('div #rawnodeValue').on('show.bs.modal', function(e){
            var cellViewModel = App.dashboard.graph.getCell(cellView.model.id);
            var endpointValue = $('#rawnodeValue select option:first').val(); // set endpoint base as default value
            if(cellViewModel.attributes.endpoint != '') { 
              var endpoint = Endpoints.findOne({endpoint: cellViewModel.attributes.endpoint, graphURI: cellViewModel.attributes.graphuri });
              endpointValue = endpoint ? endpoint.name:endpointValue;
            }
            $('#rawnodeValue select').val(endpointValue); 
            $('div #rawnodeValue #rawnode-uri').val('');
            $('div #rawnodeValue #rawnode-value').val('');
            document.getElementById("rawnode-checkRegex").checked = false;


            if(cellViewModel.attributes.subject != "null") { //entity raw node
              //$('div #rawnodeValue #rawnode-value').removeAttr('required');
              if(cellViewModel.attributes.subject == '') {
                $('div #rawnodeValue #rawnode-uri').attr('placeholder','Entity URI');
                $('div #rawnodeValue .rawnode-group').hide();
                $('div #rawnodeValue .checkbox').hide();
              } else  {
                $('div #rawnodeValue #rawnode-uri').val(cellViewModel.attributes.subject);
                $('div #rawnodeValue .rawnode-group').hide();
                $('div #rawnodeValue .checkbox').hide();
              }
            }
            if(cellViewModel.attributes.predicate != "null") { //property raw node
              //$('div #rawnodeValue #rawnode-value').attr('required','');
              if(cellViewModel.attributes.predicate == '') {
                $('div #rawnodeValue #rawnode-uri').attr('placeholder','Predicate URI');
                $('div #rawnodeValue .rawnode-group').show();
                $('div #rawnodeValue .checkbox').show();
              } else {
                $('div #rawnodeValue #rawnode-uri').val(cellViewModel.attributes.predicate);
                $('div #rawnodeValue .rawnode-group').show();
                $('div #rawnodeValue .checkbox').show();
                $('div #rawnodeValue #rawnode-value').val(cellViewModel.attr('text/text'));
                var regex = cellViewModel.attr('text/regex');
                var checkbox = document.getElementById("rawnode-checkRegex");
                checkbox.checked = regex == 1;
              }
            }
            $('div #rawnodeValue').unbind('show.bs.modal');
          });

          $('div #rawnodeValue').on('hide.bs.modal', function(ev) {
            var cellViewModel = App.dashboard.graph.getCell(cellView.model.id);
            cellViewModel.attributes.endpoint = $('#rawnodeValue select option:selected').attr('data-endpoint');
            cellViewModel.attributes.graphuri = $('#rawnodeValue select option:selected').attr('data-graphuri');
            if(cellViewModel.attributes.subject != "null") { //entity raw node
              cellViewModel.attributes.subject = $('div #rawnodeValue #rawnode-uri').val();
              //cellViewModel.attr('text/text','Entity X');
            } 
            if(cellViewModel.attributes.predicate != "null") {
              cellViewModel.attributes.predicate = $('div #rawnodeValue #rawnode-uri').val();
              var jsonGraph = App.dashboard.graph.toJSON();
              var linkNodes = _.filter(jsonGraph.cells,function(obj){return obj.type=='link'});
              var link = _.find(linkNodes, function(obj){return obj.target.id == cellViewModel.id});
              if(link) {
                App.dashboard.graph.getCell(link.id).label(0,{attrs:{text: {text: '<' + $('div #rawnodeValue #rawnode-uri').val() + '>'}}});
              }
              var checkbox = document.getElementById("rawnode-checkRegex");
              cellViewModel.attr('text/regex', checkbox.checked?1:0);
              var objectValue = $('div #rawnodeValue #rawnode-value').val();
              if( objectValue.length > 0 ) {
                cellViewModel.attr('text/text', objectValue );
              }
            }
            $('div #rawnodeValue').unbind('hide.bs.modal');
          });
          $('div #rawnodeValue').modal();

        } else { //normal node

          var label = cellView.model.attr('text/text');
          $('div #nodeValue #node-value').val(label.match('^[?]')?'':label);
          $('div #nodeValue').on('show.bs.modal', function(e){
              var regex = cellView.model.attr('text/regex');
              var checkbox = document.getElementById("checkRegex");
              if(regex == 1) {
                checkbox.checked = true;
              }else {
                checkbox.checked = false;
              }
              //document.getElementById("checkRegex").checked = 'checked';            
          });
          $('div #nodeValue').on('hide.bs.modal', function(ev) {
            //en el SAVE 
            var checkbox = document.getElementById("checkRegex");
            if(checkbox.checked) {
               cellView.model.attr('text/regex', 1);
              }
              else {
               cellView.model.attr('text/regex', 0);
              }  
             //SAVE   
            if( $('div #nodeValue #node-value').val().length > 0 ) {
              cellView.model.attr('text/text', $('div #nodeValue #node-value').val() );
              $('div #nodeValue').unbind('hide.bs.modal');
            }
          });
          $('div #nodeValue').modal();
        }
      /*}else {
          $('.top-right').notify({
            message: { text: "Not is posible change text to entities" },
            type: 'danger'
            }).show();
          }*/
      
    });

    this.paper.on('blank:pointerclick', function(evt, x, y) { 
      App.fedQueryUtils.hideMenu('contextMenu');
    });

    //Funcion que controla el click derecho
    this.paper.$el.on('contextmenu', function(evt) { 
      evt.stopPropagation(); // Stop bubbling so that the paper does not handle mousedown.
      evt.preventDefault();  // Prevent displaying default browser context menu.
      cellViewRight = App.dashboard.paper.findView(evt.target);
      if (cellViewRight) {
      // The context menu was brought up when clicking a cell view in the paper.
        console.log(cellViewRight.model.id); // So now you have access to both the cell view and its model.
      // ... display custom context menu, ...
      }
      //cellViewRight = this.paper.findView(evt.target);
      App.fedQueryUtils.showMenu('contextMenu',evt);
      //console.log(cellViewRight.model.id+ " click right");  // So now you have access to both the cell view and its model.*/
    });

    ////////////////////////////////
    //////// RESIZE ///////////////
    ///////////////////////////////
    
    this.graph.on("change:attrs", _.bind(function (cell, attrs, opt) {
    if (cell.previousAttributes().attrs.text && attrs.text) {
        if (cell.previousAttributes().attrs.text.text != attrs.text.text) { //test if label changed
            var view = this.paper.findViewByModel(cell),
                text = view.$("text"); //get shape element

            if (text.length > 0) {
                if (!cell.get("originalSize")) cell.set("originalSize", cell.get("size")); //store original/default size

                var originalSize = cell.get("originalSize"),
                    position = cell.get("position"),
                    size = cell.get("size"),

                    newX = position.x,
                    newY = position.y,
                    newCornerX = position.x + originalSize.width,
                    newCornerY = position.y + originalSize.height,
                    bbox = text[0].getClientRects()[0], //text box dimensions
                    paddingX = 5, // horz padding for label
                    paddingY = 5, // vert padding for label
                    isResize;

                if (bbox.width + (paddingX * 2) >= originalSize.width) {
                    newX -= (bbox.width - originalSize.width + (paddingX * 2)) / 2;
                    newCornerX = newX + bbox.width + (paddingX * 2);
                    isResize = true;
                } else if (size.width != originalSize.width) { //if text is smaller than original box size
                    newX += (size.width - originalSize.width) / 2;
                    newCornerX = newX + originalSize.width;
                    isResize = true;
                }

                if (bbox.height + (paddingY * 2) >= originalSize.height) {
                    newY -= (bbox.height - originalSize.height + (paddingY * 2)) / 2;
                    newCornerY = newY + bbox.height + (paddingY * 2);
                    isResize = true;
                } else if (size.height != originalSize.height) { //if text is smaller than original box size
                    newY += (size.height - originalSize.height) / 2;
                    newCornerY = newY + originalSize.height;
                    isResize = true;
                }

                if (isResize) {
                    cell.set({
                        position: { x: newX, y: newY },
                        size: { width: newCornerX - newX, height: newCornerY - newY }
                    });
                }
            }
        }
    }
}, this));

    /////////////////////////
    // EDIT ENDPOINT ////////
    /////////////////////////
  editEndpoint=function (e) {
    var endpointId = $(e.currentTarget).attr('data-endpoint-id');
    var endpoint = Endpoints.find({_id: endpointId}).fetch();
    Session.set('endpointEdit', endpoint);
    $('div #newEndpoint').modal();
    
  };

  deleteEndpoint=function (e) {
    var endpointId = $(e.currentTarget).attr('data-endpoint-id');
    var endpointURI = $(e.currentTarget).attr('data-endpoint');
    var graphURI = $(e.currentTarget).attr('data-graphuri');
    $('#dialogConfirm #okDelete').attr('data-endpointId', endpointId);
    $('#dialogConfirm #okDelete').attr('data-endpointURI', endpointURI);
    $('#dialogConfirm #okDelete').attr('data-graphURI', graphURI);
    $('div #dialogConfirm').modal();
  };

  confirmEndpointDelete = function(ev) {
    console.log('entra delete');
    var endpointId = $('#dialogConfirm #okDelete').attr('data-endpointId');
    var endpointURI = $('#dialogConfirm #okDelete').attr('data-endpointURI');
    var graphURI = $('#dialogConfirm #okDelete').attr('data-graphURI');
    Meteor.call('deleteEndpoint', endpointId, endpointURI, graphURI, function(error, result) {
      if(!error){
        $('.top-right').notify({
            message: { text: "Endpoint delete Successful" },
            type: 'success'
        }).show();
      }
    });

  };
}

});
