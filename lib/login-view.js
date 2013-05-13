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