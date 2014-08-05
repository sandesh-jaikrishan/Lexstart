
'use strict';

var app = angular.module('mean.lexstart');


app.controller('LexConfigAdminController',
function($scope,$timeout, $rootScope, $location,$http, $filter, Global,$log, $fileUploader, ngTableParams)
{

$scope.cancelActionMap = function() {
	$location.path('/lexstart/admineventclass');
};
$scope.loadActionMapAdminForm = function() {
	$scope.eventClass = Global.eventClass;

	$scope.optionTypeList = [{name : '1956', id : 1},
							 {name : '2013', id : 2},
							 {name : 'Both', id : 3}
							];

	$http.get('/getActionMapForEvent/'+$scope.eventClass._id)
		.success(function(data, status, headers, config) {
			data.actionMapList.forEach(function(item){
				console.log('Action Map',item);
				item.actionType = item.legal_action_type_id;
				item.legal_action_type_id = item.actionType._id;
				$scope.optionTypeList.forEach(function(_opt){
					console.log('Option',_opt);
					if (_opt.id===item.option)
					{
						console.log('matched');
						item.optionType = _opt;
						console.log('Item',item);
					}
				});
			});
			$scope.actionMapList = data.actionMapList;			
		}).error(function(data, status, headers, config) {
			$scope.error = true;
			$scope.errorList = ['Error fetching action type list '+ data.error];        				
		});	

	$http.get('/getActionTypeList')
		.success(function(data, status, headers, config) {
			$scope.actionTypeList = data.actionTypeList;			
		}).error(function(data, status, headers, config) {
			$scope.error = true;
			$scope.errorList = ['Error fetching action type list '+ data.error];        				
		});		

};	

$scope.saveActionMap = function(){
	$scope.actionMapList.forEach(function(item){
		item.legal_action_type_id = item.actionType._id;
		item.option = item.optionType.id;
	});

	$http.post('/saveActionMap/',{actionMap : $scope.actionMapList, eventClassId : $scope.eventClass._id})
		.success(function(data, status, headers, config) {
			$location.path('/lexstart/admineventclass');			
		}).error(function(data, status, headers, config) {
			$scope.error = true;
			$scope.errorList = ['Error saving action map '+ data.error];        				
		});	

};

$scope.addActionMapRow = function() {
	var actionMap = {
     		legal_event_class_id : $scope.eventClass._id,
			seq_no : $scope.actionMapList.length+1,
			required : 'N',
			optionType : {name : 'Both' , id : 3}
     	};
     	$scope.actionMapList.push(actionMap);  
};

$scope.setActionMapFlag = function(_actionMap,bool){
	_actionMap.editFlag = bool;
	$scope.error = false;


};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///
///
$scope.addEventActions = function(_eventClass){
	Global.eventClass = _eventClass;
	$location.path('/lexstart/adminactionmap');

};
var loadEventClassTable = function() {
							 
		$scope.eventClassTblParam  = new ngTableParams({
				page: 1,            // show first page
				count: 5,
				sorting: {event_name : 'asc'},
				filter: {event_name : '' }     
			}, {
				total: $scope.eventClassList.length,
				counts :  [],// length of data
				getData: function($defer, params) {
					var orderedData = params.sorting() ? 
									  $filter('orderBy')($scope.eventClassList, params.orderBy()) : $scope.eventClassList;

					orderedData = params.filter() ?
									 $filter('filter')(orderedData, params.filter()) : orderedData;	
					console.log('orderedData', orderedData);
	                   	
					params.total(orderedData.length);		 			  

					$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
				}
			});
	};

	$scope.deleteEventClass = function(_eventClass) {
		
	};

	$scope.saveEventClass = function(_eventClass) {
		$scope.errorList = [];
		if (!_eventClass.eventType)
		{
			$scope.errorList.push('Event Type not selected.');
		}
		if (_eventClass.event_name === '<Event Name>')
		{
			$scope.errorList.push('Legal Event Name cannot be left blank.');
		}
		if (_eventClass.purpose === '<Purpose>')
		{
			$scope.errorList.push('Event Purpose cannot be left blank.');
		}
		if ($scope.errorList.length > 0)
		{
			$scope.error = true;
			return;
		}
		_eventClass.event_type =  _eventClass.eventType.id;

		$http.post('/saveEventClass',
            		{eventClass : _eventClass}
		).success(function(data, status, headers, config) {
				console.log('success response');
				_eventClass._id = data.eventClass._id;
				$scope.responseMsg = 'Event Class '+ _eventClass.event_name + ' saved successfully.';    			
		}).error(function(data, status, headers, config) {
				$scope.error = true;
				console.log('Error occured saving  Event Class '+ _eventClass.event_name);
    			$scope.errorList = ['Error occurred saving  Event Class '+ _eventClass.event_name + '\n'+ data.errors]; 
		});

		$scope.setEventFlag(_eventClass,false);


	} ;
	
	$scope.loadEventClassAdminForm = function() {
		$scope.eventTypeList = [{name : 'Approval' , id : 1},
							 {name : 'Intimation' , id : 2}];
		
		var _eventTypeList = $scope.eventTypeList;
		$http.get('/geteventClassList')
		.success(function(data, status, headers, config) {
			console.log('success response', data);
			data.eventClassList.forEach(function(item){
				for (var i=0;i<_eventTypeList.length;i++)
				{
					var _eventType = _eventTypeList[i];
					if (item.event_type === _eventType.id)
					{
						item.eventType = _eventType;
					}
				}
			});
			$scope.eventClassList = data.eventClassList;
			console.log('Fetch list',$scope.eventClassList);
			loadEventClassTable();
		}).error(function(data, status, headers, config) {
			console.log('error response');
			$scope.error = true;
			$scope.errorList = ['Error fetching action type list '+ data.error];        				
		});	
	};
	
	$scope.addEventClassRow = function() {
     	var eventClass = {
     		event_name : '<Event Name>',
			purpose : '<Purpose>'
     	};
     	$scope.eventClassList.push(eventClass);     	
     	$scope.eventClassTblParam.reload();
     	
    };

	$scope.setEventFlag = function (_eventClass,bool){
		$scope.error = false;
		$scope.responseMsg = false;
		_eventClass.editFlag = bool;
	};



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	var loadActTypeTable = function() {
		$scope.actTypeTblParam  = new ngTableParams({
				page: 1,            // show first page
				count: 5,
				sorting: {legal_action : 'asc'},
				filter: {legal_action : '' }     
			}, {
				total: $scope.actionTypeList.length,
				counts :  [],// length of data
				getData: function($defer, params) {
					var orderedData = params.sorting() ? 
									  $filter('orderBy')($scope.actionTypeList, params.orderBy()) : $scope.actionTypeList;

					orderedData = params.filter() ?
									 $filter('filter')(orderedData, params.filter()) : orderedData;	
					console.log('orderedData', orderedData);
	                   	
					params.total(orderedData.length);		 			  

					$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
				}
			});
	};

	$scope.deleteActionType = function(_actionType) {
		
	};

	$scope.saveActionType = function(_actionType) {
		$scope.errorList = [];
		if (!_actionType.docClass)
		{
			$scope.errorList.push('Document Class not selected.');
		}
		if (_actionType.legal_action === '<Legal Action>')
		{
			$scope.errorList.push('Legal Action Name cannot be left blank.');
		}
		if ($scope.errorList.length > 0)
		{
			$scope.error = true;
			return;
		}
		_actionType.doc_class_id = _actionType.docClass._id;

		$http.post('/saveActionType',
            		{actionType : _actionType}
		).success(function(data, status, headers, config) {
				console.log('success response');
				_actionType._id = data.actionType._id;
				$scope.responseMsg = 'Action Type '+ _actionType.legal_action + ' saved successfully.';    			
		}).error(function(data, status, headers, config) {
				$scope.error = true;
				console.log('Error occured saving  Action Type '+ _actionType.legal_action);
    			$scope.errorList = ['Error occured saving  Action Type '+ _actionType.legal_action + '\n'+ data.errors]; 
		});

		$scope.setActionFlag(_actionType,false);


	} ;
	
	$scope.loadActionTypeAdminForm = function() {

		$http.get('/lexgetdocclasslist')
			.success(function(data, status, headers, config) {
				$scope.docClassList = data.docClassList;				
		}).error(function(data, status, headers, config) {
				$scope.error = true;
				$scope.errorList = ['Error fetching doc class list '+ data.error];        				
		});	

		$http.get('/getActionTypeList')
		.success(function(data, status, headers, config) {
			console.log('success response', data);
			$scope.actionTypeList = data.actionTypeList;
			console.log('Fetch list',$scope.actionTypeList);
			loadActTypeTable();
		}).error(function(data, status, headers, config) {
			console.log('error response');
			$scope.error = true;
			$scope.errorList = ['Error fetching action type list '+ data.error];        				
		});	
	};
	
	$scope.addActTypeRow = function() {
     	var actType = {
     		legal_action : '<Legal Action>',
			doc_class_id : {}
     	};
     	//$scope.actTypeTblParam.reload();
     	//$timeout($scope.actTypeTblParam.reload(),100);	
     	//$scope.actTypeTblParam = {reload:function(){},settings:function(){return {}}};
     	$scope.actionTypeList.push(actType);     	
     	$scope.actTypeTblParam.reload();
     	
    };

	$scope.setActionFlag = function (_actionType,bool){
		$scope.error = false;
		_actionType.editFlag = bool;
	};

	$scope.doc_type_list =  [{name :'eform' , value : '1' },
        					 {name :'Resolution' , value : '2' },
        					 {name :'Charter' , value : '3' },
        					 {name :'Others' , value : '4' }
        						];
    $scope.attr_ref_type_list = [{name :'Primary' , value : '1' },
        					 	 {name :'Secondary' , value : '2' }
        						];		
    $scope.editId = 0;   

    
    $scope.selectedAttrList = [];
   
    $scope.getAttrList = function(docClass) {  
     	var attrList = '';
     	docClass.tags.forEach(function(item) {
     		attrList += item.attribute_id.table_name + '.' + item.attribute_id.attribute_name +'\n';
     	}); 
     	return attrList;
     }; 

     $scope.setEditClass = function(_docClass) {
     	Global.docClass = _docClass;   
       	$location.path('/lexstart/admineditdocclass');
     };	

     $scope.addDocClassRow = function() {
     	var docClass = {
     		doc_mnemonic : '<Mnemonic>',
			doc_name : '<Name>',
			doc_type : 0,
			purpose : '<Purpose>',
			tags : []
     	};
     	$scope.docClassList.push(docClass);
     	$scope.tableParams.reload();
     };

     $scope.saveDocClass = function() {
     	console.log('Inside saveDocClass');
     	var existingtagKeys = {};
     	var selectedTagKeys = [];

     	// Prepare hashmap for existing attribute tags
     	$scope.docClass.tags.forEach(function(item){
     		existingtagKeys[item.attribute_id._id] = item;
     	});
     	// New & Existing tags updates
     	$scope.selectedAttrList.forEach(function(item){
     		item.reference_type = item.isPrimary ? 1 : 2;
     		selectedTagKeys.push(item.attribute_id._id);

     		// Add new Doc Tags
     		if (!existingtagKeys[item.attribute_id._id])
     		{
     			item.operation = 'create'; 
     			$scope.docClass.tags.push(item);
     		}
     		// Update values for existing docs tags
     		else
     		{
     			var tag = existingtagKeys[item.attribute_id._id];
     			tag.reference_type = item.reference_type;
     			tag.operation = 'update';
     		}
     	});
     	// Mark Deleted tags
     	$scope.docClass.tags.forEach(function(item){
     		if (selectedTagKeys.indexOf(item.attribute_id._id)===-1)
     			item.operation = 'delete';     		
     	});

    	$http.post('/updateInsertDocClass',
            		{docClass : $scope.docClass}
		).success(function(data, status, headers, config) {
				console.log('success response');
				$scope.responseMsg = 'Doc Class inserted/updated successfully '+ $scope.docClass.doc_mnemonic;
    			$location.path('/lexstart/admindocclass');
		}).error(function(data, status, headers, config) {
				$scope.error = true;
				console.log('Error occured updating doc Class ',data);
    			$scope.errorList = ['Error updating doc Class '+$scope.docClass.doc_mnemonic+ '\n'+ data.errors]; 
		});
     };

     $scope.unselectAttr = function() {     	
     	for (var i=$scope.selectedAttrList.length-1;i>=0;i--)
     	{
     		var item = $scope.selectedAttrList[i];
     		if (item.ticked)
     		{
     			item.ticked = false;
     			item.isPrimary = false;
     			$scope.attrList.push(item);
     			$scope.selectedAttrList.splice(i,1);	     		
     		}
     	}
     	$scope.attrMasterTblParams.reload();     	
     };		

     $scope.selectAttr = function() {
     	var selectedList = $scope.selectedAttrList;
     	for (var i=$scope.attrList.length-1;i>=0;i--)
     	{
     		var item = $scope.attrList[i];
     		if (item.ticked)
     		{
     			item.ticked = false;
     			selectedList.push(item);
     			$scope.attrList.splice(i,1);
     		}
     	}
     	$scope.selectedAttrList = $filter('orderBy')(selectedList, ['+table_name','+attribute_name']);
     	$scope.attrMasterTblParams.reload();
     };			

     $scope.loadEditDocClass = function() {
     	$scope.docClass = Global.docClass;
     	delete  Global.docClass;
     	if (!Global.attrList){
			$http.get('/lexgetattributelist')
			.success(function(data, status, headers, config) {
				Global.attrList = data.attributeList;
				initTableAttrList();				
				//Global.attrMasterTblParams = $scope.attrMasterTblParams;
			}).error(function(data, status, headers, config) {
				console.log('error response from getAttributeList');
				$scope.error = true;
				$scope.errorList = ['Error fetching Attribute list '+ data.error];
			});       				
		}
		else
		{
			initTableAttrList();					
		}			

     };
     var initTableAttrList = function () {
     	$scope.attrList = [];
     	$scope.selectedAttrList = [];
     	//Global.attrList.forEach(function(item){
     	for (var x=0;x<Global.attrList.length;x++){
     		var item = Global.attrList[x];
     		var tag = null;
     		for (var i=0;i<$scope.docClass.tags.length;i++)
			{
				var _tag = $scope.docClass.tags[i];	
				if 	(_tag.attribute_id._id === item._id)
				{
					tag = _tag;
					break;
				}
			}
			var t = {
				_id : tag ? tag._id : null,
				attribute_id : item,
				table_name : item.table_name,
				attribute_name : item.attribute_name,
				ticked : tag ? true : false,
				isPrimary : tag && tag.reference_type ===1 ? true : false,
				reference_type : tag ? tag.reference_type : 2
			};
			$scope.attrList.push(t);			
		}	
		loadMasterAttrTable();
		$timeout($scope.selectAttr(),100);	

     };
     var loadMasterAttrTable = function() {
     	$scope.attrMasterTblParams  = new ngTableParams({
			page: 1,            // show first page
			count: 5 ,
			sorting: {table_name : 'asc'},
			filter: {table_name : 'organization' }     
		}, {
			total: $scope.attrList.length,
			counts :  [],// length of data
			getData: function($defer, params) {
				var orderedData = params.sorting() ? 
								  $filter('orderBy')($scope.attrList, ['+table_name','+attribute_name']) : $scope.attrList;

				orderedData = params.filter() ?
								 $filter('filter')(orderedData, params.filter()) : orderedData;	
				console.log('orderedData', orderedData);
                   	
				params.total(orderedData.length);		 			  

				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			}
		});
     };


     $scope.unsetDocClass = function() {
     	$location.path('/lexstart/admindocclass');
     };
        						
	 $scope.loadAdminDocClassification = function() {
     	console.log('Inside loadAdminDocClassification');
        $http.get('/lexgetdocclasslist')
		.success(function(data, status, headers, config) {
			console.log('success response', data);
			$scope.docClassList = data.docClassList;
			console.log('Fetch list',$scope.docClassList);
			$scope.tableParams  = new ngTableParams({
				page: 1,            // show first page
				count: 5 ,
				sorting: {doc_mnemonic : 'asc'},
				filter: {doc_mnemonic : '' }     
			}, {
				total: $scope.docClassList.length,
				counts :  [5,10],// length of data
				getData: function($defer, params) {
					var orderedData = params.sorting() ? 
									  $filter('orderBy')($scope.docClassList, params.orderBy()) : $scope.docClassList;

					orderedData = params.filter() ?
									 $filter('filter')(orderedData, params.filter()) : orderedData;	
					console.log('orderedData', orderedData);
	                   	
					params.total(orderedData.length);		 			  

					$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
				}
			});

		}).error(function(data, status, headers, config) {
			console.log('error response');
			$scope.error = true;
			$scope.errorList = ['Error fetching doc class list '+ data.error];        				
		});	
    };
});


