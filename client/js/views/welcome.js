/*
    View logic for the welcome page component
 */
this.WelcomeView = Backbone.View.extend({
  template: null,
  tagName: "div",
  id: "welcome",
  initialize: function() {
    var me;
    me = this;
    /*
    Template.header.events = {
      "click a": function(e) {
        return App.router.aReplace(e);
      }
    };*/
    return this.template = Blaze.toHTMLWithData(Template.welcomePage, {});
    /*return this.template = Meteor.render(function() {
      var loggedIn, name;
      loggedIn = Meteor.userId() != null;
      if (loggedIn && (Meteor.user() != null) && (Meteor.user().profile != null)) {
        name = Meteor.user().profile.name;
      }
      return Blaze.toHTMLWithData(Template.header, {});
      return Template.header({
        loggedIn: loggedIn,
        name: name
      });

    });*/
  },
  render: function() {
    this.$el.html(this.template);
    return this;
  }
});