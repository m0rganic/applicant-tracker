define(['kinvey', 'app'], function (Kinvey, App) {
  "use strict";
  /*
   * NoteModel
   *
   * A Backbone Model that represents a single note
   * about an applicant
   */


  return Kinvey.Backbone.Model.extend({

    urlRoot: 'notes'

  });
});