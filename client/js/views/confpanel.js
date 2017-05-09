import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';


this.confpanelView = Backbone.View.extend({
  tagName: "div",
  id: "confpanel",

  /////////////////////////
  // View Initialization //
  /////////////////////////
  initialize: function() {
    var me;
    me = this;

  } ,

  render: function() {
     var configthis = this;
   
   // Blaze.render(Template.confpanel, $('#sparql-content')[0]);
   Blaze.render(Template.confpanel, $('div.main-ops')[0]);
   Blaze.render(Template.dialogEntity , $('#sparql-content')[0]);
   Blaze.render(Template.dialogStat , $('#sparql-content')[0]);
   Blaze.render(Template.dialogxport , $('#sparql-content')[0]);
  
   configthis.setEvents($('#sparql-content'));
   // LoadEndpoints ();
    console.log('Render config');
    return this;
       
    } ,  
    setEvents: function (a) {


   //   alert("Adios");
    //  console.log ("Hola mundo");
    // LoadEndpoints ();
    $('.selectpicker').selectpicker();


    $( "#ConfigEntity , #distriList , #selectDistriList , #selectDistriListbus , #distriListbus , #ConfigStat , #FontProp" ).hover(
    function() {
    
    $(document).off('mousewheel DOMMouseScroll MozMousePixelScroll');
    $('div.main-ops').off('touchstart swipeDown swipeUp');

    }, function() {
    
    $("div.main-ops").onepage_scroll({
      sectionContainer: "section",
      responsiveFallback: 600,
      loop: true
    });

   }
   );

     exportevent = function (event) {
     console.log ( $("Select[id='endpointmultipicker']").val () ) ;
     var endpointexport = $("Select[id='endpointmultipicker']").val () ;
     var condition = ""; 
     var conditions = [];
     _.each ( endpointexport , function (e , idx ) {
     var condend = "{ Endpoint : '"+ e+"' }";
        condition = condend +" , "+condition ; 
        conditions.push ( { Endpoint : e });
     });
    // var aux =  [ {Endpoint:"http://190.15.141.66:8890/myservice/sparql"} , {Endpoint:"http://190.15.141.102:8891/myservice/sparql"}];
     console.log (conditions);
    // var config = Configuration.find({$or:[ {Endpoint:"http://190.15.141.66:8890/myservice/sparql"} , {Endpoint:"http://190.15.141.102:8891/myservice/sparql"}]}).fetch();
     var config = Configuration.find({$or: conditions }).fetch();
      console.log (config);
      var yourCSVData = JSON.stringify(config);
     var blob = new Blob([yourCSVData], {type: "text/json;charset=utf-8"});
     saveAs(blob, "exportconfig.json");

     }

    deleteimg = function ( e ) {
    var opt = $("#selectedimag").val();
    var id = $("option[data-img-src='"+opt+"']").attr('id');
   // Images.remove({_id: id });

    $("#selectedimag").val(null);
    $("#selectedimag").data('picker').sync_picker_with_select();
        
      Meteor.call('DeleteImagen', id , function (error, result) {
   // alert (result);

    

          console.log ("Borrado "+id+ result);
         // Session.set ("borrado", true);

    /*   $("select").imagepicker({
        hide_select : false,
        show_label  : false 
      });
      $("#selectedimag").css ("display", "none");
         $("select").imagepicker({
        hide_select : false,
        show_label  : false 
      });*/
   });

   
     console.log ("Se ha borrado");
  }
  
    //$('.selectpicker').selectpicker('render');
  
    


    
    }


  });

newEntity = function (e) {
  $("#ModalFormEntity").trigger('reset'); 
  $("#propertypicker").val('').selectpicker('refresh');
  $("#indexpropertypicker").val('').selectpicker('refresh');
  $('#iconselect').iconpicker('setIcon', "glyphicon-");
  $('input:checkbox').removeAttr('checked');
  $('#FilterType  input:checkbox').removeAttr('checked');
  $('#checkfilter').removeAttr('checked');
  $('div #ConfigEntity').modal();
};


