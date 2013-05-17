define(['Kinvey', 'app'], function (Kinvey, App) {
  "use strict";
  /*
   * GithubProfileModel
   * 
   * A Backbone Model that represents a person's Github profile
   */


  return Kinvey.Backbone.Model.extend({

    urlRoot: 'github-profiles'

  });
});