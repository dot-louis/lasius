angular.module('lasius')
// Replace the resource object created by loopback service generator
// by a cachedResource object to enable offline behavior
// see LoopBackResource in lb-services
.decorator('LoopBackResource',[
  '$delegate',
  '$cachedResource',
  function($delegate, $cachedResource, APP_CONFIG){
    var dontCache = ['esSearch'];
    
    return function(url, params, actions) {

      actions = _.mapValues(actions, function(action, key){
        if(_.includes(dontCache, key))
          action.cache = false;
        return action;
      });

      var resource = $cachedResource(url, url, params, actions);

      resource.prototype.$save = function(success, error) {
        var result = resource.upsert.call(this, {}, this, success, error);
        return result.$promise || result;
      };
      return resource;
    };
  }
])
.config([
    'LoopBackResourceProvider',
    'APP_CONFIG',
    function(LoopBackResourceProvider, APP_CONFIG){
      // Change the URL where to access the LoopBack REST API server
      LoopBackResourceProvider.setUrlBase(APP_CONFIG.API_PATH);
}]);