newStat = function (e) {
  $("#ModalFormStat").trigger('reset'); 
  $('div #ConfigStat').modal();

};


editStat = function (e) {

   var URI = e.getAttribute('URIOPT');
   var graphend = Session.get ('Graph');
   var conf = Configuration.find ({ "Endpoint" : graphend , 'ConfStat.URI' : URI  }).fetch()[0];
   if (!_.isUndefined(conf)) {
   console.log ("Editar");
   console.log (conf); 
   var Selected = _.find( conf.ConfStat , function( el ){ return el.URI === URI  });
   console.log (Selected);
    $("input:text[id='StatClassName']").val (Selected.name);
    $("select[id='StatURIpicker']").val (Selected.URI);
    $("Select[id='StatDesPicker']").val (Selected.descriptiveprop);
    $("Select[id='StatRelPicker']").val (Selected.Relprop);
    $("input:radio[value="+Selected.typegraph+"]").prop("checked","true");
    console.log (Selected.typegraph);

    $('div #ConfigStat').modal();
   }

};


editEntity = function (e) {

   var URI = e.getAttribute('URIOPT');
   var graphend = Session.get ('Graph');
   var conf = Configuration.find ({ "Endpoint" : graphend , 'ConfEntity.URI' : URI  }).fetch()[0];
   console.log ("Editar");
   console.log (conf); 
   var Selected = _.find( conf.ConfEntity , function( el ){ return el.URI === URI  });
   console.log (Selected);
    $("input:text[id='ClassName']").val (Selected.name);
    $("select[id='entitypicker']").val (Selected.URI);
    $("Select[id='propertypicker']").selectpicker('val', Selected.autocomplete); 
    $("Select[id='propertypickersingle']").val (Selected.descriptiveprop);
    $("Select[id='indexpropertypicker']").selectpicker('val', Selected.indexprop); 
    $("#checkfilter").prop("checked", Selected.espfilter);
     var img = Images.find().fetch().length;
     if ( img > 0) {
    $("#selectedimag").val(Selected.file);
    $("#selectedimag").data('picker').sync_picker_with_select();
    }
    $('#FilterType  input:checkbox').removeAttr('checked');
   var area = $('#FilterType input:checkbox').map(function(){
        

             if ( jQuery.inArray(  parseInt($(this).val()), Selected.filtertype ) != -1 )
              {      console.log ("Marcar");
                     console.log ($(this).val());
                     console.log (Selected.filtertype);
                     $(this).prop('checked','checked');
              }
         
         //$(this).val(0);
         });

   // $('input[name=icon]').iconpicker('setIcon', Selected.icon);
   $("button[id='iconselect']").iconpicker('setIcon', Selected.icon);

  $('div #ConfigEntity').modal();
};

 eventport = function (event) {
 // $('#deleteimgbutton').css ("display","none");
   $('div #Configport').modal();
 }

 SendConfiguration = function (event) {
  var confgraph = [] ;
  var confbus = [] ;
  var constats = []; 
  var graph = $("#endpointpicker").val();
  var ConfEntity = {} ;
   ConfEntity.name =  $("input:text[id='ClassName']").val ();
   ConfEntity.URI = $("select[id='entitypicker']").val ();
   ConfEntity.file = $("#selectedimag").val();
   ConfEntity.autocomplete =  $("Select[id='propertypicker']").val ();
   ConfEntity.descriptiveprop =  $("Select[id='propertypickersingle']").val ();
   ConfEntity.indexprop = $("Select[id='indexpropertypicker']").val ();
   ConfEntity.filtertype = $('#FilterType input:checkbox:checked').map(function(){
      return  parseInt($(this).val());
    }).get();
//  var icon = $("button[id='iconselect']").iconpicker();
   ConfEntity.icon =  $('input[name=icon]').val();
   ConfEntity.espfilter = $('#checkfilter').prop('checked');
 // propertypickersingle

  console.log (ConfEntity.name);
  console.log (ConfEntity.URI);
  console.log (ConfEntity.autocomplete);
  console.log (ConfEntity.descriptiveprop);
  console.log (ConfEntity.indexprop);
  console.log (ConfEntity.espfilter);
  console.log (ConfEntity.filtertype);
  console.log (ConfEntity.icon);
  console.log (ConfEntity.file);

var result = Meteor.call('SaveConfEntity', Meteor.userId() ,  graph , [] , ConfEntity , confgraph , confbus , constats ,function (error, result) {
       if ( _.isUndefined(error)  ) {
            console.log ("Almacenado");
            console.log ("Cerrrando");
           $('div #ConfigEntity').modal('hide');
      } else {
            alert(error);
      }
     //console.log (Meteor.userId());
    });

 }


  SendStatConfiguration = function ( event ) {
    var graph = $("#endpointpicker").val();
    var StatEntity = {} ;
    StatEntity.name =  $("input:text[id='StatClassName']").val ();
    StatEntity.URI = $("select[id='StatURIpicker']").val ();
    StatEntity.descriptiveprop =  $("Select[id='StatDesPicker']").val ();
    StatEntity.Relprop =  $("Select[id='StatRelPicker']").val ();
    StatEntity.typegraph =  $("input[name='TypeStat']:checked").val ();
    console.log (StatEntity.name);
    console.log (StatEntity.URI);
    console.log (StatEntity.descriptiveprop);
    console.log (StatEntity.Relprop);
    console.log (StatEntity.typegraph);

    var result = Meteor.call('SaveConfStat', Meteor.userId() ,  graph , [] , []  , [] , [] , StatEntity ,function (error, result) {
      console.log (result);
      console.log (error);
      if ( _.isUndefined(error)  ) {
            console.log ("Almacenado");
      } else {
            alert(error);
      }
    
     //console.log (Meteor.userId());
    });

  }



