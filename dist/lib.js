/*
 * js-sample-app
 * v0.1.0
 * Copyright (c) 2013 Dave Wasmer
 * Licensed under MIT
 */
(function () {
  "use strict";
  /*
   * ApplicantDetailView
   *
   * Displays the details for a single Applicant.
   */
  


  var ApplicantDetailView = App.ApplicantDetailView = Backbone.View.extend({

    template: App.getTemplate("applicant-detail"),

    events: {
      "click #back-to-list"  : "backToList"
    },

    render: function () {
      this.$el.html(this.template(this.model.attributes));
      return this;
    },

    backToList: function () {
      App.router.navigate("/", {trigger: true});
    }

  });
}());
(function () {
  "use strict";
  /*
   * ApplicantListItemView
   *
   * Displays a single Applicant for a list, which links to the
   * detail view for that Applicant.
   */
  


  var ApplicantListItemView = App.ApplicantListItemView = Backbone.View.extend({

    template: App.getTemplate("applicant-list-item"),

    events: {
      "click"  : "showDetails"
    },

    render: function () {
      this.$el.html(this.template(this.model.attributes));
      return this;
    },

    showDetails: function () {
      App.router.navigate("/applicants/" + this.model.id, {trigger: true});
    }

  });
}());
(function () {
  "use strict";
  /*
   * ApplicantListView
   *
   * Displays a collection of Applicants, each one rendered
   * by an ApplicantListItemView. Each one links to the detail
   * view for that applicant.
   */
  


  var ApplicantListView = App.ApplicantListView = Backbone.View.extend({

    template: App.getTemplate("applicant-list"),

    render: function () {
      this.$el.html(this.template());
      this.collection.each(this.addOne, this);
      return this;
    },

    addOne: function (applicant) {
      var itemView = new App.ApplicantListItemView({model: applicant});
      this.$("#applicant-list").append(itemView.render().el);
    }

  });
}());
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
(function () {
  "use strict";
  /*
   * LoginView
   *
   * Allows the user to login using their user credentials. Because
   * this app contains sensitive data, we don't allow user registration
   * through the app itself - users must be setup previously by the
   * administrator using the Kinvey management console.
   */
  


  var LoginView = App.LoginView = Backbone.View.extend({

    template: App.getTemplate("login"),

    events: {
      "submit"  : "login"
    },

    render: function () {
      this.$el.html(this.template());
      return this;
    },

    submit: function () {
      // Do login-y stuff here
      setTimeout(function () {
        App.router.navigate('/', {trigger: true});
      }, 50);
    }

  });
}());
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