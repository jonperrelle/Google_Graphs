app.config(function($stateProvider) {
    $stateProvider.state('userHome', {
        url: '/users/:userId',
        templateUrl: 'js/user-home/user-home.html',
        controller: "UserHomeCtrl",
        resolve: {
            UserInfo: function($stateParams, UserFactory) {
                return UserFactory.fetchUser($stateParams.userId);
            }
        }
    });
});

app.controller('UserHomeCtrl', function($scope, $state, UploadFactory, Session, DatasetFactory, GraphFactory, UserInfo, GraphFilterFactory, $localStorage) {

    $scope.user = UserInfo.user;
    $scope.datasets = UserInfo.datasets;
    $scope.graphs = UserInfo.graphs;


    $scope.goToUserGraph = function(graph) {
        DatasetFactory.getOneUserDataset(graph.dataset, $scope.user)
            .then(rows => {
                GraphFilterFactory.filterData(graph.seriesx, graph.seriesy, rows)
                .then(function(values) {
                    let allColumns = Object.keys(rows[0]);
                    $state.go('userSingleGraph', { userId: $scope.user.id, graphId: graph.id, dataset: graph.dataset, graphType: graph.graphType, settings: graph.setting, data: rows, seriesx: graph.seriesx, seriesy: graph.seriesy, allColumns: allColumns, values: values });
                });
            })
            .catch();
    };

    $scope.goToDataset = function(dataset) {
        $localStorage.column1 = null;
        $localStorage.column2 = null;

        DatasetFactory.getOneUserDataset(dataset, $scope.user)
            .then(rows => {
                $state.go('userDatasetDetails', { userId: $scope.user.id, datasetId: dataset.id, dataset: dataset, rows: rows });
            });
    };

    $scope.removeDataset = function(dataset) {
        DatasetFactory.removeDataset(dataset, $scope.user)
            .then(function() {
                $scope.datasets = $scope.datasets.filter(ds => ds.id !== dataset.id);
            });
    };

    $scope.removeUserGraph = function(graph) {
        GraphFactory.removeUserGraph(graph.id, $scope.user)
            .then(function() {
                $scope.graphs = $scope.graphs.filter(gr => gr.id !== graph.id);
            });
    };
});
