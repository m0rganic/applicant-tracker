define(['jquery', 'vendor/backbone', 'app'], function ($, Backbone, App) {
  "use strict";
  /*
   * OverlayView
   *
   * Shows a loading overlay - used for UI feedback when the network is a bit slow.
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