app.config(function ($stateProvider) {
    $stateProvider.state('userHome', {
        url: '/users/:userId',
        templateUrl: 'js/user-home/user-home.html',
        controller:"UserHomeCtrl",
        resolve: {
            UserInfo: function ($stateParams, UserFactory) {
                return UserFactory.fetchUser($stateParams.userId);
            }
        }
    });
});

app.controller('UserHomeCtrl', function ($scope, $state, UploadFactory, Session, DatasetFactory, GraphFactory, UserInfo, $localStorage) {
    
    $scope.user = UserInfo.user;
    $scope.datasets = UserInfo.datasets;
    $scope.graphs = UserInfo.graphs;


    $scope.goToUserGraph = function(graph){
            DatasetFactory.getOneUserDataset(graph.dataset, $scope.user)
            .then(rows => {
                let allColumns = Object.keys(rows[0]);
                $state.go('userSingleGraph', {userId: $scope.user.id, graphId: graph.id, dataset: graph.dataset, graphType: graph.graphType, settings: graph.setting, data: rows, columns: graph.columns, allColumns: allColumns});    
            })
            .catch();
    };

    $scope.goToDataset = function (dataset) {
        $localStorage.column1 = null;
        $localStorage.column2 = null;
        DatasetFactory.getOneUserDataset(dataset, $scope.user)
        .then( rows => {
            if (dataset.socrataId) {
                $state.go('userDatasetDetails', {userId: $scope.user.id, datasetId: dataset.id, dataset: dataset, rows: rows});
            }
            else {
                $state.go('userDatasetDetails', {userId: $scope.user.id, datasetId: dataset.id, dataset: rows.dataset, rows: rows.data});
            }
        });
    };

    $scope.removeDataset = function (dataset) {
        DatasetFactory.removeDataset(dataset, $scope.user)
        .then (function () {
            $scope.datasets = $scope.datasets.filter(ds => ds.id !== dataset.id);
        });
    };

    $scope.removeUserGraph = function (graph) {
        GraphFactory.removeUserGraph(graph.id, $scope.user)
        .then (function () {
            $scope.graphs = $scope.graphs.filter(gr => gr.id !== graph.id);
        });
    };

    $scope.uploadFile = function() {
      if ($scope.form.$valid && $scope.file) {
        UploadFactory.uploadFile($scope.file)
        .then(function(dataset) {
            $scope.file = null;
            $state.go('datasetDetails', {datasetId: dataset.fileName, dataset: dataset.dataset, rows: dataset.data});
        });
      }
    };
});
