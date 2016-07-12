app.factory('ValidationFactory', function () {
   return {
          
            validateObject: function(data, col) {
              if (col) {
                for (let i=0; i < data.length && i < 10; i++) {
                    if (typeof data[i][col.name] === 'object') return true;
                }
                return false;
              }
            },

            validateNumber: function(data, col) {
              if (col) {
                for (let i=0; i < data.length && i < 10; i++) {
                    if (data[i][col.name] && !isNaN(data[i][col.name])) return true;
                }
              }
              return false;
            },

            validateDate: function(col) {
              let column;
              let possibleDateColumns = ['year', 'date', 'time', 'occurred'];
              if (col) {
                column = col.name.toLowerCase();
                return possibleDateColumns.filter( item => new RegExp(item).test(column)).length > 0;
              }
            },
            
            assignColumnNameAndType: function (data, columns) {
              return columns.map(col => {
                let colObj ={}
                colObj.name = col;
                if (this.validateObject(data, colObj)) {

                  colObj.type = 'object';
                  return colObj;
                }
                else if (this.validateDate(colObj)) {
                  colObj.type = 'date';
                 return colObj;
                }
                else if (this.validateNumber(data, colObj)) {
                  colObj.type = 'number';
                  return colObj;
                }
                else {
                  colObj.type = "string";
                  return colObj;
                }
              });
            },

            



            // noRepeats: function(data, col){
            //   let repeats = false,
            //   repeatTable = {};
            //   data.forEach(function(elem){
            //     let currentData = elem[col];
            //     repeatTable[currentData] = repeatTable[currentData] || 0;

            //   })
            // }

   };
});