/*
 addopt = function  ( ori , dest) {
        alert (ori+dest);
         if ($('#distriList option:selected').val() != null) {
              var tempSelect = $('#distriList option:selected').val();
              $('#distriList option:selected').remove().appendTo('#selectDistriList');
              $("#distriList").attr('selectedIndex', '-1').find("option:selected").removeAttr("selected");
              $("#selectDistriList").attr('selectedIndex', '-1').find("option:selected").removeAttr("selected");
              $("#selectDistriList").val(tempSelect);
              tempSelect = '';
          } else {
              alert("Before add please select any position.");
          }
      }; */

  addopt = function  ( ori , dest) {
         console.log (ori);
         console.log (dest);
         var originl = "#"+ori;
         var destl = "#"+dest;
         if ($('#'+ori+' option:selected').val() != null) {
              var tempSelect = $('#'+ori+' option:selected').val();
              // $('#'+ori+' option:selected').remove();
              $('#'+ori+' option:selected').remove().appendTo('#'+dest).attr ("Reactive", false ); //remove
              $('#'+ori).attr('selectedIndex', '-1').find("option:selected").removeAttr("selected");
              $('#'+dest).attr('selectedIndex', '-1').find("option:selected").removeAttr("selected");
              $('#'+dest).val(tempSelect); //remove
             // console.log ("Mover OBJ");
             // console.log (tempSelect);
             //console.log ($('#'+ori+' option:selected').val());
              saveconfig (dest , tempSelect , 0);
              tempSelect = '';
          } else {
              alert("Before add please select any position.");
          }
      };

 removeopt = function  (ori , dest ) {
        //alert (ori+dest);
      if ($('#'+dest+' option:selected').val() != null) {
        
          var tempSelect = $('#'+dest+' option:selected').val();
          $('#'+dest+' option:selected').remove().appendTo('#'+ori).attr ("Reactive", false ); //remove
        //  $('#'+dest+' option:selected').appendTo('#'+ori);   //remove
          $('#'+dest ).attr('selectedIndex', '-1').find("option:selected").removeAttr("selected");
          $('#'+ori).attr('selectedIndex', '-1').find("option:selected").removeAttr("selected");

         /* $('#'+ori).val(tempSelect); //remove
          console.log ("Mover OBJ");
          console.log (tempSelect);*/
          saveconfig (dest , tempSelect  , 1);
          tempSelect = '';
      } else {
          alert("Before remove please select any position.");
      }

 };

  saveconfig = function  ( dest , temp , opt ) {
  var selgraph = [] ;
  var confgraph = [] ;
  var confbus = [];
  var ConfEntity = [];
  var confstats = [];
  var Source = [];
  var graph = $("#endpointpicker").val();
   
  $('#'+dest+' option').each(function()
  { selgraph.push ($(this).val());
    console.log ( $(this).val() );
  });
  /*
    if (opt == 0) {
    selgraph.push (temp);
    console.log ("Añadir");
    } else {
    selgraph = _.without( selgraph , temp);
    }*/

   if ( dest == 'selectDistriListbus'){
    confbus = selgraph;

   } else {
    confgraph = selgraph;
   }

   var result = Meteor.call('SaveConfLits', Meteor.userId() ,  graph , Source , ConfEntity , confgraph , confbus ,  confstats ,function (error, result) {
      
      if ( _.isUndefined(error)  ) {
            console.log("Almacenado");
      } else {
            alert(error);
      }
    });

    } ;
   

 deleteConfig = function (e) {
  
    Meteor.call('DeleteConfEnt', e.getAttribute('URIOPT') , Session.get ('Graph') , function (error, result) {
    console.log (result+" "+e.getAttribute('URIOPT'));
                //alert (result);
          });

        };


