this.FavSearchView = Backbone.View.extend({
  template: null,
  tagName: "div",
  id: "favsearch",
  initialize: function(lan) {
    var me;
    me = this;
    
  },
  render: function() {
   var favthis = this;
  
    if (!_.isNull(Meteor.userId()) ){
    Blaze.render(Template.favsearch , $('#sparql-content')[0]);
    favthis.setEvents($('#sparql-content'));
     
    //loadProfile();
    //waitingDialog.show();
    waitingDialog.show();
    return favthis;
     } else {
     window.open('/error',"_self" );
     return null;

    }
    

  } , 
  setEvents: function (divNode) {

    Meteor.subscribe('tasks', function onReady() {
             waitingDialog.hide ();
          });
   

} 


});

 deletehist = function (e) {
  
   Meteor.call('DeleteHist', e.getAttribute('Idsearch') , function (error, result) {
    console.log (result+" "+e.getAttribute('Idsearch'));
                //alert (result);
          });
}

 deletefav = function (e) {
  Meteor.call('Deletefav', e.getAttribute('Idres') , function (error, result) {
    console.log (result+" "+e.getAttribute('Idres'));
                //alert (result);
          });

 }

