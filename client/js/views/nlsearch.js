

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

        Session.set('AuxCargS', 0);
        
        window.StartQuery = (function () {
            Session.set('AuxCargS', Session.get('AuxCargS')+1);
            
        });
        
        window.EndQuery = (function () {
            Session.set('AuxCargS', Session.get('AuxCargS')-1);
        });


        window.QueryEvent = (function (e, h) {
            var p1_ = e.search(/SELECT DISTINCT/);
            var p2_ = e.search(/SELECT(?! DISTINCT)/);

            if (p1_ != -1 && p2_ != -1 && p1_ < p2_ || p1_ != -1 && p2_ == -1) {
                e = e.replace(/SELECT DISTINCT/, "SELECT DISTINCT ?Source ");
            } else {
                e = e.replace(/SELECT(?! DISTINCT)/, "SELECT ?Source ");
            }
            var jsonRequest = {"sparql": e, "validateQuery": false};
            //waitingDialog.show();
            Meteor.call('doQuery2', jsonRequest, function (error, result) {
                if (result.resultSet) {
                    App.resultCollectionSL.remove({});
                    App.resultCollectionSL.insert(result.resultSet);
                }

                //waitingDialog.hide();
            });
            $('#DSSL')[0].height = h + 20;
        });
        
    }
});

hide = function (e) {

    if ($(".oculto").css("display") == "inline")
    {
        $(".oculto").css("display", "none");
    } else {
        $(".oculto").css("display", "inline");
        //  alert ("Hola");
    }
};

function get_checkList_values(CheckName) {
    var inputs = document.getElementsByName(CheckName);
    var values = [];
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].checked) {
            values.push(inputs[i]);
        }
    }
    return values;
}
;





Init_SPARKLIS = function (e) {
    $('#DataSource').show();
    $('#InConfig').hide();

    var w = $('#DSSL')[0].contentDocument || $('#DSSL')[0].contentWindow.document;
    w.getElementById('config-control').click();
    var lang = 2;
    var elang = 'es';
    var usr = Profile.findOne({idProfile: Meteor.userId()});
    if (usr) {
        lang = usr.language == 'es' ? 2 : 0;
        elang = usr.language;
    }

    //w.getElementById("lang-select").selectedIndex = 0;
    //w.getElementById('config-control').click();

    // w.getElementById('config-control').click();
    w.getElementById("lang-select").selectedIndex = lang;
    //console.log(elang);
    //console.log(lang);
    w.getElementById("lang-select").onchange(elang);
    w.getElementById('config-control').click();


    ///
    var dd = get_checkList_values('repositoriesList');
    var btnhome = w.getElementById('home');
    var dat = [];
    for (var i = 0; i < dd.length; i++) {
        var Service = dd[i].attributes['data-endpoint'].value;
        var ServiceName = dd[i].attributes['data-name'].value;
        dat.push({E: Service, N: ServiceName});
    }
    btnhome.setAttribute("endpoints", JSON.stringify(dat));
    var endp = w.getElementById('sparql-endpoint-input');
    //var endb = Endpoints.findOne({base: true});

    var rr = location.protocol + "//" + location.host + '/api/sparql';

    endp.value = rr;



    var botp = w.getElementById('sparql-endpoint-button');
    botp.click();



};


//
