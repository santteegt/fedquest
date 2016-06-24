/*
    View logic for the query samples list component
 */
this.adminpanelView = Backbone.View.extend({
  tagName: "div",
  id: "adminpanel",

  /////////////////////////
  // View Initialization //
  /////////////////////////
  initialize: function() {
    var me;
    me = this;
    /*
    Tracker.autorun(function(){
      var queries = Queries.find().fetch();
      if(queries.length > 0) {
        Session.set('queries', queries);  
      }
      console.log("Queries Disponibles: " + queries.length);
    });*/

  } ,

  //////////////////////////
  //Render Samples Views//
  //////////////////////////
  render: function() {
  // var renderthis = this;

    var adminthis = this;
   Meteor.call('validar', 1 , function (error, result) {
     if (result) {
    Blaze.render(Template.adminpanel, $('#sparql-content')[0]);
    adminthis.setEvents($('#sparql-content'));
    console.log('Render Panel');
    return adminthis;
     }else {
      window.open('/error',"_self" );
     return null;}
    });
    
              
   
   } , 
  setEvents: function (divNode) {

     /*  $('.accessLevel input:radio').on('click', function (ev) {
                alert ("Change");
                //var gg = $("input:"+endpoint).attr('data-graphuri');
              //  Meteor.call('updateBaseEndpoint', endpoint, graphURI, function (error, result) {
                    //  console.log('base changed'+gg);
                    //non-implemented
               // });
            });*/
  }
});

  ChangeAccess = function (e) {
    console.log ("Consola");
    var val = $(e).attr("value");
    var usuario = $(e).attr("name");

    Meteor.call('actAccess', usuario.substring(4) , parseInt(val), function (error, result) {
                    alert (result);
                    /* $('.top-right').notify({
                        message: {text: "Actualizado"},
                        type: 'success'
                    }).show();*/

                    //  console.log('base changed'+gg);
                    //non-implemented
               });

  };

   deleteUser =  function (e) {
         $( "#delete-yes").click (function ()  {

        Meteor.call('deleteuser', e.getAttribute('userid') , function (error, result) {
          $( "#myConfirmDelete").modal('hide');
          
               });

                              });
         $( "#delete-no").click (function ()  {
         $( "#myConfirmDelete").modal('hide');
          });

              $( "#myConfirmDelete").modal();

      };