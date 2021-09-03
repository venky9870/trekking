app.controller('eventListCtrl', function($scope, serviceFactory, $resource) {
    $scope.data = {};

    serviceFactory($resource, '../api/getEventDetails').save(JSON.stringify($scope.createEvent), function(data) {
        if (data.records) {
            $scope.data.upcomingTrek = _.where(data.records, {
                'status': 'Not Completed'
            });
            $scope.data.completedTrek = _.where(data.records, {
                'status': 'Completed'
            });
        }
    }, function() {
        console.log("Unable to save new event");
    });
});

