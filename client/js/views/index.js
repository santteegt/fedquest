
/*
    View logic for the index component
 */
this.IndexView = Backbone.View.extend({
  template: null,
  tagName: "div",
  id: "index",
  initialize: function() {
    var me;
    me = this;
  },
  render: function() {
    Blaze.render(Template.welcomePage, $('div.main-ops')[0]);
    this.setEvents($('#sparql-content'));
    return this;
  } , setEvents: function (divNode) {

  var prev;
  $("#documentos").click(function () {   
  
    var val = 'documentos';
    prev = selec (prev , val) ;
  
  });
  
  $("#autores").click(function () {  
    
   
    var val = 'autores';
    prev = selec (prev , val) ;
  });
  
  $("#colecciones").click(function () {
    var val = 'colecciones';
    prev = selec (prev , val) ;
 
  });


  


  /* $("#documentos").on('click', function (ev) {  
    //alert($('input:radio[id=documentos]:checked').val());
    $(".recurso").text ("Buscando por: Documentos");
    //alert("click");
  });
  
  $("#autores").on('click', function (ev) {
    $(".recurso").text ("Buscando por: Autores");
  });
  
  $("#colecciones").on('click', function (ev) {  
    $(".recurso").text ("Buscando por: Colecciones");
  });*/
  
  //$('button.runSearch').on('click', function (ev) { alert("click");});

  }
});


 function selec ( prev , val) {
    if  ( prev == $('input:radio[id='+val+']').val () ) {
   $(".recurso").text ("Buscando por: Todo");
   prev = "";
   $('input:radio[id='+val+']').attr('checked',false);
   }
   else {
    $(".recurso").text ("Buscando por: "+val.charAt(0).toUpperCase() + val.slice(1));
    prev = $('input:radio[id='+val+']').val ();
    }
    return prev;
 }
 
