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
define(['jquery', 'vendor/underscore'], function($, _) {
  /*
   * This App module acts as a container for state - we'll store the list of applicants
   * on this module, for example.
   */

  return {
    getTemplate: function (id) {
      // trim is necessary thanks to http://stage.jquery.com/upgrade-guide/1.9/#jquery-htmlstring-versus-jquery-selectorstring
      return _.template($.trim($("#" + id + "-template").html()));
    }
  };
});