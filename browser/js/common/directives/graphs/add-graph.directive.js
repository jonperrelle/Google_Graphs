app.directive('addGraph', function(ValidationFactory, GraphFilterFactory, $state, $localStorage) {
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
            
            scope.increaseCount = function () {
                scope.count++;
            };

            scope.decreaseCount = function () {
                scope.count--;
            };

        
            scope.showGraphs = function () {  

                if ((scope.seriesx[0].type === 'number' || scope.seriesx[0].type === 'string') && scope.seriesy.length === 0) {
                    scope.lineEnable = false;
                    scope.pieEnable = false;
                    scope.scatterEnable = false;
                    scope.barEnable = false;
                    GraphFilterFactory.filterHistogramData(scope.seriesx, scope.data)
                    .then(function (histogramValues) {

                        scope.histogramvalues = histogramValues;
                        scope.histogramEnable = true;
                    });
                }
               
                else if (scope.seriesx.length > 0 && scope.seriesy.length > 0 ) {
                    scope.histogramEnable = false;

                    GraphFilterFactory.filterLineAndScatterData(scope.seriesx, scope.seriesy, scope.data)
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
                                GraphFilterFactory.filterBarAndPieData(scope.seriesx, scope.seriesy, scope.data)
                                .then(function(barValues) {
                                    scope.barvalues = barValues;
                                    scope.barEnable = true;
                                });
                        }

                        else if (scope.seriesy.length > 0 && scope.seriesx[0].type === 'number' && scope.seriesy[0].type === 'number' ) {
                                scope.scatterEnable = true;
                                scope.lineEnable = true;
                                scope.pieEnable = false;
                                GraphFilterFactory.filterBarAndPieData(scope.seriesx, scope.seriesy, scope.data)
                                .then(function(barValues) {
                                    scope.barvalues = barValues;
                                    scope.barEnable = true;
                                });
                        }

                        else if (scope.seriesy.length > 0 && scope.seriesx[0].type === 'string' && scope.seriesy[0].type === 'number' ) {
                                scope.scatterEnable = false;
                                scope.lineEnable = false;
                                GraphFilterFactory.filterBarAndPieData(scope.seriesx, scope.seriesy, scope.data)
                                .then(function(barValues) {
                                    if (barValues.length > 30) scope.withinLength = false;
                                    scope.barvalues = barValues;
                                    scope.barEnable = true;
                                    scope.pieEnable = scope.seriesy.length === 1;
                                });    
                        }
                    });
                }
            };

            scope.viewSingleGraph = function (graphType) {
                let sendValues;
                if (graphType === 'histogram') sendValues = scope.histogramvalues;
                else if (graphType === 'barChart' || graphType === 'pieChart') sendValues = scope.barvalues;
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



 
