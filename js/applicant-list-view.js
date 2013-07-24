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
define([
  'jquery',
  'vendor/underscore',
  'vendor/backbone',
  'app',
  'applicant-list-item-view'
], function ($, _, Backbone, App, ApplicantListItemView) {
  "use strict";
  /*
   * ApplicantListView
   *
   * Displays a collection of Applicants, each one rendered
   * by an ApplicantListItemView. Each one links to the detail
   * view for that applicant.
   */



  return Backbone.View.extend({

    className: 'applicant-list',
    template: App.getTemplate("applicant-list"),
    groupTemplate: App.getTemplate("applicant-list-group"),

    render: function () {
      var positions;

      this.$el.html(this.template());

      positions = this.collection.groupBy('position');
      _.each(positions, _.bind(this.addGroup, this));
      this.$el.addClass('in');
      return this;
    },

    addGroup: function(applicants, position) {
      var groupEl, _this = this;

      groupEl = $(this.groupTemplate({position: position}).replace('\n', ''));
      this.$("#applicant-list").append(groupEl);
      _.each(applicants, function (applicant) {
        _this.addOne(applicant, groupEl);
      });
    },

    addOne: function (applicant, $el) {
      var itemView = new ApplicantListItemView({model: applicant});
      $el.append(itemView.render().el);
    }

  });
});