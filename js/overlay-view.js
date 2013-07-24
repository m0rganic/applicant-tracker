/**
 * Copyright 2013 Kinvey, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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