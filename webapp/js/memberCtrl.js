'use strict;'
app.controller('memberCtrl', function($scope, $rootScope, serviceFactory, $resource) {
    $scope.data = {};

    $scope.data.userProfile = function() {
        if ($rootScope.member.id) {
            serviceFactory($resource, '../api/getMemberDetails/' + $rootScope.member.id).get({}, function(data) {
                if (data.records) {
                    $scope.data.memberLogged = data.records[0];
                }
            }, function() {
                console.log("Unable to save new event");
            });
        }
    };
    $(document).ready(function() {
      if($rootScope.member.id){
        $scope.data.userProfile();
      }else{
        window.location.href = "#/member/register";
      }
    });

    $scope.data.upcomingTreks = function() {
      if($rootScope.member.id){
        $scope.data.getEventDetails();
        $scope.data.registeredTrekList();
      }
    };

    $scope.data.registeredTreks = function() {

    };

    $scope.data.trekHistory = function() {
        $scope.data.addTrekFlag = false;
    };

    $scope.data.newEvent = function() {

    };

    $scope.data.memberManagement = function() {
        if($rootScope.member.id){
              $scope.data.loadAllMembers();
        }
    };


    $scope.data.getEventDetails = function() {
        serviceFactory($resource, '../api/getEventDetails').save(JSON.stringify($scope.createEvent), function(data) {
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
      $scope.data.registeredTrekList = function(){
        serviceFactory($resource, '../api/getRegisteredEvents/'+$rootScope.member.id).get({}, function(data) {
            if (data.records) {
              _.map($scope.data.upcomingTrek,function(d){
                var tmp= _.where(data.records,{'event_id':d.id});
                if(tmp.length>0){
                  d.registeredFlag = true;
                }
              });
            }
        }, function() {
            console.log("Unable to get registered treks");
        });
      };
    // --------------------------------Logged in User--------------------------------------------------

    // --------------------------------Register For Trek ------------------------------------------------

    $scope.data.registerTrek = function(details){
      $scope.data.selectedTrek = details;
      $scope.data.selectedTrek.starting_point = "";
      $scope.data.selectedTrek.membership_id = $rootScope.member.id;
      $('#registerModal').modal('show');
    };

    $scope.data.confirmRegistration = function(){
      serviceFactory($resource, '../api/memberTrekRegistration').save(JSON.stringify($scope.data.selectedTrek), function(data) {
          if (data.records && data.records.insertId) {
              $('#registerModal').modal('hide');
          }
      }, function() {
          console.log("Unable to save new event");
      });
    };

    //  --------------------------------Create Event Functions-------------------------------------------
    $scope.createEvent = {};

    $scope.createEvent.images_content = [{
        "imageurl": ""
    }];
    $scope.createEvent.addImages = function() {
        $scope.createEvent.images_content.push({
            "imageurl": ""
        });
    };
    $scope.createEvent.deleteImages = function(index) {
        $scope.createEvent.images_content = _.without($scope.createEvent.images_content, $scope.createEvent.images_content[index]);
    };
    $scope.createEvent.pre_requisite_content = [{
        "requisite": ""
    }];
    $scope.createEvent.addRequisite = function() {
        $scope.createEvent.pre_requisite_content.push({
            "requisite": ""
        });
    };
    $scope.createEvent.deleteRequisite = function(index) {
        $scope.createEvent.pre_requisite_content = _.without($scope.createEvent.pre_requisite_content, $scope.createEvent.pre_requisite_content[index]);
    };
    $scope.createEvent.today = function() {
        $scope.createEvent.from_date = new Date();
        $scope.createEvent.to_date = new Date();
    };
    $scope.createEvent.today();

    $scope.clear = function(key) {
        $scope.createEvent[key] = null;
    };
    $scope.createEvent.create = function() {
      $("#eventModal").modal('show');
    };
    $scope.createEvent.dateOptions = {
        dateDisabled: false,
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: null,
        startingDay: 1
    };
    $scope.createEvent.open1 = function() {
        $scope.popup1.opened = true;
    };

    $scope.createEvent.open2 = function() {
        $scope.popup2.opened = true;
    };

    $scope.createEvent.popup1 = {
        opened: false
    };

    $scope.createEvent.popup2 = {
        opened: false
    };
    var convertArray = function(json, key) {
        var array = [];
        _.map(json, function(d) {
            array.push(d[key]);
        });
        return array;
    };

    $scope.saveEvent = function() {
        $scope.createEvent.pre_requisite = convertArray($scope.createEvent.pre_requisite_content, 'requisite').join();
        $scope.createEvent.images = convertArray($scope.createEvent.images_content, 'imageurl').join();
        $scope.createEvent.no_of_days = 2;
        serviceFactory($resource, '../api/addEvents').save(JSON.stringify($scope.createEvent), function(data) {
            if (data.records && data.records.insertId) {
                window.location.href = "#/";
            }
        }, function() {
            console.log("Unable to save new event");
        });
    };

    //  --------------------------------End of Create Event Functions-------------------------------------------


    // -------------------------------Trek History Events---- -- ----------------------------------------------------

    $scope.trekHistory = {};

    $scope.trekHistory.popup1 = {
        opened: false
    };
    $scope.trekHistory.popup2 = {
        opened: false
    };
    $scope.trekHistory.open1 = function() {
        $scope.trekHistory.popup1.opened = true;
    };
    $scope.trekHistory.open2 = function() {
        $scope.trekHistory.popup2.opened = true;
    };

    $scope.trekHistory.treks = [{
        "dt": "",
        "org": "",
        "orgName": ""
    }];
    $scope.trekHistory.addTrek = function() {
        $scope.trekHistory.treks.push({
            "dt": "",
            "org": "",
            "orgName": ""
        });
    };

    $scope.closeTrek = function(index) {
        $scope.register.treks.splice(index, 1);
    };


    // ---------------------------------Member Management Functions---------------------------------------------

    $scope.data.loadAllMembers = function() {
        serviceFactory($resource, '../api/getMemberList').get({}, function(data) {
            if (data.records) {
                $scope.data.memberNameList = data.records;
                $scope.data.getMemberDetails($scope.data.memberNameList[0].id);
                $scope.data.selectedMember = $scope.data.memberNameList[0].id;
            }
        }, function() {
            console.log("Unable to save new event");
        });
    };
    $scope.data.getMemberDetails = function(id) {
        serviceFactory($resource, '../api/getMemberDetails/' + id).get({}, function(data) {
            if (data.records) {
                $scope.data.memberDetails = data.records[0];
            }
        }, function() {
            console.log("Unable to save new event");
        });
    };

    //------------------------Event Management -------------------------------------------

    $scope.eventManagement = {};

    $scope.eventManagement.editEvent = function(eventDetails) {
        $scope.createEvent.to_date = new Date('2014-03-08T00:00:00');
        $scope.createEvent.from_date = new Date('2014-03-08T00:00:00');
        $scope.createEvent = eventDetails;
        $scope.createEvent.pre_requisite_content = eventDetails.pre_requisite.split(',').map(function(d) {
            return {
                'requisite': d
            };
        });
        $scope.createEvent.images_content = eventDetails.images.split(',').map(function(d) {
            return {
                'imageurl': d
            };
        });
        $("#eventModal").modal('show');
    };

    $scope.eventManagement.updateEvent = function(eventDetails) {
        serviceFactory($resource, '../api/updateEvent').save({
            eventDetails
        }, function(data) {
            console.log(data);
        }, function() {
            console.log("Unable to save new event");
        });
    };
    $scope.eventManagement.cancelEvent = function(eventDetails) {
        serviceFactory($resource, '../api/cancelEvent/' + eventDetails.id).get({}, function(data) {
            if (data.records) {
                $scope.data.getEventDetails();
            }
        }, function() {
            console.log("Unable to cancel event");
        });
    };
    $scope.eventManagement.completeEvent = function(eventDetails) {
        console.log(JSON.stringify(eventDetails));
        serviceFactory($resource, '../api/completeEvent/' + eventDetails.id).get({}, function(data) {
            if (data.records) {
                $scope.data.getEventDetails();
            }
        }, function() {
            console.log("Unable to complete event");
        });
    };
});
