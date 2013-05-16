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

    id: "detail",
    className: "detail-screen applicant-detail",
    template: App.getTemplate("applicant-detail"),

    events: {
      "click"                : "captureClick",
      "click #back-to-list"  : "backToList"
    },

    render: function () {
      this.$el.html(this.template(this.model.attributes));
      return this;
    },

    captureClick: function (e) {
      e.stopPropagation();
    },

    backToList: function () {
      App.router.navigate("/", {trigger: true});
    },

    show: function (cb) {
      var _this = this;
      setTimeout(function () {
        _this.$el.addClass('active');
        if (_.isFunction(cb)) {
          _this.$el.one('transitionend webkitTransitionEnd', cb);
        }
      }, 0);
    },

    hide: function (cb) {
      var _this = this;
      setTimeout(function () {
        _this.$el.removeClass('active');
        if (_.isFunction(cb)) {
          _this.$el.one('webkitTransitionEnd transitionend', cb);
        }
      }, 0);
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

    className: 'applicant',
    template: App.getTemplate("applicant-list-item"),

    events: {
      "click"  : "showDetails"
    },

    render: function () {
      this.$el.html(this.template(this.model.attributes));
      return this;
    },

    showDetails: function (e) {
      if (!App.detail) {
        App.router.navigate("/applicants/" + this.model.id, {trigger: true});
        e.stopPropagation();
      }
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

    className: 'applicant-list',
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


  var ApplicantModel = App.ApplicantModel = Kinvey.Backbone.Model.extend({

    urlRoot: 'applicants',

    relations: [
      {
        type          : Backbone.One,
        key           : 'github_profile',
        relatedModel  : App.GithubProfileModel,
        exclude       : true  // in this case, we don't want to try saving the github profile if the applicant changes
      },
      {
        type            : Backbone.Many,
        key             : 'repos',
        relatedModel    : App.GithubRepoModel,
        collectionType  : App.GithubReposCollection,
        exclude         : true
      },
      {
        type            : Backbone.Many,
        key             : 'notes',
        relatedModel    : App.NoteModel,
        collectionType  : App.NotesCollection,
        exclude         : false // we want to save notes to Kinvey any time the applicant is saved
      }
    ]

  });
}());
(function () {
  "use strict";
  /*
   * ApplicantsCollection
   * 
   * A Backbone Collection that holds all our applicants, and fetches them from Kinvey
   */


  var ApplicantsCollection = App.ApplicantsCollection = Kinvey.Backbone.Collection.extend({

    url: 'applicants',

    model: App.ApplicantModel

  });
}());
(function () {
  "use strict";
  /*
   * GithubProfileModel
   * 
   * A Backbone Model that represents a person's Github profile
   */


  var GithubProfileModel = App.GithubProfileModel = Kinvey.Backbone.Model.extend({

    urlRoot: 'github-profiles'

  });
}());
(function () {
  "use strict";
  /*
   * GithubRepoModel
   * 
   * A Backbone Model that represents a Github repo
   */


  var GithubRepoModel = App.GithubRepoModel = Kinvey.Backbone.Model.extend({

    urlRoot: 'github-repos'

  });
}());
(function () {
  "use strict";
  /*
   * GithubReposCollection
   * 
   * A Backbone Collection that represents a collection of Github repos
   */


  var GithubReposCollection = App.GithubReposCollection = Kinvey.Backbone.Collection.extend({

    url: 'github-repos'

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
   * NoteModel
   * 
   * A Backbone Model that represents a Github repo
   */


  var NoteModel = App.NoteModel = Kinvey.Backbone.Model.extend({

    urlRoot: 'notes'

  });
}());
(function () {
  "use strict";
  /*
   * NotesCollection
   * 
   * A Backbone Collection that represents a collection of Github repos
   */


  var NotesCollection = App.NotesCollection = Kinvey.Backbone.Collection.extend({

    url: 'notes'

  });
}());
(function () {
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
      if (App.main instanceof App.ApplicantListView) {
        hideDetailScreen();
        App.applicants.fetch();
        console.log('reusing list');
      } else {

        var render = function (applicants) {
          var listView = new App.ApplicantListView({collection: applicants});
          $("#main").html(listView.render().el);
          App.main = listView;
        };

        if (App.applicants) {
          App.applicants.fetch();
          render(App.applicants);
        } else {
          App.applicants = new App.ApplicantsCollection();
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
      var loginView = new App.LoginView();
      $("#main").html(loginView.render().el);
    },


    /*
     * Takes the id of an applicant, fetches that record, and passes it
     * off to the newly created ApplicantDetailView for display
     */
    applicantDetail: function (id) {
      var render, applicant;

      render = function (applicant) {
        var p;
        
        App.detail = new App.ApplicantDetailView({model: applicant});

        $("body").append(App.detail.render().el);
        App.detail.show();

        $(document).one('click', function () {
          var scroll = document.body.scrollTop;
          App.router.navigate("/", {trigger: true});
          document.body.scrollTop = scroll;
        });

      };

      if (App.applicants && App.applicants.get(id)) {
        render(App.applicants.get(id));
      } else {
        this.applicantsList();
        applicant = new App.ApplicantModel({_id: id});
        applicant.fetch({
          success: function () {
            render(applicant);
          },
          error: function () {
            alert("Unable to retrieve applicant details");
          }
        });
      }
    }

  });
}());