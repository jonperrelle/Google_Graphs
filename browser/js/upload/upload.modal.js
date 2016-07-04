app.controller('uploadModalInstanceCtrl', function($scope, $uibModal, $uibModalInstance) {

    $scope.submit = function () {
        $uibModalInstance.close($scope.file);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});