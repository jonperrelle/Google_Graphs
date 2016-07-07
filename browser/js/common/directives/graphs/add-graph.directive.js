app.directive('addGraph', function(AddGraphFactory, ValidationFactory, DataFactory, $state, $localStorage) {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/graphs/add-graph.directive.html',
        scope: {
            data: "=",
            info: "=",
            columns: "="
        },
        link: function(scope, ele, attrs) {
            scope.zSeries = [];
            scope.ySeries = [];
            scope.settings = {};
            // scope.column1 = $localStorage.column1;
            // scope.column2 = $localStorage.column2;
            
            scope.assignColumnType = function (col) {
                ValidationFactory.assignColumnType(scope.data, col);
                //console.log(scope.xSeries)
                // $localStorage.column1 = scope.column1;
                // $localStorage.column2 = scope.column2;
            }; 
        	
            scope.pieEnabled = function(){
                return AddGraphFactory.pieEnabled(scope.data, scope.column1, scope.column2);
            };

            scope.barEnabled = function(){
                return AddGraphFactory.barEnabled(scope.data, scope.column1, scope.column2);
            };

            scope.scatterEnabled = function(){
                return AddGraphFactory.scatterEnabled(scope.column1, scope.column2);
            };

            scope.lineEnabled = function(){
                return true;
                //return AddGraphFactory.lineEnabled(scope.column1, scope.column2);
            };

            scope.viewSingleGraph = function (graphType) {
                $state.go('singleGraph', {graphType, data: scope.data, columns: [scope.column1, scope.column2], settings: scope.settings, allColumns: scope.columns});
            };

            scope.withinLength = function(){
                let groupedData = DataFactory.groupByCategory(scope.data, scope.column1.name, scope.column2.name, 'total');
                return DataFactory.withinLength(groupedData, scope.column1.name, 30);
            };

        }
    };
});



 
