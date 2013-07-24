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
define(['vendor/underscore', 'vendor/backbone', 'app'], function (_, Backbone, App) {
  "use strict";
  /*
   * NoteListItemView
   *
   * Displays a single Note in a NoteList for an Applicant.
   */



  return Backbone.View.extend({

    tagName: 'li',
    className: 'note',
    template: App.getTemplate("note-list-item"),

    render: function () {
      var data = _.extend({}, this.model.attributes);
      if (!(data.date instanceof Date)) {
        data.date = new Date(data.date);
      }
      this.$el.html(this.template(data));
      return this;
    }

  });
});