
/*
 View logic for the index component
 */
this.IndexView = Backbone.View.extend({
    template: null,
    tagName: "div",
    id: "index",
    initialize: function (lan) {
        var me;
        me = this;
        //lang.init("SESSION",lan);
    },
    render: function () {
        Blaze.render(Template.welcomePage, $('div.main-ops')[0]);
        this.setEvents($('#sparql-content'));
        // loadreco ();

        return this;
    }, setEvents: function (divNode) {

        var cache = {};
        var actu = {};


        //try{
        $("#mce-text").autocomplete({
            minLength: 3,
            source: function (request, response) {
                var term = request.term;
                if (term in cache) {
                    if (cache[ term ].length > 0) {
                        response(cache[ term ]);
                    }
                    if (term in actu) {

                        actu[term] = undefined;
                        cache[term] = undefined;
                    } else {
                        return;
                    }
                }

                var t__ = "T";
                var EntitySearch = $('input:radio[name=opciones]:checked').val();
                if (EntitySearch != undefined) {
                    t__ = EntitySearch;
                }
                if (term != null && term.trim().length > 3) {

                    //Meteor.call('getSuggestions', term, t__, false, null, function (error, result) {
                    //});
                    Meteor.call('getSuggestions', term, t__, null, function (error, result) {
                        //console.log(result);
                        try {
                            cache[ term ] = result.data;
                            if (!result.cacheable) {
                                actu[ term ] = true;
                            }
                            if (result.data.length > 0) {
                                response(result.data);
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    });
                }


            }
        });





        var prev;
        $("#documentos").click(function () {
            cache = {};
            actu = {};
            var val = 'documentos';
            prev = selec(prev, val);

//alert ("hola");


        });

        $("#autores").click(function () {

            cache = {};
            actu = {};
            var val = 'autores';
            prev = selec(prev, val);
        });

        $("#colecciones").click(function () {
            cache = {};
            actu = {};
            var val = 'colecciones';
            prev = selec(prev, val);

        });

        $("#lang-esp").click(function () {
            //language ();
            lang.init("SESSION", "es");
            //   change_language("es");

        });

        $("#lang-en").click(function () {

            lang.init("SESSION", "en");
            // change_language("en");

        });



        /* $("#documentos").on('click', function (ev) {  
         //alert($('input:radio[id=documentos]:checked').val());
         $(".recurso").text ("Buscando por: Documentos");
         //alert("click");
         });
         
         $("#autores").on('click', function (ev) {
         $(".recurso").text ("Buscando por: Autores");
         });
         
         $("#colecciones").on('click', function (ev) {  
         $(".recurso").text ("Buscando por: Colecciones");
         });*/

        //$('button.runSearch').on('click', function (ev) { alert("click");});

    }
});


function selec(prev, val) {
    if (prev == $('input:radio[id=' + val + ']').val()) {
        $(".recurso").text(lang.lang("resources-search"));
        prev = "";
        $('input:radio[id=' + val + ']').attr('checked', false);
    } else {
        $(".recurso").text(lang.lang("search-option") + lang.lang(val.charAt(0).toUpperCase() + val.slice(1)));
        prev = $('input:radio[id=' + val + ']').val();
    }
    return prev;
}


function loadreco() {
    Meteor.call('RecomendationItems', function (error, result) {
        console.log(result);
    });
}

/* Template.welcomePage.helpers({ 
 recoavailable : function () {
 Meteor.call('RecomendationItems', function(error, result) { 
 console.log (result);
 return result;
 });
 }
 
 });*/
