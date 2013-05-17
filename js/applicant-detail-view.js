define(['vendor/underscore', 'vendor/backbone', 'app'], function (_, Backbone, App) {
  "use strict";
  /*
   * ApplicantDetailView
   *
   * Displays the details for a single Applicant.
   */
  


  return Backbone.View.extend({

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
        $("#main").addClass('inactive');
        if (_.isFunction(cb)) {
          _this.$el.one('transitionend webkitTransitionEnd', cb);
        }
      }, 0);
    },

    hide: function (cb) {
      var _this = this;
      setTimeout(function () {
        _this.$el.removeClass('active');
        $("#main").removeClass('inactive');
        if (_.isFunction(cb)) {
          _this.$el.one('webkitTransitionEnd transitionend', cb);
        }
      }, 0);
    }

  });
});