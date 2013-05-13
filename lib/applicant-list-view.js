(function () {
  "use strict";
  /*
   * ApplicantListView
   *
   * Displays a collection of Applicants, each one rendered
   * by an ApplicantListItemView. Each one links to the detail
   * view for that applicant.
   */
  


  var ApplicantListView = App.ApplicantListView = Backbone.View.extend({

    template: App.getTemplate("applicant-list"),

    render: function () {
      this.$el.html(this.template());
      this.collection.each(this.addOne, this);
      return this;
    },

    addOne: function (applicant) {
      var itemView = new App.ApplicantListItemView({model: applicant});
      this.$("#applicant-list").append(itemView.render().el);
    }

  });
}());