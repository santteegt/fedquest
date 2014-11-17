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
    'dashboard/:id': 'dashboardParam'
  },

  index: function () {
    console.log('Inicio Router index');
    $("div.main-ops").onepage_scroll({
      sectionContainer: "section",
      responsiveFallback: 600,
      loop: true
    });
  },

  disableOnepageScroll: function() {
    $("div.main-ops").hide();
    $(document).bind('mousewheel DOMMouseScroll MozMousePixelScroll');
  },

  dashboard: function() {
    this.disableOnepageScroll();
    console.log('entra a dashboard');
    new DashboardView({}).render();        

  },
  samples: function() {
    this.disableOnepageScroll();
    console.log('entra a samples');
    new SamplesView().render();        
  },
  dashboardParam: function(id){
      //this.querieCurrent= Queries.find({_id: "99ECMMzYwHC9nLWov"}).fetch();//Queries.find({_id: id}).fetch();
        //var titulo = _.pluck(querieCurrent, 'title');
         //var m = JSON.stringify(this.querieCurrent);
      new DashboardView({idSample: id}).render();   
       //console.log('entro dashboardParam ' +  this.querieCurrent);
  }
});
