'use strict';

var app = angular.module('mean.lexstart');


app.controller('LexConfigAdminController',
function($scope,$location,$http, $timeout, $filter, Global,$log, $fileUploader, ngTableParams)
{
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
function($scope,$location,$http, Global,$log, $fileUploader, ngTableParams)
{
	 
	 $scope.tagDoc = function(item) {
	 	 if (item.selectedDocClass)
	 	 {
	 	 	Global.selectedDocClass = item.selectedDocClass;
	 	 	$location.path('/lexstart/tagdoc');
	 	 }
	 };

	 $scope.initTagDoc = function () {
	 	$scope.selectedDocClass = Global.selectedDocClass; 	
	 	
	 };

	 $scope.initUploadDocsForm = function() {
        $http.get('/lexgetdocclasslist')
		.success(function(data, status, headers, config) {
			$scope.docClassList = data.docClassList;
		}).error(function(data, status, headers, config) {
			$scope.error = true;
			$scope.errorList = ['Error fetching doc class list '+ data.error];        				
		});				


        $scope.uploader = $fileUploader.create({
            scope: $scope,                          // to automatically update the html. Default: $rootScope
            url: '/lexstart/file-upload',
            formData: [
                { key: 'value' }
            ],
            filters: [
                function (item) {                    // first user filter
                    console.info('filter1', item);
                    return true;
                }
            ]
	    });		
    	
    	$scope.uploader.bind('afteraddingfile', function (event, item) {
    		console.info('After adding a file::', event, event.currentScope , event.targetScope, item);
		});
        	
        };
});



app.controller('LexAdminController', 
	    function($scope, $filter, $location, $http, Global ,ngTableParams)
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

	        $scope.loadRegistrations = function() {
	        	console.log('Inside loadRegistrations');

	        	var registrations = [{name :  'Karthik Chandrsekar', email : 'karthik@gmail.com' , company : 'Sangam Pvt Ltd' , cin : 'E1341244143', email_valid_flag : 0, cin_valid_flag : 0, status : 1 , entry_date : new Date(2014,1,2,0,0,0,0)  },
								 		 {name : 'Sandesh Jaikrishan', email : 'sandesh@gmail.com' , company : 'NCubeTech Pvt Ltd' , cin : '1EA41244143', email_valid_flag : 0, cin_valid_flag : 0, status : 1 , entry_date : new Date(2014,5,2,0,0,0,0)  },
								 		 {name : 'Karthik Chandrsekar', email : 'karthik@gmail.com' , company : 'Sangam Pvt Ltd' , cin : 'E1341244143', email_valid_flag : 0, cin_valid_flag : 0, status : 1 , entry_date : new Date(2014,1,2,0,0,0,0)  },
								 		 {name : 'Sandesh Jaikrishan', email : 'sandesh@gmail.com' , company : 'NCubeTech Pvt Ltd' , cin : '1EA41244143', email_valid_flag : 0, cin_valid_flag : 0, status : 1 , entry_date : new Date(2014,5,2,0,0,0,0)  },
								 		 {name : 'Karthik Chandrsekar', email : 'karthik@gmail.com' , company : 'Sangam Pvt Ltd' , cin : 'E1341244143', email_valid_flag : 0, cin_valid_flag : 0, status : 1 , entry_date : new Date(2014,1,2,0,0,0,0)  },
								 		 {name : 'Sandesh Jaikrishan', email : 'sandesh@gmail.com' , company : 'NCubeTech Pvt Ltd' , cin : '1EA41244143', email_valid_flag : 0, cin_valid_flag : 0, status : 1 , entry_date : new Date(2014,5,2,0,0,0,0)  }
	        					 		]; 
	        	
	   			$scope.tableParams = new ngTableParams({
			        page: 1,            // show first page
			        count: 2 ,
			        sorting: {name: 'asc'},
			        filter: { name: 'S' }     
			    }, {
			        total: registrations.length,
			        counts :  [2,3,4],// length of data
			        getData: function($defer, params) {
			        	var orderedData = params.sorting() ? 
			        					  $filter('orderBy')(registrations, params.orderBy()) : registrations;

			        	orderedData = params.filter() ?
                   						 $filter('filter')(orderedData, params.filter()) : orderedData;	

                   		params.total(orderedData.length);		 			  

			            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			        }
			    });     

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
		}	



);

