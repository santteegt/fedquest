this.MapView = Backbone.View.extend({
    tagName: "div",
    id: "map",

    /////////////////////////
    // View Initialization //
    /////////////////////////
    initialize: function (v1) {
        var me;
        me = this;

        Session.set('idMap', v1);


    },

    //////////////////////////
    //Render Samples Views//
    //////////////////////////
    render: function () {



        Blaze.render(Template.map, $('#sparql-content')[0]);

        this.setEvents($('#sparql-content'));
        return this;


    },
    setEvents: function (divNode) {
        var IdMap = Session.get('idMap');
        function string_to_int(clave_string)
        {
            var clave_num = 0;
            for (var i = 0; i < clave_string.length; i++)
            {
                clave_num = clave_num + clave_string.charCodeAt(i);
            }
            return clave_num;
        }


        mis_svg_graph = new Array();
        mis_svg_graph[string_to_int('DefaultD')] = "map43.svg";
        mis_svg_graph[string_to_int('BanderaB')] = "map45.svg";
        mis_svg_graph[string_to_int('AlfilerA')] = "map48.svg";
        mis_svg_graph[string_to_int('OvaladoO')] = "map51.svg";
        mis_svg_graph[string_to_int('PersonaP')] = "map52.svg";
        mis_svg_graph[string_to_int('FlechaF')] = "map47.svg";

        mis_svg = new Array();
        mis_svg[string_to_int('DefaultD')] = "M256,0C167.641,0,96,71.625,96,160c0,24.75,5.625,48.219,15.672,69.125C112.234,230.313,256,512,256,512l142.594-279.375\n\
	C409.719,210.844,416,186.156,416,160C416,71.625,344.375,0,256,0z M256,256c-53.016,0-96-43-96-96s42.984-96,96-96\n\
	c53,0,96,43,96,96S309,256,256,256z";
        mis_svg[string_to_int('BanderaB')] = "M192,416h-32V0h32V416z M384,96L512,0H224v192h288L384,96z M224,323.375v32.531c55.813,8.844,96,32.281,96,60.094\n\
	c0,35.344-64.469,64-144,64S32,451.344,32,416c0-27.813,40.188-51.25,96-60.094v-32.531C58.875,333.219,0,364.625,0,416\n\
	c0,63.031,88.563,96,176,96s176-32.969,176-96C352,364.625,293.125,333.219,224,323.375z";
        mis_svg[string_to_int('AlfilerA')] = "M288,448l-64,64V288h64V448z M132.531,256h246.938C370.813,222.563,349,194.531,320,177.531V64c17.688,0,32-14.313,32-32\n\
	S337.688,0,320,0H192c-17.688,0-32,14.313-32,32s14.313,32,32,32v113.531C163,194.531,141.188,222.563,132.531,256z";
        mis_svg[string_to_int('OvaladoO')] = "M256,64c52.938,0,96,43.063,96,96s-43.063,96-96,96s-96-43.063-96-96S203.063,64,256,64 M256,0C167.625,0,96,71.625,96,160\n\
	s71.625,352,160,352s160-263.625,160-352S344.375,0,256,0L256,0z";
        mis_svg[string_to_int('PersonaP')] = "M304,48c0,26.5-21.5,48-48,48s-48-21.5-48-48s21.5-48,48-48S304,21.5,304,48z M288,128h-64c-17.688,0-32,14.313-32,32v128 \n\
	h32v128h64V288h32V160C320,142.313,305.688,128,288,128z M320,323.406v32.313c74.531,8.813,128,32.438,128,60.281 \n\
	c0,35.344-85.969,64-192,64S64,451.344,64,416c0-27.844,53.5-51.469,128-60.281v-32.313c-86.813,9.5-160,39.125-160,92.594 \n\
	c0,66.313,112.5,96,224,96s224-29.688,224-96C480,362.531,406.813,332.906,320,323.406z";
        mis_svg[string_to_int('FlechaF')] = "M416,192l64-64l-64-64H288V32c0-17.688-14.313-32-32-32s-32,14.313-32,32v32h-96v128h96v32H96l-64,64l64,64h128v160h64V352\n\
	h64V224h-64v-32H416z";


        if (isNaN(IdMap)) {
            alert('Invalid Query ID');
        } else {
            Meteor.call('MapLocations', IdMap, function (error, resultR) {

                if (resultR.status != 0) {
                    if (resultR.status == 1) {
                        alert('Processing data ... please wait ....');
                    } else {
                        alert('No results for this query');
                    }

                } else {
                    var result = resultR.data;
                    console.log(resultR);
                    //1.752793, -92.195912
                    
                    //-5.267715, -75.499910
                    var southWest = L.latLng(-5.377720, -92.095912);
                    var northEast = L.latLng(1.542780, -75.199910);
                    
                    //var southWest = L.latLng(40.712, -74.227);
                    //var northEast = L.latLng(40.774, -74.125);
                    
                    
                    map = new L.Map('areagrafo',
                            {
                                center: [-1.80, -81.50],
                                zoom: 7,
                                minZoom: 7,

                                maxBounds: L.latLngBounds(southWest,northEast )
                            }
                    );
                    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
                            {
                                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
                            }).addTo(map);

                    try {

                        var markers = L.markerClusterGroup({showCoverageOnHover: false, spiderfyOnMaxZoom: true, spiderLegPolylineOptions: {weight: 1, color: '#FF0000', opacity: 1}, zoomToBoundsOnClick: true, removeOutsideVisibleBounds: true});
                        //var icon = "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='512' height='512'> <path stroke='#000' stroke-width='2' fill='" + css.color + "' opacity='" + css.opacity + "' d='" + mis_svg[string_to_int(url)] + "'/></svg>";
                        //var svgURL = "data:image/svg+xml;base64," + btoa(icon);
                        //var mySVGIcon = L.icon({iconUrl: "http://leafletjs.com/examples/custom-icons/leaf-shadow.png", iconSize: [35, 35]});


                        var layergeojson = L.geoJson(result,
                                {
                                    //style: {"color": "#0000ff"},
                                    onEachFeature: function (feature, layer)
                                    {
                                        layer.bindPopup("Repositorio:" + feature.properties.Repository.toString() + "<br/>" +
                                                "Lugar:" + '<a target="_blank" href=\'' + feature.properties.URI.toString() + '\'>' + feature.properties.Name.toString() + ' </a><br/>' +
                                                "Documento:" + '<a target="_blank" href=\'' + feature.properties.DocumentURI.toString() + '\'>' + feature.properties.Document.toString() + ' </a><br/>'
                                                );
                                    },
                                    pointToLayer: function (feature, latlng)
                                    {
                                        var endp = Endpoints.find().fetch().filter(function (a) {
                                            return a.name == feature.properties.Repository.toString();
                                        })[0];

                                        var icon = "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='512' height='512'> <path stroke='#000' stroke-width='2' fill='" + endp.colorid + "' opacity='0.5' d='" + mis_svg[string_to_int("DefaultD")] + "'/></svg>";
                                        var svgURL = "data:image/svg+xml;base64," + btoa(icon);

                                        var mySVGIcon = L.icon({iconUrl: svgURL, iconSize: [35, 35]});


                                        return L.marker(latlng, {icon: mySVGIcon});
                                    }
                                });
                        markers.addLayer(layergeojson);
                        markers.addTo(map);
                        //console.log(result);
                    } catch (e) {
                        console.log(e);

                    }
                }
            });
        }

    }
});

