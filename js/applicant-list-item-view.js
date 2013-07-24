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
define(['vendor/backbone', 'app'], function (Backbone, App) {
  "use strict";
  /*
   * ApplicantListItemView
   *
   * Displays a single Applicant for a list, which links to the
   * detail view for that Applicant.
   */



  return Backbone.View.extend({

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
      App.router.navigate("/applicants/" + this.model.id, {trigger: true});
    }

  });
});