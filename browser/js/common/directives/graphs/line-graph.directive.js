app.directive('lineGraph', function(d3Service, $window, $state) {
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

                scope.$watch(function(scope) {
                    return scope.columns;
                }, function() {
                    scope.render();
                }, true);

                scope.render = function() {

                    console.log($state.includes('home'));

                    let filteredData = scope.rows.filter(obj => obj[scope.columns[0].name] 
                            && obj[scope.columns[1].name]
                            && (!!Number(obj[scope.columns[0].name]) || Number(obj[scope.columns[0].name]) === 0)
                            && (!!Number(obj[scope.columns[1].name]) || Number(obj[scope.columns[1].name]) === 0))
                    .sort((a, b) => a[scope.columns[0].name] - b[scope.columns[0].name]);

                    let anchor = d3.select(ele[0])
                    anchor.selectAll('*').remove();

                    let xLabelLength = filteredData.reduce(function (prev, current) {
                            let currentLength = current[scope.columns[0].name].toString().length;
                            return currentLength > prev ? currentLength : prev;
                        }, 0),
                    yLabelLength = filteredData.reduce(function (prev, current) {
                        let currentLength = Math.floor(current[scope.columns[1].name]).toString().length;
                        return currentLength > prev ? currentLength : prev;
                    }, 0);

                    let formatColX = scope.columns[0].name.replace(/\_+/g, " "),
                        formatColY = scope.columns[1].name.replace(/\_+/g, " "),
                        margin = { 
                            top: 30,
                            right: 20,
                            bottom: (xLabelLength + 6) * 5,
                            left: (yLabelLength + 6) * 7,
                        },
                        width = scope.settings.width || ele[0].parentNode.offsetWidth,
                        height = scope.settings.height || width,
                        xAxisLabel = scope.settings.xAxisLabel || formatColX,
                        yAxisLabel = scope.settings.yAxisLabel || formatColY,
                        title = scope.settings.title || formatColX + " .vs " + formatColY,
                        svg = anchor
                        .append('svg')
                        .style('width', width)
                        .style('height', height)
                        .style('background-color', '#ffffff')
                        .style('border-radius', '10px')
                        .append("g");
                        // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                    //check if the data column header may contain date info ??
                    let x,
                        dateFormat,
                        data;
                    if (scope.columns[0].type === 'date') {
                        //if so validate the format of the date

                        //run date checking function
                        let commonDateFormats = ["%Y", "%Y-%y", "%x", "%m-%d-%Y", "%m.%d.%Y", "%m/%d/%y", "%m-%d-%y", "%m.%d.%y", "%Y/%m/%d", "%Y-%m-%d", "%Y.%m.%d", "%xT%X", "%m-%d-%YT%X", "%m.%d.%YT%X", "%m/%d/%yT%X", "%m-%d-%yT%X", "%m.%d.%yT%X", "%Y-%m-%dT%X", "%Y/%m/%dT%X", "%Y.%m.%dT%X", "%c"];
                        dateFormat = commonDateFormats.filter(f => d3.time.format(f).parse(filteredData[0][scope.columns[0].name]))[0];
                        let formatDate = d3.time.format(dateFormat); //d3.time.format("%Y-%y");
                        data = [];
                        filteredData.forEach(function(element) {
                            let obj = {};
                            obj[xAxisLabel] = formatDate.parse(element[scope.columns[0].name]);
                            obj[yAxisLabel] = element[scope.columns[1].name]
                            data.push(obj);
                        });
                        x = d3.time.scale().range([margin.left, width - margin.right]);
                    } else if (scope.columns[0].type === 'number') {
                        x = d3.scale.linear().range([margin.left, width - margin.right]);
                        data = [];
                        filteredData.forEach(function(element) {
                            let obj = {};
                            obj[scope.columns[0].name] = +(element[scope.columns[0].name]);
                            obj[scope.columns[1].name] = element[scope.columns[1].name];
                            data.push(obj);
                        });
                    } else {
                        return;
                    }

                    let y = d3.scale.linear()
                        .range([height - margin.bottom, margin.top]);

                    let xAxis = d3.svg.axis()
                        .scale(x)
                        .orient("bottom");

                    let yAxis = d3.svg.axis()
                        .scale(y)
                        .orient("left");

                    let line = d3.svg.line()
                        .x(function(d) {
                            return x(d[scope.columns[0].name]);
                        })
                        .y(function(d) {
                            return y(+d[scope.columns[1].name]);
                        });

                    // If we don't pass any data, return out of the element
                    if (!data) return;

                    //Need a better way to adjust minX and maxX if based on date


                    let color = scope.settings.color || "steelblue",
                        minX = (typeof scope.settings.minX === 'number') ? scope.settings.minX : d3.min(data, function(d) {
                            return d[scope.columns[0].name];
                        }),
                        maxX = (typeof scope.settings.maxX === 'number') ? scope.settings.maxX : d3.max(data, function(d) {
                            return d[scope.columns[0].name];
                        }),
                        minY = (typeof scope.settings.minY === 'number') ? scope.settings.minY : d3.min(data, function(d) {
                            return +d[scope.columns[1].name];
                        }),
                        maxY = (typeof scope.settings.maxY === 'number') ? scope.settings.maxY : d3.max(data, function(d) {
                            return +d[scope.columns[1].name];
                        });

                    // x.domain(d3.extent(data, function(d) { return d[xAxisLabel]; 
                    // }));
                    // y.domain([0, d3.max(data, function(d) {
                    //     return +d[yAxisLabel];
                    // })]);

                    x.domain([minX, maxX]);
                    y.domain([minY, maxY]);

                    svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
                        .call(xAxis)
                        .append("text")
                        .attr("class", "xlabel")
                        .text(xAxisLabel);
                        // .attr("dy", ".71em")
                        // .style("text-anchor", "end")
                        // .text(xAxisLabel);

                    svg.select(".xlabel")
                        .attr("transform", "translate(" + (width - margin.left - margin.right) / 2 + ", " + (margin.bottom - 10) + ")");

                    svg.append("g")
                        .attr("class", "y axis")
                        .attr("transform", "translate(" + margin.left + ",0)")
                        .call(yAxis)
                        .append("text")
                        .attr("class", "ylabel")
                        .attr("transform", "rotate(-90)translate(" + -((height + margin.bottom + margin.top) / 2) + ", " + -(margin.left - 20) + ")")
                        .text(yAxisLabel);

                    svg.append("path")
                        .datum(data)
                        .attr("d", line)
                        .attr('fill', 'none')
                        .attr("stroke", color)
                        .attr("stroke-width", 2);

                    svg.append("text")
                        .attr("x", (width / 2))             
                        .attr("y", margin.top/2)
                        .attr("text-anchor", "middle")    
                        .text(title.toUpperCase());
                };
            });
        }
    };
});
