/**
 * Copyright 2013 Kinvey, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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