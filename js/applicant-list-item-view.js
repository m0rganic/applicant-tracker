define(['vendor/backbone', 'app'], function (Backbone, App) {
  "use strict";
  /*
   * ApplicantListItemView
   *
   * Displays a single Applicant for a list, which links to the
   * detail view for that Applicant.
   */
  


  return Backbone.View.extend({

    className: 'applicant',
    template: App.getTemplate("applicant-list-item"),

    events: {
      "click"  : "showDetails"
    },

    render: function () {
      this.$el.html(this.template(this.model.attributes));
      return this;
    },

    showDetails: function (e) {
      if (!App.detail) {
        App.router.navigate("/applicants/" + this.model.id, {trigger: true});
        e.stopPropagation();
      }
    }

  });
});