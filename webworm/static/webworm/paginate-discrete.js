var discreteMap = [
		   'strains',
		   'trackers',
		   'sex',
		   'dev',
		   'ventral',
		   'food',
		   'arena',
		   'habituation',
		   'experimenter',
		   ];
var hiddenDiscreteIndex = 1;
var discreteTables = new Array(discreteMap.length);
var confirmTables = new Array(discreteMap.length);

// On Form Submission, populate the discrete search parameters
var submitFunction = function() {
    for (var disIdx=0; disIdx<discreteMap.length; disIdx++) {
	var fieldString = '';
	confirmTables[disIdx].rows().every( function(index) {
		var data = this.data();
		fieldString += data[0] + ',';
	    });
	// remove last excess comma
        fieldString = fieldString.substring(0, fieldString.length - 1);
	//	alert(fieldString);
	$('#'+discreteMap[disIdx]+'InputList').val(fieldString);
    }
}

$(document).ready(function() {

	var selectEventFactory = function(discreteTable, confirmTable, discreteIndex) {
	    var returnFunction = function(e, dt, type, indexes) {
		var localDiscreteTable = discreteTable;
		var localConfirmTable = confirmTable;
		var localDiscreteIndex = discreteIndex;
		if ( type === 'row' ) {
		    var origData = localDiscreteTable.rows(indexes).data();
		    var selectLength = indexes.length;
		    for (var sIdx=0; sIdx<selectLength; sIdx++) {
			if (!localDiscreteIndex[indexes[sIdx]]) {
			    localDiscreteIndex[indexes[sIdx]] = "true";
			    var data = [];
			    // *CWL* This is an annoying hardcode.
			    data.push(origData[sIdx][0]); // name of parameter
			    data.push(indexes[sIdx]);
			    localConfirmTable.row.add(data);
			}
		    }
		    localConfirmTable.draw();
		}
	    }
	    return returnFunction;
	}
	
	var deselectEventFactory = function(discreteTable, confirmTable, discreteIndex) {
	    var returnFunction = function(e, dt, type, indexes) {
		var localDiscreteTable = discreteTable;
		var localConfirmTable = confirmTable;
		var localDiscreteIndex = discreteIndex;
		if ( type === 'row' ) {
		    var selectLength = indexes.length;
		    for (var sIdx=0; sIdx<selectLength; sIdx++) {
			if (localDiscreteIndex[indexes[sIdx]]) {
			    delete localDiscreteIndex[indexes[sIdx]];
			    localConfirmTable.row( function(idx, data, node){
				    return data[hiddenDiscreteIndex] === 
					indexes[sIdx]?true:false;
				}).remove();
			}
		    }
		    localConfirmTable.draw();
		}
	    }
	    return returnFunction;
	}

	var discreteIndices = new Array(discreteMap.length);
	for (var disIdx=0; disIdx<discreteMap.length; disIdx++) {
	    discreteIndices[disIdx] = {};
	}

	for (var disIdx=0; disIdx<confirmTables.length; disIdx++) {
	    confirmTables[disIdx] = $('#'+discreteMap[disIdx]+'Confirm').DataTable( {
		    "columnDefs": [ {
			    "targets":[hiddenDiscreteIndex],
			    "visible": false,
			    "searchable": false
			},],
		    "bFilter": false,
		    deferRender:    true,
		    scrollY:        200,
		    scrollCollapse: true,
		    scroller:       true,
		});
	    discreteTables[disIdx] = $('#sum_'+ discreteMap[disIdx]).DataTable( {
		    dom: 'Blfrtip',
		    buttons: [
			      'selectAll',
			      'selectNone',
			      ],
		    select: {
			style: 'multi'
		    }
		});
	    var discreteTable = discreteTables[disIdx];
	    var discreteIndex = discreteIndices[disIdx];
	    var confirmTable = confirmTables[disIdx];
	    discreteTable.on('select', 
			     selectEventFactory(discreteTable, confirmTable, discreteIndex));
	    discreteTable.on('deselect', 
			     deselectEventFactory(discreteTable, confirmTable, discreteIndex));
	}

    } );
