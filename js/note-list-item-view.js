define(['vendor/underscore', 'vendor/backbone', 'app'], function (_, Backbone, App) {
  "use strict";
  /*
   * NoteListItemView
   *
   * Displays a single Note in a NoteList for an Applicant.
   */
  


  return Backbone.View.extend({

    tagName: 'li',
    className: 'note',
    template: App.getTemplate("note-list-item"),

    render: function () {
      var data = _.extend({}, this.model.attributes);
      if (!(data.date instanceof Date)) {
        data.date = new Date(data.date);
      }
      this.$el.html(this.template(data));
      return this;
    }

  });
});