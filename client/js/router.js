//var graph, paper;
this.Router = Backbone.Router.extend({

  header_node: '#sparql-header',
  content_node: '#sparql-content',
  initialize: function (options) {
    $(this.header_node).replaceWith(new HeaderView().render().el);
  },

  // key: route - value: router method to call
  routes: { 
  //  '': 'indexv',
  //  ':lan': 'index',
    'dashboard': 'dashboard',
    'samples': 'samples',
    //'search': 'search',
    'stats': 'stats',
    'dashboard/:id': 'dashboardParam',
    'graph/:uri/:endpoint/:graphuri':'graph',
    'search/:term/:type/:endpoint':'search',
    'search':'search',
 //   'search/:lan':'search2',
    '': 'index',
   // ':lan': 'index',
  }, indexv : function (){
    window.open('/en','_self');
  } ,

  index: function (lan) {
   // alert (lan);
 //  lang.init("SESSION",lan);
$('div.navbar .collapse li a#options').hide();
//new IndexView(lan).render();
new IndexView().render();
  
   // new IndexView(lan).render();
    console.log('Inicio Router index');
    $("div.main-ops").onepage_scroll({
      sectionContainer: "section",
      responsiveFallback: 600,
      loop: true
    });
    $('div.slider').wmuSlider({
            touch: true,
            animation: 'slide'
        }); 
  },

  //deprecated
  disableOnepageScroll: function() {
    $("div.main-ops").hide();
    $(document).bind('mousewheel DOMMouseScroll MozMousePixelScroll');
  },
  dashboard: function() {
    console.log('entra a dashboard');
    new DashboardView({}).render();        
  },
  samples: function() {
    $('div.navbar .collapse li a#options').css('pointer-events','none');
    console.log('entra a samples');
    new SamplesView().render();        
  }/*, search2 : function (lan){
     lang.init("USER_PROFILE", lan );
    $('div.navbar .collapse li a#options').css('pointer-events','none');
    console.log('entra a search');
    new SearchView().render(); }*/
  ,
  search: function(s1, s2 ,s3 ) {
    $('div.navbar .collapse li a#options').css('pointer-events','none');
    console.log('entra a search');
    new SearchView(decodeURIComponent(s1),decodeURIComponent(s2), decodeURIComponent(s3)).render();        
  },
  stats: function() {
    $('div.navbar .collapse li a#options').css('pointer-events','none');
    new StatsView().render();        
  },
   graph: function(v1, v2, v3) {
    $('div.navbar .collapse li a#options').css('pointer-events','none');
    console.log('entra a grafos');
    new GraphView(decodeURIComponent(v1),decodeURIComponent(v2),decodeURIComponent(v3)).render();        
  },

  dashboardParam: function(id) {
    new DashboardView({idSample: id}).render();   
  }
});
