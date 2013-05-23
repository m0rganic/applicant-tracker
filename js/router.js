define([
  'jquery',
  'vendor/backbone',
  'Kinvey',
  'app',
  'applicant-list-view',
  'applicants-collection',
  'login-view',
  'applicant-detail-view',
  'applicant-model',
  'overlay-view'
], function ($, Backbone, Kinvey, App, ApplicantListView, ApplicantsCollection, LoginView, ApplicantDetailView, ApplicantModel, OverlayView) {
  
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



  // Ensures that the user is logged in before proceeding with the
  // `originalRoute`.
  var ensureLogin = function(originalRoute) {
    return function () {
      if (App.user && App.user.isLoggedIn()) {
        originalRoute.apply(this, arguments);
      } else {
        // Make sure we aren't already showing the login view
        if (!(App.main instanceof LoginView)) {
          App.main = new LoginView({complete: originalRoute});
          $("#main").html(App.main.render().el);
        }
      }
    };
  };



   
  return Backbone.Router.extend({

    routes: {
      ""               : "applicantsList",
      "applicants/:id"  : "applicantDetail"
    },


    /*
     * Creates the applicants collection, fetches the data needed,
     * and instantiates a new ApplicantsListView with that data
     */
    applicantsList: ensureLogin(function () {

      // If the user views an applicant and then hits back, we will
      // already have the list populated and ready, so re-fetch in the
      // background, but show what's in the DOM immediately
      if (App.main instanceof ApplicantListView) {

        App.detail.remove();
        App.applicants.fetch();

      // Otherwise, we don't have the list ready to go, so build it
      // out for the first time
      } else {
        var overlay, overlayTimeout;

        // Create our Kinvey backed collection of applicants, and store
        // it on the App global so we can reuse the data later on.
        App.applicants = new ApplicantsCollection();

        // If the loading takes a while over the slower mobile connection,
        // we'll show a "loading" overlay screen. But if it's a fast
        // connection, we don't want it flickering on with every click. So
        // we set it on a timer, which we can clear later if the data returns
        // fast enough.
        overlayTimeout = setTimeout(function () {
          overlay = new OverlayView({
            title: 'loading ...',
            loading: true
          });
        }, 200);

        // Fetch the data from Kinvey
        App.applicants.fetch({

          success: function() {

            // `overlay` will be defined if the overlayTimeout fired, meaning
            // the request is took longer. Now that it is complete, we need to
            // remove the overlay view.
            if (overlay) {
              overlay.remove();
            // `overlay` isn't defined, which means the request completed in less
            // than the overlayTimeout length. Clear the timeout to make sure 
            // we don't show the overlay after everything is done!
            } else {
              clearTimeout(overlayTimeout);
            }

            // Create a list view based on the applicants collection, which now
            // has data from Kinvey
            var listView = new ApplicantListView({collection: App.applicants});

            // Insert it into the main screen container
            $("#main").html(listView.render().el);

            // Store it for later use
            App.main = listView;

          },

          error: function() {
            // Same as above
            if (overlay) {
              overlay.remove();
            } else {
              clearTimeout(overlayTimeout);
            }
            // Ideally there would be some better error handling than an alert :)
            alert('Unable to retrieve applicant list');
          }
        }); 
      }
    }),


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
    applicantDetail: ensureLogin(function (id) {
      var render, applicant, overlay, overlayTimeout;

      // If `App.applicants` is not defined, it means the user directly
      // loaded (or refreshed) this URL. So run the `applicantsList` route
      // first to build the list in the background. Even though it makes
      // async data requests, we don't need the data to render this view
      // now (we just want the list to exist in the background), so we 
      // continue on immediately.
      if (!App.applicants) {
        this.applicantsList();
      }

      // Create a new applicant model. We've setup some business logic on
      // our Kinvey backend to append Github profile data to an applicant's
      // record whenever that record is retrieved individually. This lets
      // us keep the list view snappy (rather than waiting for a Github API
      // request to return for each applicant in the list), and avoids
      // pounding the API and hitting the rate limit. We don't need the Github
      // data to display the list view anyway.
      applicant = new ApplicantModel({_id: id});

      // Show an overlay if the loading takes too long. See the `applicantsList`
      // route handler for a more detailed explanation
      overlayTimeout = setTimeout(function () {
        overlay = new OverlayView({
          title: 'loading ...',
          loading: true
        });
      }, 200);

      // Fetch the applicant data (along with Github profile) from Kinvey
      applicant.fetch({

        success: function () {

          // Remove the overlay
          if (overlay) {
            overlay.remove();
          } else {
            clearTimeout(overlayTimeout);
          }

          // Create the detail view based on our applicant model
          App.detail = new ApplicantDetailView({model: applicant});

          // Add it to the <body> element
          $("body").append(App.detail.render().el);

        },

        error: function () {
          if (overlay) {
            overlay.remove();
          } else {
            clearTimeout(overlayTimeout);
          }
          alert("Unable to retrieve applicant details");
        }
      });
    })

  });
});