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