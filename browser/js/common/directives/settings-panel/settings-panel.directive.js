app.directive('settingsPanel', function(ValidationFactory, GraphFilterFactory, $localStorage) {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/settings-panel/settings-panel.directive.html',
        link: function(scope, element, attributes) {
            $(function() {
                var cp2 = $('#cp2');
                cp2.colorpicker();
                cp2.on('changeColor', function(e) {
                    scope.settings.color = cp2.colorpicker('getValue');
                    scope.showGraphs();
                });
            });
    
            scope.xColumns = scope.allColumns.filter(function(elem){
                
                if (scope.graphType === 'lineGraph') return elem.type === 'number' || elem.type === 'date';
                else if (scope.graphType === 'histogram') return elem.type === 'number' || elem.type === 'string';
                else if (scope.graphType === 'barChart') return elem.type === 'number' || elem.type === 'date' || elem.type === 'string';
                else if (scope.graphType === 'scatterPlot') return elem.type === 'number';
                else if (scope.graphType === 'pieChart') return elem.type === 'string';
            });
            scope.yColumns = scope.allColumns.filter(function(elem){
                return elem.type === 'number';
            });

            scope.fontSizes = [8, 10, 12, 14, 16, 20, 24, 32];
            scope.titleFontSizes = scope.fontSizes.concat([48, 64, 96]);

            scope.downloadGraph = function() {
                saveSvgAsPng(document.querySelector('.graph-container svg'), 'graph.png');
            };

            scope.showGraphs = function () {  
                
                if (scope.graphType === 'lineGraph' || scope.graphType === 'scatterPlot') {
                    GraphFilterFactory.filterLineAndScatterData(scope.seriesx, scope.seriesy, scope.data)
                    .then(function(values) {
                        scope.values = values;
                    });
                }
                else if (scope.graphType === 'histogram') {
                    GraphFilterFactory.filterHistogramData(scope.seriesx, scope.data)
                    .then(function(values) {
                        scope.values = values;
                    });
                }
                else {
                    GraphFilterFactory.filterBarAndPieData(scope.seriesx, scope.seriesy, scope.data)
                    .then(function(values) {
                        scope.values = values;
                    });
                     
                }
                
            };
        }
    };
});

