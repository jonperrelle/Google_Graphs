app.directive('addGraph', function(AddGraphFactory, ValidationFactory, $state) {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/graphs/add-graph.directive.html',
        scope: {
            data: "=",
            info: "=",
            columns: "="
        },
        link: function(scope, ele, attrs) {

            scope.assignColumnType = function (col) {
                ValidationFactory.assignColumnType(scope.data, col);
            }; 
        	
            scope.pieEnabled = function(){
                return AddGraphFactory.pieEnabled(scope.column1, scope.column2);
            };

            scope.barEnabled = function(){
                return AddGraphFactory.barEnabled(scope.column1, scope.column2);
            };

            scope.scatterEnabled = function(){
                return AddGraphFactory.scatterEnabled(scope.column1, scope.column2);
            };

            scope.lineEnabled = function(){
                return AddGraphFactory.lineEnabled(scope.column1, scope.column2);
            };

            scope.viewSingleGraph = function (graphType) {
                $state.go('singleGraph', {graphType, data: scope.data, columns: [scope.column1, scope.column2]})
            };

        }
    };
});



 