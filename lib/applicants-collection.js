(function () {
  "use strict";
  /*
   * ApplicantsCollection
   * 
   * A Backbone Collection that holds all our applicants, and fetches them from Kinvey
   */


  var ApplicantsCollection = App.ApplicantsCollection = Backbone.Collection.extend({

    model: App.ApplicantModel,

    fetch: function (options) {
      this.add([
        {
          id: 1,
          name: "Ryan Kahn",
          position: "HTML5 Game Developer"
        },
        {
          id: 2,
          name: "Shubhang Mani",
          position: "DevOps Extraordinaire and Restauranteur"
        }
      ]);
      options.success(this.models);
    }

  });
}());