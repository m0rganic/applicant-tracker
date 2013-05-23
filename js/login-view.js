define(['vendor/backbone', 'Kinvey', 'app'], function (Backbone, Kinvey, App) {
  "use strict";
  /*
   * LoginView
   *
   * Allows the user to login using their user credentials. Because
   * this app contains sensitive data, we don't allow user registration
   * through the app itself - users must be setup previously by the
   * administrator using the Kinvey management console. This is enforced
   * by setting the user permissions to "Read Only" using the Kinvey
   * web console (under Addons -> Users -> Settings -> Permissions).
   */
  


  return Backbone.View.extend({

    id: "login",
    template: App.getTemplate("login"),

    events: {
      "submit"  : "login"
    },

    render: function () {
      this.$el.html(this.template());
      return this;
    },

    login: function (e) {
      var _this = this;

      // On submit, attempt to login with the supplied credentials
      App.user = new Kinvey.Backbone.User();
      App.user.login(this.$("#email").val(), this.$("#password").val(), {
        success: function () {
          // Yay! We were able to login, so run the originally requested route function
          _this.options.complete.apply(App.router);
        },
        error: function () {
          alert('Invalid email or password');
        }
      });
      return false;
    }

  });
});