deleteConfigStat = function (e) {
   Meteor.call('DeleteConfStat', e.getAttribute('URIOPT') , Session.get ('Graph') , function (error, result) {
    console.log (result+" "+e.getAttribute('URIOPT'));
                //alert (result);
          });

}
       

  function  LoadEndpoints () {
 Meteor.call('findAllEndpoints' ,  function (error, result) {
      //alert ("Hola");
    console.log ("Endpoints"); 
    console.log (result);
    //var optn = 0;
     _.each( result, function ( endpointp , idx) {
        console.log (idx);
        var end = endpointp.name +" ( "+endpointp.endpoint + " )";
        console.log (end);
        $('#endpointpicker').append( new Option (  end , idx ) );
     });
     
     });
 }

 Template.selectendpoint.onCreated (function () {
 Tracker.autorun(
  function () { 
    Session.get ('refresh');
    console.log ("Tracker active");
  var graph = $("#endpointpicker").val();
   Session.set ('refresh', false);
   Session.set ('Graph' , graph );


 });
 });

 Template.optpropsingle.onRendered (function( ){ 
// console.log ("Renderizando  Prop");
 // console.log (this);
 // console.log (this.view._domrange.parentElement);
  var id = this.view._domrange.parentElement.id ;
 // console.log (this.view._domrange.parentElement.val())

 // console.log (this.data.fullName);
 // console.log (this.data.isSelected);

   var graphend = Session.get ('Graph');
   var config =  Configuration.find ({ "Endpoint" : graphend }).fetch()[0];
   if ( !_.isUndefined(config) ) {
   //console.log (config);
   var conf = config.Source;
  //console.log ("config Carga");
  // console.log (conf);
   if (conf !== undefined && conf == this.data.fullName &&  id == "FontProp")      
   {   //console.log ("*************************************"); 
      // console.log (conf);
       $("select#FontProp").val(conf);  
   }

  }
 // http://purl.org/ontology/bibo/abstract
});

/*
 Template.selectendpoint.onRendered(function(){
   return Endpoints.find({status: 'A'}).fetch();
});*/

