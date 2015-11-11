//var graph, paper;
this.Router = Backbone.Router.extend({

  header_node: '#sparql-header',
  content_node: '#sparql-content',
  initialize: function (options) {
    $(this.header_node).replaceWith(new HeaderView().render().el);
  },

  // key: route - value: router method to call
  routes: { 
    '': 'index',
    'dashboard': 'dashboard',
    'samples': 'samples',
    'search': 'search',
    'dashboard/:id': 'dashboardParam',
    'graph':'graph'
  },

  index: function () {
    $('div.navbar .collapse li a#options').hide();
    new IndexView().render();
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
  },
  search: function() {
    $('div.navbar .collapse li a#options').css('pointer-events','none');
    console.log('entra a search');
    new SearchView().render();        
  },
   graph: function() {
    $('div.navbar .collapse li a#options').css('pointer-events','none');
    console.log('entra a grafos');
    new GraphView().render();        
  },
  dashboardParam: function(id) {
    new DashboardView({idSample: id}).render();   
  }
});
