this.SparqlEditorView = Backbone.View.extend({
			initialize: function () {
				this.render();
			},
			
			render: function() {
				console.log('render modalContentRegister');
			   //var template = _.template( $("#edit_template").html(), {} );
				// Load the compiled HTML into the Backbone "el"
				this.$el.html( Blaze.toHTML(Template.sparqlEditor) );
				console.log('Render Sparql');
				return this;
			},
	});