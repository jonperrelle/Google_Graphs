
app.directive('barChart', function(d3Service, graphSettingsFactory, DataFactory, SVGFactory) {
    return {
        restrict: 'E',
        scope: {
            rows: "=",
            seriesx: "=",
            seriesy: '=',
            settings: "="
        },
        link: function(scope, ele, attrs) {
            d3Service.d3().then(function(d3) {
   
                SVGFactory.watchForChanges(scope);
               
                scope.render = function() {
                    if (!scope.seriesy) return;
                    let anchor = d3.select(ele[0]);
                    let values = [];
                    let tooMuchData = scope.rows.length > 50;
                    if (tooMuchData) {
                        d3.select(ele[0].parentElement)
                            .classed("scrolling", true);
                    }
                    
                    if (scope.settings.groupType === 'mean') values = DataFactory.groupByMean(scope.rows);
                    else values = scope.rows; 
                    
                        graphSettingsFactory.getSavedSettings(scope.settings, ele[0], values, scope.seriesx, scope.seriesy, 'bar', tooMuchData)
                            .then(function (savedSets) {

                                anchor.selectAll('*').remove();
                                let svg = SVGFactory.appendSVG(anchor, savedSets);

                                let barSpace = 0.1;

                                let x1Scale = d3.scale.ordinal()
                                    .rangeBands([0, savedSets.width - savedSets.margin.left - savedSets.margin.right], barSpace);

                                let x2Scale = d3.scale.ordinal();

                                let yScale = d3.scale.linear()
                                    .range([savedSets.height - savedSets.margin.bottom, savedSets.margin.top]);

                                let xAxis = d3.svg.axis()
                                    .scale(x1Scale)
                                    .orient("bottom");

                                let yAxis = d3.svg.axis()
                                    .scale(yScale)
                                    .orient("left");

                                let xAxisNames = [],
                                groupCats = []
                                values.forEach(obj => {
                                    xAxisNames.push(obj.name);
                                    obj.values.forEach(arr => {
                                        if (groupCats.indexOf(arr[0]) === -1) groupCats.push(arr[0]);
                                    });
                                });

                                x1Scale.domain(xAxisNames);
                                x2Scale.domain(groupCats).rangeRoundBands([0, x1Scale.rangeBand()]);
                                yScale.domain([savedSets.minY, savedSets.maxY]);

                                SVGFactory.appendXAxis(svg, savedSets, xAxis, 'bar');

                                SVGFactory.appendYAxis(svg, savedSets, yAxis);

                                SVGFactory.appendTitle(svg, savedSets);

                                let idx = 0
                                var yData = svg.selectAll("yData")
                                    .data(values)
                                    .enter().append("g")
                                    .attr("class", "yData")
                                    .attr("transform", function(d) { 
                                        return "translate(" + x1Scale(d.name) + ",0)"; 
                                    });

                                 yData.selectAll(".bar")
                                    .data(d =>  {
                                        return d.values;
                                    })
                                    .enter().append("rect")
                                    .attr("class", "bar")
                                    .attr("x", function(d) {
                                        return x2Scale(d[0]); })
                                    .attr("width", tooMuchData ? 10/scope.seriesy.length : x2Scale.rangeBand())
                                    .attr("y", function(d) {
                                        return yScale(d[1]);
                                    })
                                    .attr("height", function(d) {
                                        return savedSets.height - savedSets.margin.bottom - yScale(d[1]);
                                    })
                                    .attr("fill", function(d, i) {
                                            if(typeof savedSets.color === 'function') return savedSets.color(i);
                                            else return savedSets.color;
                                        })
                                    .attr("transform", "translate(" + savedSets.margin.left + ", 0)");

                                
                                let longestData = 0;
                                scope.seriesy.forEach( arr => {
                                      let currentLength = arr.name.toString().length;
                                      if (currentLength > longestData) longestData = currentLength;
                                }); 

                                if (longestData < 7) longestData = 7;

                                if (scope.seriesy && scope.seriesy.length > 1) {
                                    if (typeof savedSets.color !== 'function') savedSets.color = d3.scale.category10();
                                    let legend = svg.selectAll(".legend")
                                        .data(savedSets.color.domain())
                                        .enter().append("g")
                                            .attr("class", "legend")
                                            .attr("transform", function(d, i) { 
                                                return "translate(30," + (i * 15) + ")";
                                            })
                                            .attr('opacity', 0.7);
                               
                                    SVGFactory.appendLegend(legend, scope.seriesy, savedSets, longestData);
                                }
                            
                    });
                };
            });
        }
    };
});
