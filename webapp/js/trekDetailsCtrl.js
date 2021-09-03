app.controller('trekDetailsCtrl', function($scope, $routeParams, serviceFactory, $resource) {
    $scope.data = {};
    var splitArray = function(data) {
        return data.split(',').map(function(item) {
            return item;
        });
    };
    serviceFactory($resource, '../api/getEventDetails/' + $routeParams.trekID).get({}, function(data) {
        if (data.records) {
            $scope.data.trekDetails = data.records[0];
            $scope.data.trekDetails.pre_requisite_content = splitArray($scope.data.trekDetails.pre_requisite);
            $scope.data.trekDetails.images_content = splitArray($scope.data.trekDetails.images);
        } else {
            $scope.data.trekDetails = [];
        }
    }, function() {
        console.log("Unable to save new event");
    });
    $(document).ready(function() {
        $('.imageDetails').slick({
            centerMode: true,
            centerPadding: '80px',
            slidesToShow: 3
        });
    });
});