let arr = [];
for(let i = 0; i < 6; i++) {
  let obj = {};
  obj.value = 'Value' + i;
  obj.caption = 'Option ' + i;
  obj.selected = false;
  arr[i] = obj;
}
/*
Template.msExample.helpers({
  'myMenuItems': function selectedItems() {
    return arr;
  },
  'mySelectedList': function selectedList() {
    let retVal = arr.filter(function aFilter(elem) {return elem.selected;})
    .map(function aMap(elem) {return elem.value;});
    return retVal ? retVal : [];
  },
  'myConfigOptions': function configOptions() {
    return {
      'nonSelectedText': 'Check option',
      'buttonClass': 'btn btn-primary',
      'onChange': function onChange(option, checked) {
        let index = $(option).val();
        console.log('Changed option ' + index + '. checked: ' + checked);
        arr.indexOf(index).selected = checked;
      }
    };
  }
});
*/






Template.completproperty.rendered = function(){
  $('#propertypicker').selectpicker();

};

/*
var renderTimeout = false;
Template.optproperty.rendered = function(){
  if (renderTimeout !== false) {
    Meteor.clearTimeout(renderTimeout);
  }
  renderTimeout = Meteor.setTimeout(function() {
    $('#propertypicker').selectpicker("refresh");
    renderTimeout = false;
  }, 10);
};*/

Template.completproperty.events({
  'change #propertypicker': function(e) {
    var selected = $("#propertypicker").val();
    console.log(selected);
  }
});

/*
Template.completproperty.events({
  'change #propertypicker': function(e) {
    var selected = $("#propertypicker").val();
    console.log(selected);
  }
});
*/

Template.graphoptions.rendered = function () {
console.log ("render graph");/*
 var graph = $("#endpointpicker").val();
 Session.set ('Graph',graph);*/
};

Template.indexproperty.rendered = function(){
  $('#indexpropertypicker').selectpicker();
};

var renderTimeout = false;
Template.optproperty.rendered = function(){
  if (renderTimeout !== false) {
    Meteor.clearTimeout(renderTimeout);
  }
  renderTimeout = Meteor.setTimeout(function() {
    $('#propertypicker').selectpicker("refresh");
     $('#indexpropertypicker').selectpicker("refresh");
    renderTimeout = false;
  }, 10);
};


Template.selectendpoint.events({
  'change #endpointpicker': function(e) {
    //var selected = $("#endpointpicker").val();
    //var graph = $("#endpointpicker > option[value='"+selected+"']").attr("graph");
    
    //console.log(selected);

    var graph = $("#endpointpicker").val();
    console.log(graph);
    if (  graph == "---") { graph = undefined ; }
    Session.set ('Graph', undefined);
     /*$('#selectDistriList').find('option').remove();
    $('#selectDistriListbus').find('option').remove();
     $('#distriListbus').find('option').remove();
    $('#distriList').find('option').remove();*/
   //$("option[reactive='false']").remove();
    $('#propertypicker').selectpicker("refresh");
   // Session.set("noRender", true);
    
    Session.set("noRender", false);
    //Session.set ('Graph',graph);
  }
});

Template.graphselectionprop.noRender = function(){
  return Session.get("noRender");
};

Template.graphselectionprop.onCreated(function () { 
 Session.set("noRender", false);
var graph = $("#endpointpicker").val();
 Session.set ('Graph',graph);
});


Template.confpanel.events({
  'change #FontProp': function(e) {
    var selected = $("#FontProp").val();
    console.log(selected);
    var graph = $("#endpointpicker").val();
     var result = Meteor.call('SaveConfSource', Meteor.userId() ,  graph , selected , [] , [] , [] , [] ,function (error, result) {
       if ( _.isUndefined(error)  ) {
            console.log ("Almacenado");
            console.log ("Cerrrando");
           $('div #ConfigEntity').modal('hide');
      } else {
            alert(error);
      }
     //console.log (Meteor.userId());
    });

 }


  
});

//Template.completpropertysingle.


