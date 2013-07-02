define(['kinvey', 'app'], function (Kinvey, App) {
  "use strict";
  /*
   * GithubRepoModel
   *
   * A Backbone Model that represents a Github repo
   */


  return Kinvey.Backbone.Model.extend({

    urlRoot: 'github-repos'

  });
});