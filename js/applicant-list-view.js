define([
  'jquery',
  'vendor/underscore',
  'vendor/backbone',
  'app',
  'applicant-list-item-view'
], function ($, _, Backbone, App, ApplicantListItemView) {
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
    groupTemplate: App.getTemplate("applicant-list-group"),

    render: function () {
      var positions;

      this.$el.html(this.template());
      
      positions = this.collection.groupBy('position');
      _.each(positions, _.bind(this.addGroup, this));
      this.$el.addClass('in');
      return this;
    },

    addGroup: function(applicants, position) {
      var groupEl, _this = this;

      groupEl = $(this.groupTemplate({position: position}).replace('\n', ''));
      this.$("#applicant-list").append(groupEl);
      _.each(applicants, function (applicant) {
        _this.addOne(applicant, groupEl);
      });
    },

    addOne: function (applicant, $el) {
      var itemView = new ApplicantListItemView({model: applicant});
      $el.append(itemView.render().el);
    }

  });
});