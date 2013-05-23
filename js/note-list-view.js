define([
  'jquery',
  'vendor/underscore',
  'vendor/backbone',
  'app',
  'note-list-item-view',
  'note-form-view',
  'notes-collection'
], function ($, _, Backbone, App, NoteListItemView, NoteForm, NotesCollection) {
  "use strict";
  /*
   * NoteListView
   *
   * Displays a collection of Notes, each one rendered
   * by an NoteListItemView.
   */
  


  return Backbone.View.extend({

    tagName: 'ul',
    className: 'note-list',
    template: App.getTemplate("note-list"),
    groupTemplate: App.getTemplate("note-list-group"),

    initialize: function () {
      var applicant = this.options.applicant;
      if (!applicant.has('notes')) {
        applicant.set('notes', new NotesCollection());
      }
      this.collection = this.options.applicant.get('notes');
      this.listenTo(this.collection, 'add', _.bind(this.addOne, this));
    },

    render: function () {
      this.$el.html(this.template());
      this.noteForm = new NoteForm({applicant: this.options.applicant});
      this.$el.append(this.noteForm.render().el);
      this.collection.each(_.bind(this.addOne, this));
      return this;
    },

    addOne: function (note) {
      var itemView = new NoteListItemView({model: note});
      this.$(".note-form").before(itemView.render().el);
    }

  });
});