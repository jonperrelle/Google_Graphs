app.factory('AddGraphFactory', function (ValidationFactory) {
   return {
            pieEnabled: function(rows, col1, col2){
              return col1 && col2 && (col1.type === 'number' || col2.type === 'number');
            },

            barEnabled: function(rows, col1, col2){
              // let limited = true;
              // if(col1.type === 'number'){
              //   limited = ValidationFactory.noRepeats(rows, col1)
              // }
              return col1 && 
                col2 && col2.type === 'number' && true 
               // true// (col1.type !== 'number') // fix this: can be a number if limited quantity/no repeats
                ;
            },

            scatterEnabled: function(col1, col2){
              return col1 && col2 && col1.type === 'number' && col2.type === 'number';
            },

            lineEnabled: function(col1, col2){
              return col1 && col2 && ((col1.type === 'number' || col1.type === 'date') && col2.type === 'number');
            },
   };
});