app.directive('scatterplot', function(d3Service, $window) {
    return {
      restrict: 'EA',
      scope: {
        //comment this out during testing
        rows: '=',
        columns: '='
        //end testing stuff here
      },
      link: function(scope, ele, attrs) {
        var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

        d3Service.d3().then(function(d3) {
          var svg = d3.select(ele[0])
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom);
            
            window.onresize = function() {
              scope.$apply();
            };
            // Watch for resize event
            scope.$watch(function() {
              return angular.element($window)[0].innerWidth;
            }, function() {
              scope.render(scope.rows);
            });

            //THIS IS FOR TESTING:
            // scope.rows = [{age: 15, numPirates: 15},{age: 25, numPirates: 25}, {age: 37, numPirates: 40}]
            // scope.columns = ['age', 'numPirates'];
            //end testing info.
            
            scope.render = function(data) {
                svg.selectAll('*').remove();

                var xValue = function(d) { return d[scope.columns[0].name]}, // data -> value
                    xScale = d3.scale.linear().range([margin.left, margin.left + width]), // value -> display
                    xMap = function(d) { return xScale(xValue(d))}, // data -> display
                    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

                var yValue = function(d) { return d[scope.columns[1].name]}, // data -> value
                    yScale = d3.scale.linear().range([height - margin.bottom, margin.top]), // value -> display
                    yMap = function(d) { return yScale(yValue(d))}, // data -> display
                    yAxis = d3.svg.axis().scale(yScale).orient("left");

                var cValue = function(d) { return d.Manufacturer},
                color = d3.scale.category10();

                  // add the tooltip area to the webpage
                var tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

                data.forEach(function(d) {
                    d[scope.columns[0].name] = +d[scope.columns[0].name];
                    d[scope.columns[1].name] = +d[scope.columns[1].name];
                });

                xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
                yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

                // x-axis
                  svg.append("g")
                      .attr("class", "x axis")
                      //.attr("transform", "translate(0," + height + ")")
                      .attr("transform", "translate(0,"+ (height - margin.bottom) +")")
                      //.attr("transform", "translate(" + margin.left + "," + height + ")")
                      .call(xAxis)
                    .append("text")
                      .attr("class", "label")
                      .attr("x", width)
                      .attr("y", -6)
                      .style("text-anchor", "end")
                      .text(scope.columns[0]);

                  // y-axis
                  svg.append("g")
                      .attr("class", "y axis")
                      .attr("transform", "translate(" + margin.left + ",0)")
                      .call(yAxis)
                    .append("text")
                      .attr("class", "label")
                      .attr("transform", "rotate(-90)")

                      //.attr("x", margin.left)
                      .attr("y", 6)
                      .attr("dy", ".71em")
                      .style("text-anchor", "end")
                      .text(scope.columns[1].name);

                  // draw dots
                  svg.selectAll(".dot")
                      .data(data)
                    .enter().append("circle")
                      .attr("class", "dot")
                      .attr("r", 3.5)
                      .attr("cx", xMap)
                      .attr("cy", yMap)
                      .style("fill", function(d) { return color(cValue(d))}) 
                      .on("mouseover", function(d) {
                          tooltip.transition()
                               .duration(200)
                               .style("opacity", .9);
                          tooltip.html(d[scope.columns[0].name] + "<br/> (" + xValue(d) 
                          + ", " + yValue(d) + ")")
                               .style("left", (d3.event.pageX + 5) + "px")
                               .style("top", (d3.event.pageY - 28) + "px");
                      })
                      .on("mouseout", function(d) {
                          tooltip.transition()
                               .duration(500)
                               .style("opacity", 0);
                      });

                  // draw legend
                  var legend = svg.selectAll(".legend")
                      .data(color.domain())
                    .enter().append("g")
                      .attr("class", "legend")
                      .attr("transform", function(d, i) { return "translate(" + (40) + "," + i * 20 + ")" });

                  // draw legend colored rectangles
                  legend.append("rect")
                      .attr("x", width - 18)
                      .attr("width", 18)
                      .attr("height", 18)
                      .style("fill", color);

                  // draw legend text
                  legend.append("text")
                      .attr("x", width - 24)
                      .attr("y", 9)
                      .attr("dy", ".35em")
                      .style("text-anchor", "end")
                      //.text(function(d) { return d})
                      .text(scope.columns[0].name);
            }
        })
      }
    }
  });


