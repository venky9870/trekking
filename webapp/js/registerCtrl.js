app.controller('registerCtrl', function($scope, $rootScope, $window, $document, $timeout, serviceFactory, $resource) {
    $scope.register = {};
    $rootScope.isSigned = false;

    $rootScope.signOut = function() {
        signOut();
    };

    var appStart = function() {
        console.log("Starting App");
        gapi.load('auth2', initSigninV2);
    };
    /**
     * Initializes Signin v2 and sets up listeners.
     */
    var initSigninV2 = function() {
        console.log("Initializes");
        auth2 = gapi.auth2.init({
            client_id: '',
            scope: 'profile email'
        });

        // var options = new gapi.auth2.SigninOptionsBuilder();
        // options.setAppPackageName('trekking');
        // // options.setFetchBasicProfile('True');
        // options.setPrompt('select_account');
        // options.setScope('profile').setScope('email');
        // Listen for sign-in state changes.
        auth2.isSignedIn.listen(signinChanged);

        // Listen for changes to current user.
        auth2.currentUser.listen(userChanged);

        // Sign in the user if they are currently signed in.
        if (auth2.isSignedIn.get() === true) {
            auth2.signIn(options);
            $rootScope.isSigned = true;
        }
        // Start with the current live values.
        refreshValues();
    };

    /**
     * Listener method for sign-out live value.
     *
     * @param {boolean} val the updated signed out state.
     */
    var signinChanged = function(val) {
        console.log('Signin state changed to ', val);
        if (val === true) {
            $rootScope.isSigned = true;
            $scope.checkRegistration();
        } else {
            $rootScope.isSigned = false;
            window.location.href="#/";
        }
    };

    /**
     * Listener method for when the user changes.
     *
     * @param {GoogleUser} user the updated user.
     */
    var userChanged = function(user) {
        console.log('User now: ', user);
        googleUser = user;
        updateGoogleUser();
    };

    /**
     * Updates the properties in the Google User table using the current user.
     */
    var updateGoogleUser = function() {
        if (googleUser) {
            var profile = googleUser.getBasicProfile();
            if (profile !== undefined) {
                $rootScope.member.name = profile.getName();
                $rootScope.member.userProfilePic = profile.getImageUrl();
                $rootScope.member.email = profile.getEmail();
            } else {
                $rootScope.member = {};
            }
            $rootScope.$emit('loggedInDetails', $rootScope.member);
        }
    };

    /**
     * Retrieves the current user and signed in states from the GoogleAuth
     * object.
     */
    var refreshValues = function() {
        if (auth2) {
            console.log('Refreshing values...');
            googleUser = auth2.currentUser.get();
            console.log(JSON.stringify(googleUser, undefined, 2));
            updateGoogleUser();
        }
    };

    var signIn = function(){
      console.log("calling");
      var options = new gapi.auth2.SigninOptionsBuilder();
      options.setAppPackageName('trekking');
      options.setPrompt('select_account');
      options.setScope('profile').setScope('email');
      auth2.signIn(options);
    };

    var signOut = function() {
        auth2.signOut().then(function() {
            console.log('User signed out.');
            refreshValues();
            if(!$scope.$$phase)
              $scope.$apply();
            $rootScope.isSigned = false;
            $rootScope.member.name = "";
            $rootScope.member.userProfilePic = "";
            $rootScope.member.email = "";
            alert("Logged out Successfuly");
        });
    };
    appStart();

    $scope.signUpWith = function(element) {
      if(!$rootScope.isSignedIn){
          signIn();
      }
    };

    $scope.checkRegistration = function() {
        serviceFactory($resource, '../api/checkRegistration').save({
            'email': googleUser.getBasicProfile().getEmail()
        }, function(data) {
            if (data.membershipid) {
                $rootScope.member.id = data.membershipid;
                window.location.href = "#/member/home";
            }
        }, function() {
            console.log("Unable to save new event");
        });
    };

    $scope.address = function() {
        $scope.register.permanent_address_1 = $scope.register.temp_address_1;
        $scope.register.permanent_address_2 = $scope.register.temp_address_2;
    };

    $scope.register.captcha = function() {
        $scope.showTick = false;
        $scope.register.captchaCode = "";
        var alpha = [];
        alpha = 'aBcDefGhijkLmNopqRstuvWxz'.split('');
        for (var i = 0; i < 6; i++) {
            $scope.register.captchaCode = $scope.register.captchaCode + alpha[Math.floor(Math.random() * alpha.length)] + ' ';
        }
    };

    $scope.register.captcha();

    $scope.register.ValidCaptcha = function(value) {
        $timeout(function() {
            var string1 = removeSpaces($scope.register.captchaCode);
            var string2 = removeSpaces($scope.register.userInput);
            if (string1 == string2)
                $scope.showTick = true;
            else
                $scope.showTick = false;
        }, 1000);
    };


    function removeSpaces(string) {
        return string.split(' ').join('');
    }

    $scope.registerMember = function() {
      $scope.register.name = $rootScope.member.name;
      $scope.register.email = $rootScope.member.email;
      $scope.register.image_url = $rootScope.member.userProfilePic;
        $scope.register.date_of_birth = $scope.register.dob_year + '-' + $scope.register.dob_month + '-' + $scope.register.dob_date;
        serviceFactory($resource, '../api/registerMember').save(JSON.stringify($scope.register), function(data) {
            if (data.records) {
              $rootScope.member.id=data.records.insertId;
              window.location.href="#/member/home";
            }
        }, function() {
            console.log("Unable to register member");
        });
    };

});
