define(['kinvey', 'app'], function (Kinvey, App) {
  "use strict";
  /*
   * NotesCollection
   *
   * A Backbone Collection that represents a collection
   * of notes about an applicant
   */


  return Kinvey.Backbone.Collection.extend({

    url: 'notes'

  });
});