/*
    View logic for the query samples list component
    */
    this.SearchView = Backbone.View.extend({
      tagName: "div",
      id: "search",

  /////////////////////////
  // View Initialization //
  /////////////////////////
  initialize: function() {
    var me;
    me = this;
  },

  //////////////////////////
  //Render Samples Views//
  //////////////////////////
  render: function() {
    Blaze.render(Template.search, $('#sparql-content')[0]);
    this.setEvents($('#sparql-content'));
    return this;
  },
  setEvents: function(divNode) {
    $('button.runSearch').on('click', function(ev) {
      var EntitySearch = get_radio_value("resourceType");

      var FromList = get_checkList_values("repositoriesList");

      var TextSearch = $("#textToSearch").val();
      

      alert(EntitySearch);
      alert(TextSearch);

      alert(FromList);



    });
  }
});

function get_checkList_values(CheckName) {
            var inputs = document.getElementsByName(CheckName);
            var values=[];
            for (var i = 0; i < inputs.length; i++) {
              if (inputs[i].checked) {
                values.push(inputs[i]);
              }
            }
            return values;
          };

    function get_radio_value(RadioName) {
            var inputs = document.getElementsByName(RadioName);
            for (var i = 0; i < inputs.length; i++) {
              if (inputs[i].checked) {
                return inputs[i].value;
              }
            }
          };
