app.factory('serviceFactory', function() {
    return function($resource, url) {
        return $resource(url);
    };
});
