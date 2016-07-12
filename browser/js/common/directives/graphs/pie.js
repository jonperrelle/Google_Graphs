
app.directive('pieChart', function(d3Service, SVGFactory, graphSettingsFactory, DataFactory) {


    return {
        restrict: 'E',
        scope: {
            rows: "=",
            seriesx: "=",
            seriesy: "=",
            settings: "="
        },

        link: function(scope, ele, attrs) {
            d3Service.d3().then(function(d3) {

                //Re-render the graph when user changes settings, data, or window size
                SVGFactory.watchForChanges(scope);

                scope.render = function() {
                        let anchor = d3.select(ele[0]);
                        
                        let values = [];

                        if (scope.settings.groupType === 'mean') values = DataFactory.groupByMean(scope.rows);
                        else values = scope.rows;

                        graphSettingsFactory.getSavedSettings(scope.settings, ele[0], values, scope.seriesx, scope.seriesy, 'pie')
                            .then(function (savedSets) {
                                anchor.selectAll('*').remove();
                                let svg = SVGFactory.appendSVG(anchor, savedSets);

                                let groupedTotal = 0;
                            
                                values.forEach( a => groupedTotal += a.values[0][1]);
                                
                                 
                                let pie = d3.layout.pie().value(function(d) {
                                    return d.values[0][1];
                                });        
                                
                                let arc = d3.svg.arc().outerRadius(savedSets.radius);

                                let pieChart = svg.selectAll(".arc")
                                    .data(pie(values))
                                    .enter().append("g")
                                    .attr("class", "arc")
                                    .attr("transform", "translate(" + savedSets.width / 2 + "," + savedSets.height / 2 + ")");
 
                                pieChart.append("path")
                                      .attr("d", arc)
                                      .style("fill", function(d, i) { return savedSets.color(i); })

                                SVGFactory.appendTitle(svg, savedSets);

                                let legendDisplay = (type, data) => {
                                    if (type === 'percentage') return ((data[1]/groupedTotal) * 100).toFixed(2) + "%";
                                    else return data[1];
                                };


                                let legend = svg.selectAll(".legend")
                                    .data(savedSets.color.domain())
                                    .enter().append("g")
                                        .attr("class", "legend")
                                        .attr("transform", function(d, i) { 
                                            console.log()
                                            return "translate(" + (savedSets.width / 1.75) + "," + ((savedSets.radius * 1.5) + (i * 20 + 10)) + ")";
                                        });

                                // draw legend colored rectangles
                                legend.append("rect")
                                    .attr("x", -savedSets.width/2 - savedSets.margin.left/2)
                                    .attr("y", (savedSets.radius * -1.5) + savedSets.margin.top/2)
                                    .attr("width", savedSets.width/100)
                                    .attr("height", savedSets.height/100)
                                    .style("fill", function(d, i) { return savedSets.color(i); });

                                // draw legend text
                                legend.append("text")
                                    .attr("x", -savedSets.width/2)
                                    .attr("y", (savedSets.radius * -1.5) + savedSets.margin.top/2 + savedSets.height/100)
                                    .text(function(d, i) { 
                                        return values[i].name + " - " + legendDisplay(savedSets.displayType, values[i].values[0]);
                                    });

                    });
                };
                    
            });
        }
    };
});
