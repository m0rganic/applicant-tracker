(function () {
  "use strict";
  /*
   * ApplicantDetailView
   *
   * Displays the details for a single Applicant.
   */
  


  var ApplicantDetailView = App.ApplicantDetailView = Backbone.View.extend({

    template: App.getTemplate("applicant-detail"),

    events: {
      "click #back-to-list"  : "backToList"
    },

    render: function () {
      this.$el.html(this.template(this.model.attributes));
      return this;
    },

    backToList: function () {
      App.router.navigate("/", {trigger: true});
    }

  });
}());