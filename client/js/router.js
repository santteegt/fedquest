//var graph, paper;
this.Router = Backbone.Router.extend({

    header_node: '#sparql-header',
    content_node: '#sparql-content',
    initialize: function (options) {
        // $(this.header_node).replaceWith(new HeaderView().render().el); //Cambio js
        //$(this.header_node).replaceWith( new HeaderView().render ());
        new HeaderView().render()
    },

    // key: route - value: router method to call
    routes: {
        //  '': 'indexv',
        //  ':lan': 'index',
        'dashboard': 'dashboard',
        'samples': 'samples',
        //'search': 'search',
        'stats': 'stats',
        'dashboard/:id': 'dashboardParam',
        'map/:id': 'mapParam',
        'graph/:uri/:endpoint/:graphuri': 'graph',
        'search/:term/:type/:endpoint': 'search',
        'search': 'search',
        'nlsearch': 'nlsearch',
        'login': 'login',
        'profile': 'profile',
        'adminpanel': 'adminpanel',
        'error': 'error',
        'favsearch': 'favsearch',
        'help': 'help',
        'configpanel': 'configpanel',
        //   'search/:lan':'search2',
        '': 'index',
        // ':lan': 'index',
    }, indexv: function () {
        window.open('/en', '_self');
    },

    index: function (lan) {
        // alert (lan);
        //  lang.init("SESSION",lan);
        $('div.navbar .collapse li a#options').hide();
//new IndexView(lan).render();
        new IndexView().render();

        // new IndexView(lan).render();
        console.log('Inicio Router index');
        $("div.main-ops").onepage_scroll({
            sectionContainer: "section",
            responsiveFallback: 600,
            loop: true
        });
        $('div.slider').wmuSlider({
            touch: true,
            animation: 'slide'
        });
    },

    //deprecated
    disableOnepageScroll: function () {
        $('div.navbar .collapse li a#options').hide();
        $(document).bind('mousewheel DOMMouseScroll MozMousePixelScroll');
    },
    dashboard: function () {
        Meteor.call('validar', 0, function (error, result) {
            if (result) {
                console.log('entra a dashboard');
                new DashboardView({}).render();
            } else {
                window.open('/error', "_self");
                return null;
            }
        });
        /*console.log('entra a dashboard');
         new DashboardView({}).render();     */
    },
    samples: function () {
        Meteor.call('validar', 0, function (error, result) {
            if (result) {
                $('div.navbar .collapse li a#options').hide();
                $('div.navbar .collapse li a#options').css('pointer-events', 'none');
                console.log('entra a samples');
                new SamplesView().render();
            } else {
                window.open('/error', "_self");
                return null;
            }
        });
        /*$('div.navbar .collapse li a#options').hide();
         $('div.navbar .collapse li a#options').css('pointer-events','none');
         console.log('entra a samples');
         new SamplesView().render();    */

    }/*, search2 : function (lan){
     lang.init("USER_PROFILE", lan );
     $('div.navbar .collapse li a#options').css('pointer-events','none');
     console.log('entra a search');
     new SearchView().render(); }*/
    ,
    search: function (s1, s2, s3) {
        $('div.navbar .collapse li a#options').hide();
        $('div.navbar .collapse li a#options').css('pointer-events', 'none');
        console.log('entra a search');

        Tracker.autorun(function () {
            if (Session.get("Conf")) {
        new SearchView(decodeURIComponent(s1), decodeURIComponent(s2), decodeURIComponent(s3)).render();
         }}
         );
    },
    nlsearch: function ( ) {
        $('div.navbar .collapse li a#options').hide();
        $('div.navbar .collapse li a#options').css('pointer-events', 'none');

        new NLSearchView().render();
    },
    stats: function () {
        $('div.navbar .collapse li a#options').hide();
        $('div.navbar .collapse li a#options').css('pointer-events', 'none');
        new StatsView().render();
    },
    graph: function (v1, v2, v3) {

        Tracker.autorun(function () {
            if (Session.get("Conf")) {

                $('div.navbar .collapse li a#options').hide();
                $('div.navbar .collapse li a#options').css('pointer-events', 'none');
                console.log('entra a grafos');
                new GraphView(decodeURIComponent(v1), decodeURIComponent(v2), decodeURIComponent(v3)).render();
            }
        });

    }
    ,
    mapParam: function (id) {
        $('div.navbar .collapse li a#options').hide();
        new MapView(id).render();
    },

    dashboardParam: function (id) {
        $('div.navbar .collapse li a#options').hide();
        new DashboardView({idSample: id}).render();
    },
    login: function () {
        $('div.navbar .collapse li a#options').hide();
        //  $("div.main-ops").hide();
        new LoginView().render();
    }, profile: function () {
        $('div.navbar .collapse li a#options').hide();
        new ProfileView().render();
    }, adminpanel: function () {
        $('div.navbar .collapse li a#options').hide();
        // Meteor.call('validar', 1 , function (error, result) {
        // if (result) {
        new adminpanelView().render();
        //  }
        //  });
        // new adminpanelView().render();   
    }, error: function () {
        $('div.navbar .collapse li a#options').hide();
        new errorpagView().render();
    }, help: function () {
        $('div.navbar .collapse li a#options').hide();
        new helpagView().render();
    }, favsearch: function () {
        $('div.navbar .collapse li a#options').hide();
        new FavSearchView().render();
    }, configpanel: function () {


        $('div.navbar .collapse li a#options').hide();
        new confpanelView().render();
        $("div.main-ops").onepage_scroll({
            sectionContainer: "section",
            responsiveFallback: 600,
            loop: true
        });
        $('div.slider').wmuSlider({
            touch: true,
            animation: 'slide'
        });

        /*new confpanelView().render(); */
    }
});
