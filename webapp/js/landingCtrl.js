app.controller('landingCtrl', function($scope, $timeout, serviceFactory, $resource) {
    $scope.data = {};

    $scope.data.getEventDetails = function() {
        serviceFactory($resource, '../api/getEventDetails').get({}, function(data) {
            if (data.records) {
                $scope.data.upcomingTrek = _.where(data.records, {
                    'status': 'Not Completed'
                });
                $scope.data.completedTrek = _.where(data.records, {
                    'status': 'Completed'
                });
                $scope.data.rpTrekList = data.records;
            }
        }, function() {
            console.log("Unable to save new event");
        });
    };
    $scope.data.getEventDetails();
    $(document).ready(function() {
        $timeout(function() {
            $('.image').slick({
                dots: true,
                infinite: true,
                speed: 300,
                slidesToShow: 1,
                adaptiveHeight: true,
                autoplay: true,
                autoplaySpeed: 3000,
                fade: true,
                cssEase: 'linear'
            });
        }, 1000);
    });
});
