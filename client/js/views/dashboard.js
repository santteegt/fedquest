/*
    View logic for the dashboard component
 */
this.DashboardView = Backbone.View.extend({
  graph: null,
  paper: null,
  graphScale: 1,
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
    
    var id = $('#newEndpoint #new-endpoint-identifier').val();
    var endpoint = $('#newEndpoint #new-endpoint').val();
    var graphURI = $('#newEndpoint #new-endpoint-graph').val();
    var description = $('#newEndpoint #new-endpoint-desc').val();
    //console.log('click en register' + id+endpoint+graphURI+description);
    e.preventDefault();
    Meteor.call('getEndpointStructure', id, endpoint, graphURI, description, function (error, result) {
        $('#newEndpoint').find('button.close[data-dismiss=modal]').click();
        if(result) {
          console.log(result);
          var counter = 0;
          for(var x in result) {
            counter++;
          }
          console.log(counter);
          console.log(Endpoints.find({}).fetch());
          //console.log('Grafos ==>' + Graphs.findOne());
        }else {
          console.log(error);  
        }
        
      });
  },

  /////////////////////////
  // View Initialization //
  /////////////////////////
  initialize: function() {
    var me;
    me = this;
    Tracker.autorun(function(){
      //var endpoints = Endpoints.find({status: 'A'},{fields:{endpoint: 1, graphURI: 1}}).fetch();
      var endpoints = Endpoints.find({status: 'A'}).fetch();
      if(endpoints.length > 0) {
        Session.set('endpoints', endpoints);  
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
        
        var nodeClass = ev.dataTransfer.getData('class');
        var endpoint = ev.dataTransfer.getData('endpoint');
        var graphURI = ev.dataTransfer.getData('graphURI'); 
        var subject = ev.dataTransfer.getData('subject');
        var predicate = ev.dataTransfer.getData('predicate');
        var color = ev.dataTransfer.getData('color');
        var predicate = ev.dataTransfer.getData('predicate');
        var predicatePrefix = ev.dataTransfer.getData('predicatePrefix');
        var property = ev.dataTransfer.getData('propertyLabel');

        var label = nodeClass == 'entity' ? property:'?'+property;

        var rect = new joint.shapes.html.Element({ 
          position: { x: x, y: y }, size: { width: 100, height: 40 }, 
          attrs: { rect: {fill: color}, text: { text: label }},
        });
        rect.set('endpoint', endpoint);
        rect.set('graphuri', graphURI);
        rect.set('subject', subject);
        rect.set('predicate', predicate);
        
        

        this.graphBoard.addCells([rect]);
      
      };

      ///////////////////////////////////
      //New Link Instance between nodes//
      ///////////////////////////////////
      this.linkNodes = function(endpointProperties, elementBelow, cellView) {
        var predicate = cellView.model.get('predicate');
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
                
              var link = new joint.dia.Link({
                  source: { id: elementBelow.id },
                  target: { id: cellView.model.id }
                  
              });

              link.attr({
                '.connection': { stroke: 'black' , 'stroke-width': '2'},
                //'.marker-source': { fill: 'red', d: 'M 10 0 L 0 5 L 10 10 z' }, //flecha
                '.marker-target': { fill: 'black', d: 'M 10 0 L 0 5 L 10 10 z' } //flecha
              });

              link.label(0, {position: 0.5, attrs: {text: {text: predicateDef.prefix+':'+predicateDef.name } } })
               
              //link.set('vertices', [{ x: 300, y: 60 }, { x: 400, y: 60 }, { x: 400, y: 20 }]);
              link.set('connector', { name: 'smooth' });
              //link.set('smooth', true);

              App.dashboard.graph.addCells([link]);
              
              // Move the element a bit to the side.
              //var offset = this.getnodeInsertionOffset();
              //cellView.model.translate(offset, 100);
              cellView.model.translate(200);
            }
          }
          return isCompatible;
      };
    }
    App.fedQueryUtils = new fedQueryUtils(this.graph);

  },

  editQuery: function(e) {
    
    
    $('div #sparqlEditor').on('show.bs.modal', function(e){
        console.log('modalEdit open event');
          var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
          mode: "application/x-sparql-query",
          matchBrackets: true
          }); 
      });
    $('div #sparqlEditor').modal();
    /*
    var viewEdit = new SparqlEditorView();
      
      
       var modalEdit = new Backbone.BootstrapModal({
        animate: true,
        content: viewEdit
      });
      
      modalEdit.open();
      
      modalEdit.on('shown',function(){
        console.log('modalEdit open event');
        var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
          mode: "application/x-sparql-query",
          matchBrackets: true
          }); 
      });*/
      
      //modalEdit.on('ok', function() {
        //cellView.model.attr('text/text', $("#filtro").val());
        //alert('ok');
      //});
  },
  
  ejecutar: function(e){
    var aux= graph.toJSON();
      var f=".marker-target";
      var count = 0;
      for(item in aux.cells) {
        console.log('variable ' + aux.cells[count].attrs);
        if(aux.cells.hasOwnProperty(item)) {
        count++;
        }
        delete aux.cells[count-1].angle;
      }
      console.log('leght ' + count);
      
      console.log('despues ' + JSON.stringify(aux) );
       var m = JSON.stringify(aux);
       alert('ToJson:' + m);
  },
  
  save: function($el){
    
    var svg = paper.svg;
    //var uri = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svg)));
      var serializer = new XMLSerializer();
      var svgXML = serializer.serializeToString(svg);
    console.log('save');
    //convert svg source to URI data scheme.
    var url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svgXML);

    //set url value to a element's href attribute.
    document.getElementById("save").href = url;
    //you can download svg file by right click menu.
    //var canvas = paper.svg[0];
    //saveSvgAsPng(canvas, 'test.png');
    
    //var image = new Image;
    //image.src = svgXML;
    //var image = new Image();
    //image.src = uri;
    //saveSvgAsPng(paper.svg, 'test.png',1);
    //console.log(svgXML);
    //var image = new Image();
    //image.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svgXML);
    //saveAs(image.src, "Dashboard.png"); 
    /*window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder ||
                     window.MozBlobBuilder || window.MSBlobBuilder;
    window.URL = window.URL || window.webkitURL;

    var bb = new BlobBuilder();
    //var svg = $('#designpanel').svg('get');
    bb.append(svgXML);
    var blob = bb.getBlob("application/svg+xml;charset=" + svg.characterSet);
    saveAs(blob,"name.svg");
    //img_PNG = Canvas2Image.saveAsPNG(svg);*/
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
    e.data.fromJSON(JSON.parse(jsonstring));
  },

  //////////////////////////
  //Render Dashboard Views//
  //////////////////////////
  render: function() {
    Blaze.render(Template.dashboard, $('#sparql-content')[0]);
    this.graph = new joint.dia.Graph;
    this.paper = new joint.dia.Paper({ el: $('#paper'), width: $('#paper').width(), height: $('#paper').height(), gridSize: 10, model: this.graph });
    this.setEvents($('#sparql-content'));
    this.renderUtils(this.graph);
    App.dashboard = {graph: this.graph, paper: this.paper, graphScale: this.graphScale};
    //this.$el.html(this.template);
    return this;
  },

  /////////////////////////////
  //set Dashboard View Events//
  /////////////////////////////
  setEvents: function(divNode) {

    divNode.find('#newEndpoint #new-endpoint-form').submit(this.newEndpoint);
    $("div.navbar #editQuery").on('click', this.editQuery);
    $("div.navbar #open").on('click', this.graph, this.openGraph);
    $("div.navbar #zoom-out").on('click', this.zoomOut);
    $("div.navbar #zoom-in").on('click', this.zoomIn);

    /////////////
    //Run Query//
    /////////////
    $('div #runQuery').on('click', function(ev){
      var jsonQuery = App.dashboard.graph.toJSON();
      var queryNodes = _.filter(jsonQuery.cells,function(obj){return obj.type=='html.Element'});
      var linkNodes = _.filter(jsonQuery.cells,function(obj){return obj.type=='link'});
      var endpoints = Session.get('endpoints');
      _.each(endpoints, function(obj){
        var endpoint = obj.endpoint + '|' + obj.graphURI;
        var endpointNodes = _.filter(queryNodes, function(node){return node.endpoint+'|'+node.graphuri == endpoint;});
        var entities = _.filter(endpointNodes, function(node){return node.subject != 'null';});
        

      });

      
      jsonQuery.cells.length;
      var a = _.filter(jsonQuery.cells, function(obj){return obj.type=='html.Element'});
      Meteor.call('doQuery', jsonQuery, function(error, result){

      });
    });

    //////////////////
    //Save the query//
    //////////////////
    $('div #saveQuery').on('click', function(ev){
      var request = {};
      request.title = $('div #graph-title').val();
      request.description = $('div #graph-description').val();
      request.jsonQuery = App.dashboard.graph.toJSON();
      var result = Meteor.call('saveQuery', request);
      console.log(result);
    });


    //Control the offset on paper while creating new nodes
    this.graph.on('change:position', function(cell) {
      //Al cambiar la posicion se debe controlar que el elemento no se salga del area de trabajo

      //AL llegar al limite superior o al limite izquierdo regresamos el elemento a la misma posicion
      if(cell.get('position').x<0 || cell.get('position').y<0 ){
        cell.set('position', cell.previous('position'));
      }
      
      //Si llega al limite inferior cambiamos el tamano del area de trabajo
      if(cell.get('position').y >= App.dashboard.paper.options.height){
        this.paper.setDimensions(parseInt(App.dashboard.paper.options.width , 10), parseInt(App.dashboard.paper.options.height + 100,10));
      }
      
      //Comparamos la posicion con el limite derecho y agrandamos el area de trabajo
      var xx = App.dashboard.paper.options.width-100;
      if(cell.get('position').x >= xx){
        App.dashboard.paper.setDimensions(parseInt(App.dashboard.paper.options.width + 150 , 10), parseInt(App.dashboard.paper.options.height,10));
      }
    });

    // Control de sobreponer un elemento sobre otro para crear el enlace.
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

    ////////////////////////////////////////
    //Opening modal for node value edition//
    ////////////////////////////////////////
    this.paper.on('cell:pointerdblclick', function(cellView, evt, x, y) { 
      if(cellView.model.get('predicate') != 'null') {
        var label = cellView.model.attr('text/text');
        $('div #nodeValue #node-value').val(label.match('^[?]')?'':label);
        $('div #nodeValue').modal({data: cellView});
      }
      $('div #nodeValue').on('hide.bs.modal', function(ev) {
        if( $('div #nodeValue #node-value').val().length > 0 ) {
          console.log(cellView);
          cellView.model.attr('text/text', $('div #nodeValue #node-value').val() );
          $('div #nodeValue').unbind('hide.bs.modal');
        }
      });
    });

  }
});
