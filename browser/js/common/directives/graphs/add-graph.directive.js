app.directive('addGraph', function($rootScope, AddGraphFactory, ValidationFactory, DataFactory, GraphFilterFactory, $state, $localStorage) {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/graphs/add-graph.directive.html',
        scope: {
            data: "=",
            info: "=",
            columns: "="
        },
        link: function(scope, ele, attrs) {
            scope.seriesx = [];
            scope.seriesy = [];
            
            scope.settings = {};
            scope.count = 0;
            scope.assignedColumns = ValidationFactory.assignColumnNameAndType(scope.data, scope.columns);
            
            scope.counter = function () {
                scope.count++;
            };

        
            scope.showGraphs = function () {  

                GraphFilterFactory.filterData(scope.seriesx, scope.seriesy, scope.data)
                .then(function(values) {
                    scope.values = values;
                    // $localStorage.values = scope.values;
                    // $localStorage.seriesx = scope.seriesx;
                    // $localStorage.seriesy = scope.seriesy;
                    scope.withinLength = true;
                    if (scope.seriesy.length > 0 && scope.seriesx[0].type === 'date' && scope.seriesy[0].type === 'number' ) {
                            scope.lineEnable = true;
                            scope.pieEnable = false;
                            scope.scatterEnable = false;
                            GraphFilterFactory.filterBarData(scope.seriesx, scope.seriesy, scope.data)
                            .then(function(barValues) {
                                scope.barvalues = barValues;
                                scope.barEnable = true;
                            });

                        }
                    else if (scope.seriesy.length > 0 && scope.seriesx[0].type === 'number' && scope.seriesy[0].type === 'number' ) {
                            scope.scatterEnable = true;
                            scope.lineEnable = true;
                            scope.pieEnable = false;
                            GraphFilterFactory.filterBarData(scope.seriesx, scope.seriesy, scope.data)
                            .then(function(barValues) {
                                scope.barvalues = barValues;
                                scope.barEnable = true;
                            });

                    }

                    else if (scope.seriesy.length > 0 && scope.seriesx[0].type === 'string' && scope.seriesy[0].type === 'number' ) {
                            scope.scatterEnable = false;
                            scope.lineEnable = false;
                            GraphFilterFactory.filterBarData(scope.seriesx, scope.seriesy, scope.data)
                            .then(function(barValues) {
                                if (barValues.length > 30) scope.withinLength = false;
                                scope.barvalues = barValues;
                                scope.barEnable = true;
                                scope.pieEnable = true;
                            });
                        
                    }
                });
                
            };

            scope.viewSingleGraph = function (graphType) {
                let sendValues;
                if (graphType === 'barChart' || graphType === 'pieChart') sendValues = scope.barvalues;
                else sendValues = scope.values;
                $state.go('singleGraph', {graphType, data: scope.data, 
                    values: sendValues, 
                    seriesx: scope.seriesx, 
                    seriesy: scope.seriesy, 
                    settings: scope.settings, 
                    allColumns: scope.assignedColumns});
            };

        }
    };
});



 
