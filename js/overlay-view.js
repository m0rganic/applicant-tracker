define(['jquery', 'vendor/backbone', 'app'], function ($, Backbone, App) {
  "use strict";
  /*
   * LoginView
   *
   * Allows the user to login using their user credentials. Because
   * this app contains sensitive data, we don't allow user registration
   * through the app itself - users must be setup previously by the
   * administrator using the Kinvey management console.
   */
  


  return Backbone.View.extend({

    className: 'overlay',
    template: App.getTemplate("overlay"),

    events: {
      "submit"  : "login"
    },

    initialize: function () {
      $("body").append(this.el);
      this.render();
    },

    render: function () {
      var _this = this;

      this.$el.html(this.template(this.options)).show();
      setTimeout(function () {
        _this.$el.addClass('active');
      }, 0);
      return this;
    }

  });
});