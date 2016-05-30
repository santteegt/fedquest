/*
 View logic for the query samples list component
 */




this.StatsView = Backbone.View.extend({
    tagName: "div",
    id: "stats",
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
        Blaze.render(Template.stats, $('#sparql-content')[0]);
        this.setEvents($('#sparql-content'));
        return this;
    },
    setEvents: function (divNode) {
    }
});

