define(['jquery', 'vendor/underscore', 'vendor/backbone', 'app'], function ($, _, Backbone, App) {
  "use strict";
  /*
   * ApplicantDetailView
   *
   * Displays the details for a single Applicant.
   */
  


  return Backbone.View.extend({

    id: "detail",
    className: "screen applicant-detail",
    template: App.getTemplate("applicant-detail"),

    events: {
      "click"                : "captureClick",
      "click #back-to-list"  : "backToList"
    },

    render: function () {
      this.$el.html(this.template(this.model.attributes));
      this.show();
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
        _this.$el.addClass('in');
        var p = $("body").scrollTop();
        $("#main").addClass('drop').css('top', -p).data('p', p);
        if (_.isFunction(cb)) {
          _this.$el.one('transitionend webkitTransitionEnd', cb);
        }
      }, 0);
    },

    hide: function (cb) {
      var _this = this;
      setTimeout(function () {
        _this.$el.removeClass('in');
        $("#main").removeClass('drop').css('top', 'auto');
        $("body").scrollTop($("#main").data('p'));
        if (_.isFunction(cb)) {
          _this.$el.one('transitionend webkitTransitionEnd', cb);
        }
      }, 0);
    },

    remove: function () {
      var _this = this;
      this.hide(function () {
        Backbone.View.prototype.remove.apply(_this);
        App.detail = null;
      });
    }

  });
});