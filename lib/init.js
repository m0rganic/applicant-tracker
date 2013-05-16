require(['backbone', 'app', 'router'], function (Backbone, App, AppRouter) {



  /*
   * UI stuff
   * 
   * this section is for several UI hacks and global listeners
   */

  // simple trick to hide the URL bar - scroll the page 1px once it loads
  $(function () {
    setTimeout(function () {
      window.scrollTo(0,1);
    }, 0);
  });

  // add layering styles when we scroll to any elements tagged with the data-scrolled attr
  var scrolled = false
    , checkScrolled;

  checkScrolled = function () {
    var position = $(document).scrollTop()
    if (position <= 1 && scrolled) {
      $(".scrolled").removeClass('scrolled');
      scrolled = false;
    }
    if (position > 1 && !scrolled) {
      $("[data-scrolled]").addClass('scrolled');
      scrolled = true;
    }
  }

  $(document).on('scroll', checkScrolled);
  $(document).on('touchmove', checkScrolled);
  


  /*
   * Kinvey init
   * 
   * Start the connection with Kinvey, and use our app key and secret to authenticate
   */

  KINVEY_DEBUG = true;
  Kinvey.init({
  appKey: "kid_TTJG8OTzcJ",
  appSecret: "45488ab2f3304fee991ce0c1ab716804",
  })
  


  /*
   * Backbone init
   * 
   * Create an instance of our router to use for calling `navigate`, and kick everything off by
   * by starting the Backbone history.
   */

  App.router = new AppRouter()
  Backbone.history.start()

});