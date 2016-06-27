app.directive('addGraph', function($http) {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/graphs/add-graph.directive.html',
        scope: {
            data: "=",
            info: "=",
            columns: "="
        },
        link: function(scope, ele, attrs) {

        	function validateNumber(col) {
        		let numArray = [];
        		for (let i=0; i < scope.data.length; i++) {
        			if (i === 10) break;
        			else {
        				if (!isNaN(scope.data[i][col.name])) numArray.push(scope.data[i]);
        			}
        		}
        		return numArray.length > 0 ? true : false;
        	}

        	function validateDate(col) {
        		let column;
        		let possibleDateColumns = ['year', 'date', 'time', 'occurred'];
        		if (col) {
        			column = col.name.toLowerCase();
        			return possibleDateColumns.filter( item => new RegExp(item).test(column)).length > 0;
        		}
        	}

        	function validateDateOrNumber(col) {
        		if (validateDate(col)) {
        			col.type = 'date';
        			return true;
        		}
        		else if (validateNumber(col)) {
        			col.type = 'number';
        			return true;
        		}
        		else {
        			col.type = "string";
        			return false
        		}
        		
        	}
        	
        	scope.pieDisabled = function () {
        		if ((scope.column1 || scope.column2) && (validateDateOrNumber(scope.column1) || validateDateOrNumber(scope.column2)) return false;
        		else return true;
        	};

        	scope.barOrPlotDisabled = function () {
        		if (scope.column1 && scope.column2 && (validateDateOrNumber(scope.column1) || validateDateOrNumber(scope.column2))) return false;
        		else return true;
        	}

        	scope.lineDisabled = function () {
        		if (scope.column1 && scope.column2 && (validateDateOrNumber(scope.column1) && validateDateOrNumber(scope.column2))) return false;
        		else return true;
        	}


			scope.getData = function(dataset, axes){
				return $http.put('api/soda',{dataset: dataset,arrOfColumns: axes})
				.then(function(set){
					scope.graphColumns = set.data.columns;
					scope.graphData = set.data.graphData;
				});
			};
        }
    };
});



 
