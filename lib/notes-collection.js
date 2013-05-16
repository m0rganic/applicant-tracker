require(['kinvey', 'app'], function (Kinvey, App) {
  "use strict";
  /*
   * NotesCollection
   * 
   * A Backbone Collection that represents a collection of Github repos
   */


  return Kinvey.Backbone.Collection.extend({

    url: 'notes'

  });
});