Template.confpanel.rendered = function(){
  $('#iconselect').iconpicker({
 // iconset: 'fontawesome',
 // icon: 'fa-key',
  search: true,
  searchText: 'Search',
  rows: 5,
  cols: 5,
  placement: 'top',
  });

};
 
  
 //Template.uploadedFiles.OnCreated ( function () {
 /* $("select").imagepicker({
        hide_select : false,
        show_label  : false 
      });*/
 //console.log ("Creado");
  //$("#selectedimag").css ("display", "none");
 // });

/*
  Template.optimag.events({ 
    'remove .OptImag': function (e , t ) { 
     console.log ("Eliminando ");
    }
  });
*/
/*
Template.optimag.onDestroyed(function () {
  var template = this;
  template.subscribe('listOfThings', () => {
    // Wait for the data to load using the callback
    Tracker.afterFlush(() => {
      // Use Tracker.afterFlush to wait for the UI to re-render
      // then use highlight.js to highlight a code snippet
      //highlightBlock(template.find('.code'));

      console.log("Change event");
       $("#selectedimag").imagepicker({
        hide_select : true,
        show_label  : false 
      });

    });
  });
});*/

  Template.uploadedFiles.onRendered(function() {  
  console.log ("Renderizado Files");
  });

  Template.optimag.onRendered(function() {  
  console.log ("Renderizado OPT");
  });

 
  Template.optimag.onDestroyed(function () {

  Meteor.setTimeout(function (){
        console.log("Change event");
       $("#selectedimag").imagepicker({
        hide_select : true,
        show_label  : false 
      });  

    }, 100);


  console.log ("Destruido");
});


var renderT = false;
Template.optimag.rendered = function(){
  if (renderT !== false) {
    Meteor.clearTimeout(renderT);
  }
  renderT = Meteor.setTimeout(function() {
      $("#selectedimag").imagepicker({
        hide_select : true,
        show_label  : false 
      });
   //  $("#selectedimag").css ("display", "none");
      Session.set ("borrado" , false);
    console.log ("Actualizar imagenes");
    renderT = false;
  }, 20);
};




 /*Template.optimag.events({
  'change .OptImag': function (e , template ) {
    $("select").imagepicker({
        hide_select : false,
        show_label  : false 
      });
    console.log ("Cambiar"); 
    }
  });*/

//Template Images

/*Template.uploadedFiles.helpers({
  uploadedFiles: function () {
    //return Images.find().fetch();
    //return Images.find();
    return Images.find().cursor;
  } , 
  countFiles : function () {
    return Images.find().fetch().length > 0;
  }
});*/



Template.uploadedFiles.helpers({
  uploadedFiles: function () {
     Session.get ("borrado");
    return Images.find().fetch();
    //return Images.find();
    //return Images.find().cursor;
  } , 
  countFiles : function () {
    return Images.find().fetch().length > 0;
  }
});
Template.optimag.helpers ({
   URL: function ( val ) {
       return Images.findOne({ "_id": val }).link();
  }
}) ;

/*

Template.uploadForm.onCreated(function () {
  this.currentUpload = new ReactiveVar(false);
});

Template.uploadForm.helpers({
  currentUpload: function () {
    return Template.instance().currentUpload.get();
  } , deletebutton : function (e) {
    return  e == "FileImage";
  }
});

Template.uploadForm.events({
  'change #fileInput': function (e, template) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      // We upload only one file, in case 
      // there was multiple files selected
      var file = e.currentTarget.files[0];
      if (file) {
        var uploadInstance = Images.insert({
          file: file,
          streams: 'dynamic',
          chunkSize: 'dynamic'
        }, false);

        uploadInstance.on('start', function() {
          template.currentUpload.set(this);
        });

        uploadInstance.on('end', function(error, fileObj) {
          if (error) {
            alert('Error during upload: ' + error.reason);
          } else {
            alert('File "' + fileObj.name + '" successfully uploaded');
           //  $("select").imagepicker({
            // hide_select : false,
            // show_label  : false 
            // });
            // $("#selectedimag").css ("display", "none"); 

          }
          template.currentUpload.set(false);
        });

        uploadInstance.start();
      }
    }
  } 

});*/