app.controller('LexFileUploadController',
function($scope,$rootScope, $location,$http, Global,$log, $fileUploader, ngTableParams)
{
	 
	 $scope.tagDoc = function(tagDocItem) {
	 	 if (tagDocItem.selectedDocClass)
	 	 {
	 	 	if (!tagDocItem.selectedDocClassInst || tagDocItem.selectedDocClassInst.doc_class_id !== tagDocItem.selectedDocClass._id)
	 	 	{
	 	 		tagDocItem.selectedDocClassInst = {doc_class_id : tagDocItem.selectedDocClass._id,
											 org_id : $rootScope.org._id, 
											 doc_date : new Date(),
											 tags : []};
				tagDocItem.selectedDocClass.tags.forEach(function(item){
					tagDocItem.selectedDocClassInst.tags.push({
						attribute_id : item.attribute_id._id,
						verified : false,
						value : '',
						table_name : item.attribute_id.table_name,
						attribute_name : item.attribute_id.attribute_name
					});
				});		
	 	 	}
	 	 	Global.tagDocItem = tagDocItem;
	 	 	Global.initUploadDocsForm.uploaderQueue = $scope.uploader.queue;	
	 	 	$location.path('/lexstart/tagdoc');
	 	 }
	 };

	 $scope.initTagDoc = function () {
	 	$scope.selectedDocClassInst = Global.tagDocItem.selectedDocClassInst; 

	 	$scope.tagGroups = ['organization','address','shareholders','auditor','share_capital','Director'];
	 	$scope.groupConfig = {	'organization' : {label : 'Organization', tags : []},
	 							'address'  : {label : 'Address', tags : []},
	 							'shareholders'   : {label : 'Shareholder', tags : []},
	 							'auditor'  : {label : 'Auditor', tags : []},
	 							'share_capital'  : {label : 'Share Capital', tags : []},
	 							'Director'  : {label : 'Director', tags : []} 
	 						 };
	 	$scope.tagGroupsFound = [];
	 						 
	 	$scope.groupedTags = {} ;
	 	$scope.tagGroups.forEach(function(group){
			$scope.selectedDocClassInst.tags.forEach(function(item){
				if (item.table_name === group)
				{
					if (!$scope.groupedTags[group])
					{
						$scope.groupedTags[group] = [];	
						$scope.tagGroupsFound.push({group : group,groupName : $scope.groupConfig[group].label, status : false});
					}
					$scope.groupedTags[group].push(item);
				}
	 		});
	 	});



	 };
	 $scope.upload = function (item) {
	 	item.formData = [{key:'docTag',value:JSON.stringify(item.selectedDocClassInst)}];
	 	item.upload();

	 };
	 $scope.uploadAll = function() {
	 	$scope.uploader.uploadAll();
	 };

	 $scope.initUploadDocsForm = function() {

	 	$scope.uploader = $fileUploader.create({
            scope: $scope,                          
            url: '/lexstart/file-upload'
		});
		$scope.uploader.bind('afteraddingfile', function (event, item) {
    		console.info('After adding a file::', event, event.currentScope , event.targetScope, item);
		});

	 	//if (!Global.initUploadDocsForm || Global.curr_org_id !== Global.initUploadDocsForm.org_id)
	 	if (!Global.initUploadDocsForm || !Global.initUploadDocsForm.org || Global.initUploadDocsForm.org._id !== $rootScope.org._id)	
	 	{
	 		
	 		Global.initUploadDocsForm = {org:$rootScope.org};

	 		$scope.org_id = $rootScope.org._id;
	 		$scope.org_name = $rootScope.org.org_name;	 		

	        $http.get('/lexgetdocclasslist')
			.success(function(data, status, headers, config) {
				$scope.docClassList = data.docClassList;
				Global.initUploadDocsForm.docClassList = $scope.docClassList;
			}).error(function(data, status, headers, config) {
				$scope.error = true;
				$scope.errorList = ['Error fetching doc class list '+ data.error];        				
			});	  
    	}
    	else
    	{

    		$scope.docClassList = Global.initUploadDocsForm.docClassList;
    		Global.initUploadDocsForm.uploaderQueue.forEach(function(item){
    			$scope.uploader.queue.push(item);
    		});

        }	
    };
    	
});



