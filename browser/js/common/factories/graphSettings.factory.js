app.factory("graphSettingsFactory", function(d3Service){
	
	let graphSettings = {};

	let getMin = function (d3, data, idx) {
		let min, tempMin;
		data.forEach(function (obj) {
            tempMin = d3.min(obj.values, function(d) {
            	return d[idx]
            });
            if(tempMin < min || typeof min === 'undefined') min = tempMin;
        });
        return min;
	};

	let getMax = function (d3, data, idx) {
		let max, tempMax;
		data.forEach(function (obj) {
            tempMax = d3.max(obj.values, function(d) {return d[idx]});
            if(tempMax > max || typeof max === 'undefined') max = tempMax;   
        });
        return max;
	};

    let setColor = function (color) {
        switch (color) {
          case '10':
            return d3.scale.category10();
          case '20a':
            return d3.scale.category20();
          case '20b':
            return d3.scale.category20b();
          case '20c':
            return d3.scale.category20c();
          default: 
            return color;
        }
      };

    let getLabelLengths = function (data, type, seriesx, seriesy) {
        
        let xLength = 0,
        yLength = 0;
        if (!seriesx || type === 'pie') xLength = 2;
        else {
            if (type === 'histogram') {
                if (Array.isArray(data[0])) xLength = data[data.length-1].x.toString().length;
                else data.forEach( obj => {
                    let currentXLength = obj[seriesx[0].name].toString().length;
                    if (currentXLength > xLength) xLength = currentXLength;
                });
            }
            else if (type === 'bar') {
                data.forEach( obj => {
                    let currentXLength = obj.name.toString().length;
                    if (currentXLength > xLength) xLength = currentXLength;
                });
            }   
            else {
               data.forEach( obj => {
                   let currentXLength;
                   if (seriesx[0].type === 'date') {
                       xLength = 6;
                   } else {
                       currentXLength = obj.values[0][0].toString().length;
                       if (currentXLength > xLength) xLength = currentXLength;
                   }
               });
            }   
        }
        
        if (!seriesy || type === 'pie' || !data[0].values[0]) yLength = 3;
        else {

                data.forEach(obj => {

                    let currentYLength = obj.values[0][1].toString().length;
                    if (currentYLength > yLength) yLength = currentYLength;
                })
            
        }
        
        return [xLength, yLength];
    };


	graphSettings.getSavedSettings = function (sets, ele, data, seriesx, seriesy, type, tooMuchData) {
        
		return d3Service.d3().then(function(d3) {

			let formatColX = 'X Axis',
			formatColY = 'Y Axis',
			savedSettings = {},
            labelLengths = getLabelLengths(data, type, seriesx, seriesy),
            xLabelLength = labelLengths[0],
            yLabelLength = labelLengths[1]; 
            

            savedSettings.height = sets.height || 500;
            savedSettings.xAxisLabel = sets.xAxisLabel || formatColX;
            savedSettings.xAxisTitleSize =  sets.xAxisTitleSize || 12;
            savedSettings.yAxisLabel = sets.yAxisLabel || formatColY;
            savedSettings.yAxisTitleSize =  sets.yAxisTitleSize || 12;
            savedSettings.title = sets.title || (formatColX + " .vs " + formatColY).toUpperCase();
            savedSettings.titleSize = sets.titleSize || 16;          
            savedSettings.margin = { 
                top: savedSettings.titleSize * 1.5,
                right: 20,
                bottom: (xLabelLength + 8) * 4 + Number(savedSettings.xAxisTitleSize), 
                left: (yLabelLength + 8) * 4 + Number(savedSettings.yAxisTitleSize)
            };
            savedSettings.width = sets.width || (tooMuchData ? savedSettings.margin.left + savedSettings.margin.right + data.length * 15 : ele.parentNode.offsetWidth);
            savedSettings.radius = sets.radius || savedSettings.height / 3;
            savedSettings.color = sets.color ?  setColor(sets.color) : setColor('10'); 
            if (type !== 'histogram') {
                savedSettings.minX = (sets.minX || sets.minX === 0) ? sets.minX : getMin(d3, data, 0);
                savedSettings.maxX = (sets.maxX || sets.maxX === 0) ? sets.maxX : getMax(d3, data, 0);
                savedSettings.minY = (sets.minY || sets.minY === 0) ? sets.minY : getMin(d3, data, 1);
                savedSettings.maxY = (sets.maxY || sets.maxY === 0) ? sets.maxY : getMax(d3, data, 1);
            }
            savedSettings.display = sets.display || 'total';
            savedSettings.displayType = sets.displayType || 'number';
            savedSettings.groupType = sets.groupType || 'total';
            savedSettings.orderType = sets.orderType || 'sort';

            return savedSettings;
        });
	};
	return graphSettings;
});