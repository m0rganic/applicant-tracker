(function () {
  "use strict";




  /*
   * window.App
   *
   * This is our global application namespace, and acts as the
   * container for our Router instance.
   */
  App = window.App = {};




  /*
   * getTemplate
   *
   * A quick helper function to extract a template out of the DOM and
   * compile it into a template function.
   *
   */
  App.getTemplate = function (id) {
    return _.template($("#" + id + "-template").html());
  };




}());