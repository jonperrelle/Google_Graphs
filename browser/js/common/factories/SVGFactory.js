app.factory('SVGFactory', function ($window) {
  let SVGFactory = {};

  SVGFactory.watchForChanges = function (scope) {
    window.onresize = function() {
      scope.$parent.$parent.$digest();
    };

    scope.$watch(function() {
      return angular.element($window)[0].innerWidth;
    }, function() {
      scope.render();
    });

     scope.$watch(function() {
          return scope.rows; 
      }, function(newVal, oldVal) {
          if (newVal !== oldVal) scope.render();
      }, true);

      scope.$watch(function() {
          return scope.settings; 
      }, function(newVal, oldVal) {
          if (newVal !== oldVal) scope.render();
      }, true);
  };

  SVGFactory.appendXAxis = function (svg, savedSets, xAxis, type) {
    // translate for line and scatterPlot should be 0, height-margin.bottom
    let translateXAxis = 0;
    if (type === 'bar' || type === 'histogram') translateXAxis = savedSets.margin.left;
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(" + translateXAxis + ", " + (savedSets.height - savedSets.margin.bottom) + ")")
      .call(xAxis)
      .append("text")
      .attr("class", "xlabel")
      .text(savedSets.xAxisLabel);

    svg.selectAll(".x text")
      .attr("transform", "translate(-10,4)rotate(-75)")
      .style("text-anchor", "end");


    svg.select(".xlabel")
      .attr("transform", "translate(" + ((savedSets.width - savedSets.margin.left - savedSets.margin.right) / 2) + ", " + (savedSets.margin.bottom - savedSets.xAxisTitleSize) + ")")
      .style("text-anchor", "middle")
      .style("font-size", savedSets.xAxisTitleSize);
  };

  SVGFactory.appendYAxis = function (svg, savedSets, yAxis) {
    svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + savedSets.margin.left + ",0)")
      .call(yAxis)
      .append("text")
      .attr("class", "ylabel")
      .attr("transform", "rotate(-90)translate(" + -((savedSets.height - savedSets.margin.bottom) / 2) + ", " + -(savedSets.margin.left - savedSets.yAxisTitleSize) + ")")
      .text(savedSets.yAxisLabel)
      .style("text-anchor", "middle")
      .style("font-size", savedSets.yAxisTitleSize);
  };

  SVGFactory.appendTitle = function (svg, savedSets) {
    svg.append("text")
      .attr("x", (savedSets.width / 2))
      .attr("y", (savedSets.margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", savedSets.titleSize)
      .text(savedSets.title);
  };

  SVGFactory.appendSVG = function (anchor, savedSets) {
    return anchor.append('svg')
            .style('width', savedSets.width)
            .style('height', savedSets.height)
            .style('background-color', '#ffffff');
  };

  SVGFactory.appendLegend = function(legend, data, savedSets, longestData, type) {

            legend.append("rect")
                .attr("x", savedSets.width - (120 + ((longestData - 7) * 6)))
                .attr("y", "30")
                .attr("width", 5)
                .attr("height", 5)
                .style("fill", function(d, i) { return savedSets.color(i); });

           
            legend.append("text")
                .attr("x", savedSets.width - (105 + ((longestData - 7) * 6)))
                .attr("y", "35")
                .style("font-size", "1.2em")
                .text(function(d, i) {
                    return data[i].name;
                });
  };

  return SVGFactory;
});
