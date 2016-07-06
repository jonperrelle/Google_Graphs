app.factory('DataFactory', function () {
  return {
    groupByCategory: function (data, category, metric, type) {
      if(type === 'none') return data; 
      let groupedObj = {},
          groupedData = [];
      data.forEach(function (datum) {
        if (!groupedObj[datum[category]]) {
          groupedObj[datum[category]] = [1, +datum[metric]];
        } else {
          groupedObj[datum[category]][0]++;
          groupedObj[datum[category]][1] += +datum[metric];
        }
      });
      for (let key in groupedObj) {
        if (groupedObj.hasOwnProperty(key)) {
          let obj = {};
          obj[category] = key;
          if(type === 'total') obj[metric] = groupedObj[key][1]
          else if(type === 'mean') obj[metric] = groupedObj[key][1] / groupedObj[key][0];
          groupedData.push(obj);
        }
      }
      return groupedData;
    },

    orderByCategory: function (data, category, type, orderStyle = 'sort') {
      if (orderStyle === 'none') return data;
      if (type === 'number') {
        return data.sort(function (a, b) {
          return +a[category] - +b[category];
        });
      }
      else {
        return data.sort(function (a, b) {
          if (a[category] < b[category]) return -1;
          else return 1;
        });
      }
    },

    withinLength: function(data, col, length){
        let repeatTable = {};
        data.forEach(function(elem){
          let currentData = elem[col];
          repeatTable[currentData] = repeatTable[currentData] || 0;
          repeatTable[currentData]++; 
        })
        if(Object.keys(repeatTable).length > length) return false;
        else return true; 
    }
  };
});
