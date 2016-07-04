app.directive('barChart', function(d3Service, $window, DataFactory) {
    return {
        restrict: 'E',
        scope: {
            rows: "=",
            columns: "=",
            settings: "="
        },
        link: function(scope, ele, attrs) {
            d3Service.d3().then(function(d3) {
                // Browser onresize event
                window.onresize = function() {
                    scope.$apply();
                };

                // Watch for resize event
                scope.$watch(function() {
                    return angular.element($window)[0].innerWidth;
                }, function() {
                    scope.render();
                });

                scope.$watch(function(scope) {
                    return scope.settings;
                }, function() {
                    scope.render();
                }, true);

                scope.$watch(function (scope) {
                  return scope.columns;
                }, function () {
                  scope.render();
                },true);
                
                scope.render = function() {
                    if (!scope.columns) return;

                    let filteredData = scope.rows.filter(obj => obj[scope.columns[0].name] 
                        && obj[scope.columns[1].name]
                        && (!!Number(obj[scope.columns[1].name]) || Number(obj[scope.columns[1].name]) === 0));

                    let groupType = scope.settings.groupType || 'total';
                    let groupedData = DataFactory.groupByCategory(filteredData, scope.columns[0].name, scope.columns[1].name, groupType);
                    groupedData = DataFactory.orderByCategory(groupedData, scope.columns[0].name, scope.columns[0].type);
                    

                    let anchor = d3.select(ele[0])
                    anchor.selectAll('*').remove();

                    let xLabelLength = groupedData.reduce(function (prev, current) {
                            let currentLength = current[scope.columns[0].name].toString().length;
                            return currentLength > prev ? currentLength : prev;
                        }, 0),
                        yLabelLength = groupedData.reduce(function (prev, current) {
                            let currentLength = Math.floor(current[scope.columns[1].name]).toString().length;
                            return currentLength > prev ? currentLength : prev;
                        }, 0);

                    let formatColX = scope.columns[0].name.replace(/\_+/g, " "),
                        formatColY = scope.columns[1].name.replace(/\_+/g, " "),
                        margin = {
                        top: 30,
                        right: 20,
                        bottom: (xLabelLength + 6) * 5,
                        left: (yLabelLength + 6) * 7
                    },
                        width = scope.settings.width || ele[0].parentNode.offsetWidth,
                        height = scope.settings.height || width,
                        xAxisLabel = scope.settings.xAxisLabel || formatColX,
                        yAxisLabel = scope.settings.yAxisLabel || formatColY,
                        title = scope.settings.title || formatColX + ' vs. ' + formatColY,
                        barSpace = 0.1;

                    let svg = anchor
                        .append('svg')
                        .style('width', width)
                        .style('height', height)
                        .style('background-color', '#ffffff')
                        .style('border-radius', '10px')
                        .append("g");

                    //create the rectangles for the bar chart
                    let x = d3.scale.ordinal()
                        .rangeRoundBands([0, width - margin.left -margin.right], barSpace);

                    let y = d3.scale.linear()
                        .range([height - margin.bottom, margin.top]);

                    let xAxis = d3.svg.axis()
                        .scale(x)
                        .orient("bottom");

                    let yAxis = d3.svg.axis()
                        .scale(y)
                        .orient("left");

                    let color = scope.settings.color || d3.scale.category10(),
                        minY = (typeof scope.settings.minY === 'number') ? scope.settings.minY : 0,
                        maxY = (typeof scope.settings.maxY === 'number') ? scope.settings.maxY : d3.max(groupedData, function(d) {
                            return +d[scope.columns[1].name]; });

                    x.domain(groupedData.map(function(d) {
                        return d[scope.columns[0].name]; }));

                    // y.domain([0, d3.max(groupedData, function(d) { return +d[scope.columns[1].name]; })]);
                    y.domain([minY, maxY]);

                    svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(" + margin.left + ", " + (height - margin.bottom) + ")")
                        .call(xAxis)
                        .append("text")
                        .attr("class", "xlabel")
                        .text(xAxisLabel);

                    console.log(xLabelLength)
                    svg.selectAll(".x text")
                        .attr("transform", "translate(" + -(xLabelLength * 2) + "," + (xLabelLength * 2) + ")rotate(-45)")

                    svg.select(".xlabel")
                         .attr("transform", "translate(" + (width - margin.left - margin.right) / 2 + ", " + (margin.bottom - 10) + ")");

                    svg.append("g")
                        .attr("class", "y axis")
                        .attr("transform", "translate(" + margin.left + ",0)")
                        .call(yAxis)
                        .append("text")
                        .attr("class", "ylabel")
                        .attr("transform", "rotate(-90)translate(" + -((height + margin.bottom + margin.top) / 2) + ", " + -(margin.left-20) + ")")
                        .text(yAxisLabel);

                    svg.selectAll(".bar")
                        .data(groupedData)
                        .enter().append("rect")
                        .attr("class", "bar")
                        .attr("x", function(d) {
                            return x(d[scope.columns[0].name]); })
                        .attr("width", x.rangeBand())
                        .attr("y", function(d) {
                            return y(+d[scope.columns[1].name]);
                        })
                        .attr("height", function(d) {
                            return height - margin.bottom - y(+d[scope.columns[1].name]);
                        })
                        .attr("fill", color)
                        .attr("transform", "translate(" + margin.left + ", 0)");

                    svg.append("text")
                        .attr("x", (width / 2))             
                        .attr("y", (margin.top / 2))
                        .attr("text-anchor", "middle")    
                        .text(title.toUpperCase());

                };
            });
        }
    };
});
