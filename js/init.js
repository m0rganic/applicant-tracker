requirejs.config({
  shim: {
    'vendor/backbone': {
      deps: ['vendor/underscore', 'jquery'],
      exports: 'Backbone'
    },
    'vendor/underscore': {
      exports: '_'
    },
    'vendor/backbone-associations': [ "vendor/backbone" ],
    'Kinvey': [ 'vendor/jquery', 'vendor/underscore', 'vendor/backbone' ]
  },
  paths: {
    jquery: [
      "http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min",
      "vendor/jquery"
    ],
    'Kinvey': 'vendor/kinvey'
  }
});

require([
  'jquery',
  'vendor/underscore',
  'vendor/backbone', 
  'vendor/backbone-associations',
  'Kinvey',
  'app', 
  'router'
], function ($, _, Backbone, Associations, Kinvey, App, AppRouter) {



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
  var scrolled = false, 
      checkScrolled;

  checkScrolled = function () {
    var position = $(document).scrollTop();
    if (position <= 1 && scrolled) {
      $(".scrolled").removeClass('scrolled');
      scrolled = false;
    }
    if (position > 1 && !scrolled) {
      $("[data-scrolled]").addClass('scrolled');
      scrolled = true;
    }
  };

  $(document).on('scroll', checkScrolled);
  $(document).on('touchmove', checkScrolled);
  


  /*
   * Kinvey init
   * 
   * Start the connection with Kinvey, and use our app key and secret to authenticate
   */

  window.KINVEY_DEBUG = true;
  Kinvey.init({
    appKey: "kid_VPw-HIphLf",
    appSecret: "b5bf32a8061c40bab22f90c0d37f48c2"
  });
  


  /*
   * Backbone init
   * 
   * Create an instance of our router to use for calling `navigate`, and kick everything off by
   * by starting the Backbone history.
   */

  App.router = new AppRouter();
  Backbone.history.start();

});