var gh = {
  id: 'Paste your Github API id here',
  secret: '... and the API secret here'
}

function onPostFetch(request, response, modules){
  
  var http = modules.request
    , log = modules.logger
    , async = modules.async
    , user_id = request.entityId
    , user = response.body;
  
  log.info(user);
  
  // only make this request if requesting a single user to avoid
  // hitting rate limits
  if (user_id && user.github) {
    
    log.info("starting github munge");
    
    // fire off the github API requests
    async.parallel([
      
      function (done) {
        log.info("requesting github profile");
        http.get({
          uri: 'https://api.github.com/users/' + user.github + '?client_id=' + gh.id + '&client_secret=' + gh.secret, 
          json: true
        }, function (err, res, body) {
          log.info("github profile:" + 'https://api.github.com/users/' + user.github + '?client_id=' + gh.id + '&client_secret=' + gh.secret);
          done(err, body);
        });
      },
      
      function (done) {
        log.info("requesting github repos");
        http.get({
          uri: 'https://api.github.com/users/' + user.github + '/repos?type=owner&client_id=' + gh.id + '&client_secret=' + gh.secret,
          json: true
        }, function (err, res, body) {
          log.info("github repos back");
          done(err, body);
        });
      }
      
    ], function (err, results) {
      log.info("github data done");
      user.github_profile = results[0];
      user.github_repos = results[1];
      response.complete();
    });
    
  } else {
    
    log.info("batch of applicants requested - forgoing github fetch to avoid rate limiting");
    response.complete();
    
  }
 
}