app.factory('DataFactory', function () {
  return {

    groupByMean: function (values) {
      let groupedData = [];
      values.forEach(function (obj) {
          let newObj= {name: obj.name};
          let groupedObj = {};
          obj.values.forEach(function(arr) {
            groupedObj[arr[0]] = [arr[1]/arr[2], arr[2]];
                
          });
          
          newObj.values = Object.keys(groupedObj).map(key => {
            return [key, groupedObj[key][0], groupedObj[key][1]];
          });
          groupedData.push(newObj);

        });
      return groupedData;
    },

    

    // orderByCategory: function (data, category, type, orderStyle = 'sort') {
    //   if (orderStyle === 'none') return data;
    //   if (type === 'number') {
    //     return data.sort(function (a, b) {
    //       return +a[category] - +b[category];
    //     });
    //   }
    //   else {
    //     return data.sort(function (a, b) {
    //       if (a[category] < b[category]) return -1;
    //       else return 1;
    //     });
    //   }
    // },

    // withinLength: function(data, col, length){
    //     let repeatTable = {};
    //     data.forEach(function(elem){
    //       let currentData = elem[col];
    //       repeatTable[currentData] = repeatTable[currentData] || 0;
    //       repeatTable[currentData]++; 
    //     })
    //     if(Object.keys(repeatTable).length > length) return false;
    //     else return true; 
    // }
  };
});
