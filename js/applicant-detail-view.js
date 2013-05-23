define([
  'jquery',
  'vendor/underscore',
  'vendor/backbone',
  'app',
  'note-list-view'
], function ($, _, Backbone, App, NoteListView) {
  "use strict";
  /*
   * ApplicantDetailView
   *
   * Displays the details for a single Applicant in a "slide-over" screen.
   */
  


  return Backbone.View.extend({

    id: "detail",
    className: "screen applicant-detail",
    template: App.getTemplate("applicant-detail"),

    render: function () {
      this.$el.html(this.template(this.model.attributes));
      // Insert the list of notes attached to this user.
      this.notes = new NoteListView({applicant: this.model});
      this.$("#notes-list").html(this.notes.render().el);
      this.show();
      return this;
    },

    // This `show` function is needed to handle the CSS animations to slide
    // this screen in. Fires the supplied callback once the animations to 
    // show this screen have finished.
    show: function (cb) {
      var _this = this;
      // http://stackoverflow.com/questions/14873031/css-transitions-dont-work-unless-i-use-timeout
      setTimeout(function () {
        // add the transition-in class
        _this.$el.addClass('in');
        // save the scroll position of the applicant list so we can restore it later
        var p = $("body").scrollTop();
        // drop the applicant list back with a scale animation
        $("#main").addClass('drop').css('top', -p).data('p', p);
        $("body").scrollTop(0);
        if (_.isFunction(cb)) {
          _this.$el.one('transitionend webkitTransitionEnd', cb);
        }
      }, 0);
    },

    // Similar to `show` above
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

    // Override the remove function to make sure we run the 
    // closing animations before killing this view.
    remove: function () {
      var _this = this;
      this.hide(function () {
        // JavaScript equivalent of `super` in this case
        Backbone.View.prototype.remove.apply(_this);
        App.detail = null;
      });
    }

  });
});