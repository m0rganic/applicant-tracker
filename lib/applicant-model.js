require([
  'kinvey', 
  'app',
  'github-profile-model',
  'github-repo-model',
  'github-repos-collection',
  'note-model',
  'notes-collection'
], function (Kinvey, App, GithubProfileModel, GithubRepoModel, GithubReposCollection, NoteModel, NotesCollection) {
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
        exclude       : true  // in this case, we don't want to try saving the github profile if the applicant changes
      },
      {
        type            : Backbone.Many,
        key             : 'repos',
        relatedModel    : GithubRepoModel,
        collectionType  : GithubReposCollection,
        exclude         : true
      },
      {
        type            : Backbone.Many,
        key             : 'notes',
        relatedModel    : NoteModel,
        collectionType  : NotesCollection,
        exclude         : false // we want to save notes to Kinvey any time the applicant is saved
      }
    ]

  });
});