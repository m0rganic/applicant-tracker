define(['vendor/backbone', 'app', 'applicant-list-item-view'], function (Backbone, App, ApplicantListItemView) {
  "use strict";
  /*
   * ApplicantListView
   *
   * Displays a collection of Applicants, each one rendered
   * by an ApplicantListItemView. Each one links to the detail
   * view for that applicant.
   */
  


  return Backbone.View.extend({

    className: 'applicant-list',
    template: App.getTemplate("applicant-list"),

    render: function () {
      this.$el.html(this.template());
      this.collection.each(this.addOne, this);
      return this;
    },

    addOne: function (applicant) {
      var itemView = new ApplicantListItemView({model: applicant});
      this.$("#applicant-list").append(itemView.render().el);
    }

  });
});