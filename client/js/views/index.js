
/*
    View logic for the index component
 */
this.IndexView = Backbone.View.extend({
  template: null,
  tagName: "div",
  id: "index",
  initialize: function(lan) {
    var me;
    me = this;
    //lang.init("SESSION",lan);
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

 $("#lang-esp").click(function () {   
  //language ();
     lang.init("SESSION","es");
  //   change_language("es");
  
  });

$("#lang-en").click(function () {   
  
    lang.init("SESSION","en");
  // change_language("en");
  
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
   $(".recurso").text (lang.lang ("resources-search"));
   prev = "";
   $('input:radio[id='+val+']').attr('checked',false);
   }
   else {
    $(".recurso").text (lang.lang( "search-option") + lang.lang (val.charAt(0).toUpperCase()+val.slice(1)));
    prev = $('input:radio[id='+val+']').val ();
    }
    return prev;
 }
 
