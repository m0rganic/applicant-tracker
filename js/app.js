define(['jquery', 'vendor/underscore'], function($, _) {
  return {
    getTemplate: function (id) {
      return _.template($("#" + id + "-template").html());
    }
  };
});