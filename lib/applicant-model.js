(function () {
  "use strict";
  /*
   * ApplicantModel
   * 
   * A Backbone Model that represents a single job application (a person, and the
   * position they are applying for).
   */


  var ApplicantModel = App.ApplicantModel = Backbone.Model.extend({

    fetch: function (options) {
      options.success(this);
    }

  });
}());