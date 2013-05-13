(function () {
  "use strict";
  /*
   * AppRouter
   *
   * Our applicant tracking application is fairly simple,
   * with just three routes - the login page, the homepage
   * (which renders the list of applicants), and a detail
   * page showing the specifics of an individual applicant.
   *
   * Each route handler fetches the required data, instantiates
   * the appropriate view, and replaces the current DOM with
   * the new view's element. This works on a smaller scale,
   * but larger apps might want finer controls over the rendering
   * and view-switching process.
   */

   
  var AppRouter = App.AppRouter = Backbone.Router.extend({

    routes: {
      ""               : "applicantsList",
      "login"          : "login",
      "applicants/:id"  : "applicantDetail"
    },


    /*
     * Creates the applicants collection, fetches the data needed,
     * and instantiates a new ApplicantsListView with that data
     */
    applicantsList: function () {
      var applicants = App.applicants || new App.ApplicantsCollection();
      App.applicants = applicants;
      applicants.fetch({
        success: function() {
          var listView = new App.ApplicantListView({collection: applicants});
          $("#main").html(listView.render().el);
        },
        error: function() {
          alert('Unable to retrieve applicant list');
        }
      });
    },


    /*
     * Displays the login page
     */
    login: function () {
      var loginView = new App.LoginView();
      $("#main").html(loginView.render().el);
    },


    /*
     * Takes the id of an applicant, fetches that record, and passes it
     * off to the newly created ApplicantDetailView for display
     */
    applicantDetail: function (id) {
      var applicant = (App.applicants && App.applicants.get(id)) || new App.ApplicantModel({id: id});
      applicant.fetch({
        success: function () {
          var detailView = new App.ApplicantDetailView({model: applicant});
          $("#main").html(detailView.render().el);
        },
        error: function () {
          alert("Unable to retrieve applicant details");
        }
      });
    }

  });
}());