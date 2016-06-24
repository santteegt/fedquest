this.errorpagView = Backbone.View.extend({
  tagName: "div",
  id: "errorpag",

  /////////////////////////
  // View Initialization //
  /////////////////////////
  initialize: function() {
    var me;
    me = this;

  } ,

  render: function() {


    Blaze.render(Template.errorpag, $('#sparql-content')[0]);
    //adminthis.setEvents($('#sparql-content'));
    console.log('Render Error');
    return this;
    }
  
  });