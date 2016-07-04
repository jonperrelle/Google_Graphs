app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        controller: 'HomeCtrl',
        templateUrl: 'js/home/home.html'
    });
});

app.controller('HomeCtrl', function($scope, QueryFactory, UploadFactory, $state, $uibModal) {

    $scope.uploadFile = function() {
      if ($scope.form.$valid && $scope.file) {
        
      }
    };

    $scope.openFileUpload = function () {

        let modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'upload.modal.html',
            controller: 'uploadModalInstanceCtrl',
            $scope: $scope,
            windowId: 'home'
        });

        modalInstance.result.then(function (file) {
            UploadFactory.uploadFile(file)
            .then(function(dataset) {
                $scope.file = null;
                $state.go('datasetDetails', {datasetId: dataset.fileName, dataset: dataset.dataset ,rows: dataset.data});
            })
        });   
    };

    QueryFactory.getCategories().then(cats => {
        $scope.categories = cats.map(cat => cat.category.toUpperCase());
    });

    $scope.getDatasets = function (cat) {
        QueryFactory.getDatasets(cat).then(dsets => {
            $scope.datasets = dsets;
        });
    };

    $scope.getColumns = function (ds) {
        $scope.columns = QueryFactory.getColumns(ds);
    };

    $scope.getData = function (ds, colArr) {
        QueryFactory.getData(ds, colArr)
        .then(function(data) {
            $scope.graphData = data.graphData;
            $scope.columns = data.columns;
        });
    };
});












      //   <div class="settings-collapse">
      //     <div id="general">
      //       <div class="row">
      //         <div class="form-group col-xs-12">
      //           <label for="title" class="control-label">Title</label>
      //           <div>
      //             <input class="form-control" name="title" type="text" ng-model="graphSettings.title" required>
      //           </div>
      //         </div>
      //       </div>
      //       <div class="row">
      //         <div class="form-group col-xs-4">
      //           <label for="width" class="control-label">Width</label>
      //           <div>
      //             <input class="form-control" name="width" type="number" ng-model="graphSettings.width" required>
      //           </div>
      //         </div>
      //         <div class="form-group col-xs-4">
      //           <label for="height" class="control-label">Height</label>
      //           <div>
      //             <input class="form-control" name="height" type="number" ng-model="graphSettings.height" required>
      //           </div>
      //         </div>
      //         <div class="form-group col-xs-4" ng-show="graphType==='pieChart'">
      //           <label for="radius" class="control-label">Radius</label>
      //           <div>
      //             <input class="form-control" name="radius" type="number" ng-model="graphSettings.radius" required>
      //           </div>
      //         </div>
      //       </div>
      //       <div class="row" ng-hide="graphType==='pieChart'">
      //         <div class="form-group col-xs-12">
      //           <label for="color" class="control-label">Color</label>
      //           <div>
      //             <input colorpicker class="form-control" name="color" ng-model="graphSettings.color" type="text">
      //           </div>
      //         </div>
      //       </div>
      //       <div class="row" ng-show="graphType==='pieChart'">
      //         <div class="form-group col-xs-12">
      //           <label for="color" class="control-label">Color</label>
      //           <div>
      //             <select class="form-control" name="color" type="text" ng-model="graphSettings.color">
      //               <option value="10">Scale 10 Colors</option>
      //               <option value="20a">Scale 20 colors A</option>
      //               <option value="20b">Scale 20 colors B</option>
      //               <option value="20c">Scale 20 colors C</option>
      //             </select>
      //           </div>
      //         </div>
      //       </div>
      //     </div>
      //   </div>
      //   <div>
      //       <button class="btn btn-primary" type="button" ng-click="submit()">OK</button>
      //       <button class="btn btn-warning" type="button" ng-click="cancel()">Cancel</button>
      //   </div>
      // </script>


























