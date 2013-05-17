define(['Kinvey', 'app'], function (Kinvey, App) {
  "use strict";
  /*
   * NoteModel
   * 
   * A Backbone Model that represents a Github repo
   */


  return Kinvey.Backbone.Model.extend({

    urlRoot: 'notes'

  });
});