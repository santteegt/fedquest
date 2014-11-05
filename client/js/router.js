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
  },

  index: function () {
    console.log('Inicio Router index');
  },

  dashboard: function() {
    console.log('entra a dashboard');
    new DashboardView().render();        

  }
});