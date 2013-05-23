define(['vendor/backbone', 'app', 'note-model', 'notes-collection'], function (Backbone, App, Note, NotesCollection) {
  "use strict";
  /*
   * NoteFormView
   *
   * Displays the form for a new Note on an Applicant.
   */
  


  return Backbone.View.extend({

    tagName: 'li',
    className: 'note-form',
    template: App.getTemplate("note-form"),

    events: {
      "submit"  : "submit"
    },

    render: function () {
      this.$el.html(this.template());
      return this;
    },

    submit: function (e) {
      var note, applicant, $btn, $comment;

      applicant = this.options.applicant;
      $comment = this.$("#comment");
      note = new Note({
        author: App.user.get('first_name'),
        comment: $comment.val(),
        date: new Date()
      });

      if (!applicant.has('notes')) {
        applicant.set('notes', new NotesCollection());
      }
      applicant.get('notes').add(note);

      $btn = this.$("button[type='submit']");
      $btn.attr('disabled', true);
      applicant.save({}, {
        success: function () {
          $comment.val('');
          $btn.removeAttr('disabled');
        },
        error: function () {
          alert('problem saving note!');
          applicant.get('notes').remove(note);
        }
      });
      return false;
    }

  });
});