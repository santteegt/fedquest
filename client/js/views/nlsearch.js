this.NLSearchView = Backbone.View.extend({
    tagName: "div",
    id: "nlsearch",
    /////////////////////////
    // View Initialization //
    /////////////////////////
    initialize: function () {
        var me;
        me = this;


    },
    //////////////////////////
    //Render Samples Views//
    //////////////////////////
    render: function () {
        Blaze.render(Template.nlsearch, $('#sparql-content')[0]);
        this.setEvents($('#sparql-content'));
        return this;
    },
    setEvents: function (divNode) {
       

    }
});