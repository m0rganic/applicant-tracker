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