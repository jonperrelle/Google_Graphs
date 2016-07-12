
app.directive('scatterplotGraph', function(d3Service, GraphFilterFactory, graphSettingsFactory, SVGFactory) {

    let directive = {};

    directive.restrict = 'E';
    directive.scope = {
        rows: '=',
        seriesx: '=',
        seriesy: '=',
        settings: '='
    };
    directive.link = linkFn;

    return directive;

    function linkFn(scope, ele, attrs) {
        d3Service.d3().then(function(d3) {

            SVGFactory.watchForChanges(scope);

            scope.render = function() {

                let anchor = d3.select(ele[0]);
               

                graphSettingsFactory.getSavedSettings(scope.settings, ele[0], scope.rows, scope.seriesx, scope.seriesy, 'scatter')
                    .then(function (savedSets) {

                        anchor.selectAll('*').remove();
                        let svg = SVGFactory.appendSVG(anchor, savedSets);

                            let xValue = function(d) {
                                    return d[0]
                                }, // data -> value
                                xScale = d3.scale.linear()
                                .range([savedSets.margin.left, savedSets.width - savedSets.margin.right]), // value -> display
                                xMap = function(d) {
                                    
                                    return xScale(xValue(d))
                                }, // data -> display
                                xAxis = d3.svg.axis().scale(xScale).orient("bottom");

                            let yValue = function(d) {
                                    return d[1]
                                }, // data -> value
                                yScale = d3.scale.linear().range([savedSets.height - savedSets.margin.bottom, savedSets.margin.top]), // value -> display
                                yMap = function(d) {
                                    return yScale(yValue(d))
                                }, // data -> display
                                yAxis = d3.svg.axis().scale(yScale).orient("left");

                            let filteredValues = GraphFilterFactory.setBounds(savedSets, scope.rows);

                            // add the tooltip area to the webpage
                            let tooltip = d3.select("body").append("div")
                                .attr("class", "tooltip")
                                .style("opacity", 0);

                            xScale.domain([savedSets.minX, savedSets.maxX]);
                            yScale.domain([savedSets.minY, savedSets.maxY]);

                            // x-axis
                            SVGFactory.appendXAxis(svg, savedSets, xAxis);

                            // y-axis
                            SVGFactory.appendYAxis(svg, savedSets, yAxis);

                            let dotRadius = savedSets.height/100;

                            filteredValues.forEach( (obj, idx) => {
                                let dots = svg.selectAll(".dot" + idx)
                                    .data(obj.values)
                                    .enter().append("circle")
                                    .attr("class", "dot")
                                    .attr("r", dotRadius)
                                    .attr("cx", d =>  {
                                        
                                        return xMap(d)})
                                    .attr("cy", d => yMap(d))
                                    .attr("fill", function(d) {

                                        if(typeof savedSets.color === 'function') return savedSets.color(idx);
                                        else return savedSets.color;
                                    })
                                    .on("mouseover", function(d) {
                                        tooltip.transition()
                                            .duration(200)
                                            .style("opacity", .9);
                                        tooltip.html(obj.name + "<br/> (" + xValue(d) + ", " + yValue(d) + ")")
                                            .style("left", (d3.event.pageX + 5) + "px")
                                            .style("top", (d3.event.pageY - 28) + "px");
                                    })
                                    .on("mouseout", function(d) {
                                        tooltip.transition()
                                            .duration(500)
                                            .style("opacity", 0);
                                    });
                            });


                            let longestData = 0;
                            filteredValues.forEach( obj => {
                                  let currentLength = obj.name.toString().length;
                                  if (currentLength > longestData) longestData = currentLength;
                            }); 

                            if (longestData < 7) longestData = 7;
                            
                            if (scope.seriesy && scope.seriesy.length > 1)  {
                                if (typeof savedSets.color !== 'function') savedSets.color = d3.scale.category10();
                                let legend = svg.selectAll(".legend")
                                    .data(savedSets.color.domain())
                                    .enter().append("g")
                                        .attr("class", "legend")
                                        .attr("transform", function(d, i) { 
                                            return "translate(30," + (i * 15) + ")";
                                        })
                                        .attr('opacity', 0.7);

                                SVGFactory.appendLegend(legend, filteredValues, savedSets, longestData);      
                            }

                            SVGFactory.appendTitle(svg, savedSets);
                
                    });
            };
        });
    }
});
