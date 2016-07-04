app.config(function($stateProvider) {
    $stateProvider.state('datasetDetails', {
        url: '/datasetDetails/:datasetId',
        templateUrl: 'js/one-dataset-details/one-dataset-details.html',
        controller: "DatasetDetailsCtrl",
        params: {
            dataset: null,
            rows: null
        }
    });
});

app.controller('DatasetDetailsCtrl', function($scope, $timeout, $state, $stateParams, Session, DatasetFactory, NgTableParams, $localStorage) {
    $localStorage.datasetId = $stateParams.datasetId || $localStorage.datasetId;
    $scope.dataset = $stateParams.dataset || $localStorage.dataset;
    $localStorage.dataset = $scope.dataset;
    $scope.rows = $stateParams.rows || $localStorage.rows;
    $localStorage.rows = $scope.rows;
    $scope.columns = Object.keys($localStorage.rows[0]);
    $scope.tableParams = new NgTableParams({ count: 5 }, {
        dataset: $localStorage.rows,
        counts: [1, 5, 10, 25, 100]
    });

    $scope.addedDataset = false;
    if (Session.user) $scope.user = Session.user;

    $scope.addDataset = function() {
        let domain;
        if ($scope.dataset.metadata) domain = $scope.dataset.metadata.domain;
        DatasetFactory.addDataset($scope.user, $scope.dataset.resource, domain)
            .then(function(data) {
                console.log(data);
                if (data[1]) {
                    $scope.success = true;
                    $scope.message = 'You have successfully added this dataset!';
                }
                else {
                    $scope.success = false;
                    $scope.message = 'You already have this dataset';
                }
                $scope.userDataset=true;
                $scope.addedDataset = true; 
                $timeout(function () {
                    $scope.addedDataset=false;
                }, 2000);
            })
            .catch(); // HANDLE ERRS
    };

    $scope.removeDataset = function () {
        DatasetFactory.removeDataset($localStorage.datasetId, $scope.user)
        .then (function () {
            $state.go('userHome', {userId: $scope.user.id});
        });
    };
});
