define({
  getTemplate: function (id) {
    return _.template($("#" + id + "-template").html());
  }
});