define(['kinvey', 'app'], function (Kinvey, App) {
  "use strict";
  /*
   * GithubReposCollection
   *
   * A Backbone Collection that represents a collection of Github repos
   */


  return Kinvey.Backbone.Collection.extend({

    url: 'github-repos'

  });
});