var renderTimeout1 = false;
Template.selectmultiendpoint.onCreated  (function () {
 $('#endpointmultipicker').selectpicker();
});

Template.optendpoint.rendered = function(){
  if (renderTimeout1 !== false) {
    Meteor.clearTimeout(renderTimeout1);
  }
  renderTimeout1 = Meteor.setTimeout(function() {
    $('#endpointmultipicker').selectpicker("refresh");
    renderTimeout1 = false;
  }, 10);
};

    Template.selectmultiendpoint.helpers({
         endpointsAvailable: function () {
           // console.log ("Mostrando Endpoi");
           // console.log (Endpoints);
         return Endpoints.find({status: 'A'}).fetch();
         }
    });
/*
Template.file.helpers({
  imageFile: function () {
    return Images.findOne().fetch();
  }
});*/



/*
Template.completentity.rendered = function(){
  $('#entitypicker').selectpicker();
};

var renderTimeout = false;
Template.optentity.rendered = function(){
  if (renderTimeout !== false) {
    Meteor.clearTimeout(renderTimeout);
  }
  renderTimeout = Meteor.setTimeout(function() {
    $('#entitypicker').selectpicker("refresh");
    renderTimeout = false;
  }, 10);
};

Template.completproperty.events({
  'change #propertypicker': function(e) {
    var selected = $("#propertypicker").val();
    console.log(selected);
  }
});*/

Template.uploadForm.onCreated(function () {
  this.currentUpload = new ReactiveVar(false);
});

Template.uploadForm.helpers({
  currentUpload: function () {
    return Template.instance().currentUpload.get();
  } , deletebutton : function (e) {
    return  e == "FileImage";
  }
});

Template.uploadForm.events({
  'change #FileImage': function (e, template) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      // We upload only one file, in case 
      // there was multiple files selected
      var file = e.currentTarget.files[0];
      if (file) {
        var uploadInstance = Images.insert({
          file: file,
          streams: 'dynamic',
          chunkSize: 'dynamic'
        }, false);

        uploadInstance.on('start', function() {
          template.currentUpload.set(this);
        });

        uploadInstance.on('end', function(error, fileObj) {
          if (error) {
            alert('Error during upload: ' + error.reason);
          } else {
            alert('File "' + fileObj.name + '" successfully uploaded');
           /*  $("select").imagepicker({
             hide_select : false,
             show_label  : false 
             });*/
            // $("#selectedimag").css ("display", "none"); 

          }
          template.currentUpload.set(false);
        });

        uploadInstance.start();
      }
    }
  } , 
  'change #cFilesConfig': function (e, template) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      // We upload only one file, in case 
      // there was multiple files selected
      var file = e.currentTarget.files[0];
      if (file) {
        var uploadInstance = cFiles.insert({
          file: file,
          streams: 'dynamic',
          chunkSize: 'dynamic'
        }, false);

        uploadInstance.on('start', function() {
          template.currentUpload.set(this);
        });

        uploadInstance.on('end', function(error, fileObj) {
          if (error) {
            alert('Error during upload: ' + error.reason);
          } else {
            alert('File "' + fileObj.name + '" successfully uploaded');

         var result =   Meteor.call( 'ImportConf' , fileObj.name , function (error, result ) {
                   
                 if (  _.isUndefined(error))
                 {   alert (result);
                    // location.reload(); 
                      //var act = Session.set ('updatetables' , true);
                      Session.set ('Graph', undefined);
                  } else {
                    alert (error);
                  }
         });
           /*  $("select").imagepicker({
             hide_select : false,
             show_label  : false 
             });*/
            // $("#selectedimag").css ("display", "none"); 

          }
          template.currentUpload.set(false);
        });

        uploadInstance.start();
      }
    }
  }

});
