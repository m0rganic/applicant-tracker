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
    'Kinvey': [
      'http://da189i1jfloii.cloudfront.net/js/kinvey-backbone-1.0.0-beta',
      'vendor/kinvey'
    ]
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
  


  /*
   * Kinvey init
   * 
   * Start the connection with Kinvey, and use our app key and secret to authenticate
   */

  window.KINVEY_DEBUG = true;
  Kinvey.init({
    appKey: "kid_VPw-HIphLf",
    appSecret: "b5bf32a8061c40bab22f90c0d37f48c2"
  })
  .then(function (activeUser) {
    // the Kinvey.init function returns a promise which resolves to the active user
    // data (or null if there is no active user). Note: when logged in, activeUser 
    // here is *not* an instance of Kinvey.Backbone.User, but just the attributes of
    // the user. You must instantiate the User yourself (to allow for custom subclasses). 
    App.user = new Kinvey.Backbone.User(activeUser);

    /*
     * Backbone init
     * 
     * Create an instance of our router to use for calling `navigate`, and kick everything off by
     * by starting the Backbone history. We hold off on this until the active user state is resolved
     * so we know whether the user is logged in or not.
     */

    App.router = new AppRouter();
    Backbone.history.start();

  });

});