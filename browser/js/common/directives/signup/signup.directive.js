app.directive('signupForm', function ($state,$stateParams,AuthService,$localStorage) {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/signup/signup.directive.html',
        scope: { },
        link: function(scope) {
            scope.source = $stateParams.source || null;
        	scope.sendSignup = function (signupInfo) {

                scope.error = null;
                AuthService.signup(signupInfo)
                .then(function () {
                    return AuthService.login({email: signupInfo.email, password: signupInfo.password});
                })
                .then(function (user) {
                    if(scope.source === 'dataset') $state.go('datasetDetails',{datasetId: $localStorage.datasetId});
                    else if (scope.source === 'graph') $state.go('singleGraph');
                    else $state.go('userHome', {userId: user.id});
                })
                .catch(function () {
                    scope.error = 'Invalid signup credentials.';
                });

            };
        }
    };
});