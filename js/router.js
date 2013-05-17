define([
  'jquery',
  'vendor/backbone',
  'app',
  'applicant-list-view',
  'applicants-collection',
  'login-view',
  'applicant-detail-view',
  'applicant-model'
], function ($, Backbone, App, ApplicantListView, ApplicantsCollection, LoginView, ApplicantDetailView, ApplicantModel) {
  
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



  var hideDetailScreen = function () {
    App.detail.hide(function () {
      App.detail.remove();
      App.detail = null;
    });
  };

   
  return Backbone.Router.extend({

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
      if (App.main instanceof ApplicantListView) {
        hideDetailScreen();
        App.applicants.fetch();
        console.log('reusing list');
      } else {

        var render = function (applicants) {
          var listView = new ApplicantListView({collection: applicants});
          $("#main").html(listView.render().el);
          App.main = listView;
        };

        if (App.applicants) {
          App.applicants.fetch();
          render(App.applicants);
        } else {
          App.applicants = new ApplicantsCollection();
          App.applicants.fetch({
            success: function() {
              render(App.applicants);
            },
            error: function() {
              alert('Unable to retrieve applicant list');
            }
          }); 
        }
      }
    },


    /*
     * Displays the login page
     */
    login: function () {
      var loginView = new LoginView();
      $("#main").html(loginView.render().el);
    },


    /*
     * Takes the id of an applicant, fetches that record, and passes it
     * off to the newly created ApplicantDetailView for display
     */
    applicantDetail: function (id) {
      var render, applicant;

      if (!App.applicants) {
        this.applicantsList();
      }
      applicant = App.applicants.get(id) || new ApplicantModel({_id: id});
      applicant.fetch({
        success: function () {
          App.detail = new ApplicantDetailView({model: applicant});

          $("body").append(App.detail.render().el);
          App.detail.show();

          $(document).one('click', function () {
            var scroll = document.body.scrollTop;
            App.router.navigate("/", {trigger: true});
            document.body.scrollTop = scroll;
          });
        },
        error: function () {
          alert("Unable to retrieve applicant details");
        }
      });
    }

  });
});