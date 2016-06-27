app.directive('lineGraph', function(d3Service, $window) {
    return {
        restrict: 'EA',
        scope: {
            data: "=",
            cols: "="
        },
        link: function(scope, ele, attrs) {

            d3Service.d3().then(function(d3) {
                let margin = { top: 20, right: 20, bottom: 30, left: 50 },
                    width = 960 - margin.left - margin.right,
                    height = 500 - margin.top - margin.bottom,
                    dataColumns = scope.cols.split(","),
                    dateTitles = ['year', 'date', 'time'],
                    dateFormat;

                let filteredData = scope.data.filter(obj => obj[dataColumns[0]] && obj[dataColumns[1]]);




                //check if the data column header may contain date info ??
                if (dataColumns[0] === 'year') {
                    console.log("Here");
                    //if so validate the format of the date

                    //run date checking function
                    let commonDateFormats = ["%Y", "%Y-%y", "%x", "%xT%X"];

                    dateFormat = commonDateFormats.filter(f => d3.time.format(f).parse(filteredData[0][dataColumns[0]]))[0];
                    console.log(dateFormat)
                }

                let svg = d3.select(ele[0])
                    .append('svg')
                    .style('width', '100%')
                    .style('height', "1000px")
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                let formatDate = d3.time.format(dateFormat); //d3.time.format("%Y-%y");

                let x = d3.time.scale()
                    .range([0, width]);

                let y = d3.scale.linear()
                    .range([height, 0]);

                let xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom");

                let yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left");

                let line = d3.svg.line()
                    .x(function(d) {
                        return x(formatDate.parse( d[ dataColumns[0] ] ));
                    })
                    .y(function(d) {
                        return y(+d[dataColumns[1]]);
                    });

                // Browser onresize event
                window.onresize = function() {
                    scope.$apply();
                };

                // Watch for resize event
                scope.$watch(function() {
                    return angular.element($window)[0].innerWidth;
                }, function() {
                    scope.render(filteredData);
                });

                scope.render = function(data) {
                    svg.selectAll('*').remove();

                    // If we don't pass any data, return out of the element
                    if (!data) return;
                    // set the height based on the calculations above
                    svg.attr('height', height + margin.top + margin.bottom);

                    x.domain(d3.extent(data, function(d) { return formatDate.parse(d[dataColumns[0]]); 
                    }));
                    y.domain([0, d3.max(data, function(d) {
                        return +d[dataColumns[1]];
                    })]);

                    svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(xAxis);

                    svg.append("g")
                        .attr("class", "y axis")
                        .call(yAxis)
                        .append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end")
                        .text(dataColumns[1]);

                    svg.append("path")
                        .datum(data)
                        .attr("class", "line")
                        .attr("d", line);
                };
            });
        }
    };
});
