define([
  'vendor/backbone',
  'kinvey',
  'app',
  'github-profile-model',
  'github-repo-model',
  'github-repos-collection',
  'note-model',
  'notes-collection'
], function (Backbone, Kinvey, App, GithubProfileModel, GithubRepoModel, GithubReposCollection, NoteModel, NotesCollection) {
  "use strict";
  /*
   * ApplicantModel
   *
   * A Backbone Model that represents a single job application (a person, and the
   * position they are applying for).
   */


  return Kinvey.Backbone.Model.extend({

    urlRoot: 'applicants',

    relations: [
      {
        type          : Backbone.One,
        key           : 'github_profile',
        relatedModel  : GithubProfileModel,
        autoFetch     : false,
        autoSave      : false
      },
      {
        type            : Backbone.Many,
        key             : 'repos',
        relatedModel    : GithubRepoModel,
        collectionType  : GithubReposCollection,
        autoFetch     : false,
        autoSave      : false
      },
      {
        type            : Backbone.Many,
        key             : 'notes',
        relatedModel    : NoteModel,
        collectionType  : NotesCollection,
        autoFetch       : true, // we want to retrieve related notes with every applicant
        autoSave        : true // we want to save notes to Kinvey any time the applicant is saved
      }
    ]

  });
});