this.LoginView = Backbone.View.extend({
  template: null,
  tagName: "div",
  id: "login",
  initialize: function(lan) {
    var me;
    me = this;
    
  },
  render: function() {
   Blaze.render(Template.login, $('#sparql-content')[0]);
        this.setEvents($('#sparql-content'));
    return this;
  } , 
  setEvents: function (divNode) {

  }

});