define(['kinvey', 'app', 'applicant-model'], function (Kinvey, App, ApplicantModel) {
  "use strict";
  /*
   * ApplicantsCollection
   *
   * A Backbone Collection that holds all our applicants, and fetches them from Kinvey
   */


  return Kinvey.Backbone.Collection.extend({

    url: 'applicants',

    model: ApplicantModel

  });
});