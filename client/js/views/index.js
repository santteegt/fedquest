
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
    return this;
  }
});