app.controller('LexAdminController', 
	    function($scope, $rootScope, $filter, $location, $http, Global ,ngTableParams)
	    {
	        $scope.global = Global;        
	        $scope.editId = -1;
	        $scope.msgList = [];
	        $scope.responseMsg = '';
	        $scope.errorList = [];
	        $scope.error = false;
	        $scope.editFlag = false;
	        $scope.prospect_type_list = [ {value : 1 , name : 'Enterprenuer'},
	        							  {value : 2 , name : 'Startup'},
	        							  {value : 3 , name : 'Student'},
	        							  {value : 4 , name : 'Investor'}
	        							];
	        $scope.prospect_status_list = [ {value : 1 , name : 'Regn Req Captured'},
	        							  	 {value : 2 , name : 'Regn Req Verified'},
	        							     {value : 3 , name : 'Regn Mailed'},
	        							     {value : 4 , name : 'Regn Confirmed'},
	        							     {value : 5 , name : 'Regn Closed'}
	        							];	
	        $scope.prospect_status_filter_list = ['Regn Req Captured','Regn Req Verified','Regn Mailed','Regn Confirmed','Regn Closed'];							


	        $scope.editProspect = function (prospect) {
	        	$scope.editId = prospect.regn_token;
	        	prospect.status = $scope.prospect_status_list.filter( function(item){return (item.value===prospect.prospect_status);} )[0];
	        	$scope.msgList = [];
	        	$scope.errorList = [];
	        	$scope.responseMsg = '';
	        	$scope.error = false;
	        	$scope.editFlag = true;
	        };

	        $scope.viewProspect = function (prospect) {
	        	$scope.editId = prospect.regn_token;
	        	prospect.status = $scope.prospect_status_list.filter( function(item){return (item.value===prospect.prospect_status);} )[0];
	        	$scope.msgList = [];
	        	$scope.errorList = [];
	        	$scope.responseMsg = '';
	        	$scope.error = false;
	        	$scope.editFlag = false;
	        };

	        $scope.setEditId = function (id) {
	        	$scope.editId = id;	
	        	$scope.responseMsg = ''; 
	        	$scope.error = false;       	
	        };							

	        $scope.loadAllUserOrg = function() {
	        	console.log('Inside loadAllUserOrg');
	        	$scope.orgList = [];
	        	$http.get('/loadAllUserOrg/'+$rootScope.user.username)
				.success(function(data, status, headers, config) {
					$scope.orgList = data.orgList;
					console.log('Org List',$scope.orgList);
				}).error(function(data, status, headers, config) {
					$scope.error = true;
					$scope.errorList = ['Error fetching doc class list '+ data.error];        				
				});	
	        	
	        	
	   			$scope.tableParams = new ngTableParams({
			        page: 1,            // show first page
			        count: 5 ,
			        sorting: {org_name: 'asc'},
			        filter:  {org_name: '' }     
			    }, {
			        total: $scope.orgList.length,
			        counts :  [],// length of data
			        getData: function($defer, params) {
			        	var orderedData = params.sorting() ? 
			        					  $filter('orderBy')($scope.orgList, params.orderBy()) : $scope.orgList;

			        	orderedData = params.filter() ?
                   						 $filter('filter')(orderedData, params.filter()) : orderedData;	

                   		params.total(orderedData.length);		 			  

			            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			        }
			    });     

			};

			$scope.setOrgForSession = function(_org) {
				$rootScope.org = _org;
				$location.path('/lexstart/profile');						
			};

	        $scope.getProspectTypeName = function(val) {
	        	var ptype = $scope.prospect_type_list.filter( function(item){return (item.value===val);} );
	        	return ptype[0].name;
	        };	

	        $scope.getProspectStatusName = function(val) {
	        	var pstatus = $scope.prospect_status_list.filter( function(item){return (item.value===val);} );
	        	return pstatus[0].name;
	        };								

	        $scope.loadProspects = function() {
	        	console.log('Inside loadProspects');
	        	$scope.global.prospects = {};

        	    $http.get('/lexgetprospects')
        		.success(function(data, status, headers, config) {
    				console.log('success response', data);
    				$scope.global.prospects = data.prospects;
    				var prospects = data.prospects;
					$scope.tableParams = new ngTableParams({
				        page: 1,            // show first page
				        count: 5 ,
				        sorting: {name: 'asc'},
				        filter: {name: '' }     
				    }, {
				        total: prospects.length,
				        counts :  [2,3,4],// length of data
				        getData: function($defer, params) {
				        	var orderedData = params.sorting() ? 
				        					  $filter('orderBy')(prospects, params.orderBy()) : prospects;

				        	orderedData = params.filter() ?
	                   						 $filter('filter')(orderedData, params.filter()) : orderedData;	
	                   		params.total(orderedData.length);		 			  

				            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
				        }
				    });     

				}).error(function(data, status, headers, config) {
					console.log('error response');
				});				 		
	        
	        };

	        $scope.updateProspect = function(prospect,_status){
            	console.log('Propspect for update',prospect);

				prospect.prospect_status = _status;
				prospect.prospect_type = prospect.type.value;

				$http.post('/updateProspect',
	                		   {prospect : prospect}
	        		).success(function(data, status, headers, config) {
	        				console.log('success response');
	        				$scope.setEditId(-1);
	        				$scope.responseMsg = 'Prospect '+ prospect.name +' updated successfully.';
	        				$location.path('/lexstart/prospects');
					}).error(function(data, status, headers, config) {
							console.log('error response');
							$scope.error = true;
	        				$scope.errorList = ['Error updating the Prospect record for '+prospect.name+ '\n'+ data.error];        				
				});
            };


            $scope.createAccount = function(prospect) {
            	console.log('Creating account',prospect);
            	$http.post('/createAccount',
	                		{prospect : prospect}
        		).success(function(data, status, headers, config) {
        				console.log('success response');
        				$scope.setEditId(-1);
	        			$scope.responseMsg = 'Login account created successfully and details mail to '+ prospect.name;
	        			prospect.prospect_status = 4;
        				$location.path('/lexstart/prospects');
				}).error(function(data, status, headers, config) {
						$scope.error = true;
						console.log('Error occured creating account ',data);
	        			$scope.errorList = ['Error creating acount for '+prospect.name+ '\n'+ data.errors]; 
				});
            };

            $scope.initVerifyDocs = function() {
	        	console.log('Inside loadDocsForTagging');

	        	$http.get('/lexgetorgdoclist/' + $rootScope.org._id
				).success(function(data, status, headers, config) {
						console.log('success response');
						$scope.docs = data.orgDocs;		    			
				}).error(function(data, status, headers, config) {
						$scope.error = true;
						$scope.errorList = ['Error loading docss '+$scope.docClass.doc_mnemonic+ '\n'+ data.errors]; 
				});

	        	 
	        	$scope.actions = [{name : 'Change Company Name', value : 1001},
	        					  {name : 'Change Director Name', value : 1002},
	        					  {name : 'Change Company Address', value : 1003}
	        					];



	        };

		}	



);

