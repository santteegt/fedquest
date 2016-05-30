/*
    View logic for the query samples list component
 */
this.SamplesView = Backbone.View.extend({
  tagName: "div",
  id: "samples",

  /////////////////////////
  // View Initialization //
  /////////////////////////
  initialize: function() {
    var me;
    me = this;
    /*
    Tracker.autorun(function(){
      var queries = Queries.find().fetch();
      if(queries.length > 0) {
        Session.set('queries', queries);  
      }
      console.log("Queries Disponibles: " + queries.length);
    });*/

  },

  //////////////////////////
  //Render Samples Views//
  //////////////////////////
  render: function() {
    Blaze.render(Template.samples, $('#sparql-content')[0]);
    console.log('Render Samples');
    return this;
  }
});
