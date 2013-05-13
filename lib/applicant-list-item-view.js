(function () {
  "use strict";
  /*
   * ApplicantListItemView
   *
   * Displays a single Applicant for a list, which links to the
   * detail view for that Applicant.
   */
  


  var ApplicantListItemView = App.ApplicantListItemView = Backbone.View.extend({

    template: App.getTemplate("applicant-list-item"),

    events: {
      "click"  : "showDetails"
    },

    render: function () {
      this.$el.html(this.template(this.model.attributes));
      return this;
    },

    showDetails: function () {
      App.router.navigate("/applicants/" + this.model.id, {trigger: true});
    }

  });
}());