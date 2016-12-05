this.helpagView = Backbone.View.extend({
  tagName: "div",
  id: "helpag",

  /////////////////////////
  // View Initialization //
  /////////////////////////
  initialize: function() {
    var me;
    me = this;

  } ,

  render: function() {


    Blaze.render(Template.helpag, $('#sparql-content')[0]);
    //adminthis.setEvents($('#sparql-content'));
    console.log('Render Help');
    return this;
    }
  
  });