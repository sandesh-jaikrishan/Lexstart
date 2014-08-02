'use strict';

var ModalInstanceCtrl = function ($scope, $modalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};



angular
.module('mean.lexstart')
	.controller('LexstartController', ['$scope', '$rootScope', '$http', '$location', '$modal', '$log','$fileUploader','Global','LexOrgSvc',
	    function($scope,  $rootScope, $http, $location, $modal, $log, $fileUploader, Global, LexOrgSvc)
		{
	        $scope.global = Global;
	        $scope.package = {
	            name: 'lexstart'
	        };

	        $scope.addDocClassRow = function() {
	        	console.log('Inside addDocClassRow');
	        	$scope.classes.push({selected : true, name :'', type :'', purpose :''});	        	

	        };

	        
	        $scope.loadDocTaggingAttributes = function() {
	        	console.log('Inside loadDocTaggingAttributes');

	        	$scope.fields = [ 
									{label:'Name', type :'text',findex:'org_name',supportDocs:'Y',groupId :1, value :''},
									{label:'CIN', type :'text',findex:'cin',supportDocs:'Y',groupId :1, value :''},
									{label:'ROC Code', type :'select',findex:'roc_code',supportDocs:'Y',groupId :1, value :''},
									{label:'PIN', type :'text',findex:'pin_code', value :''}
									]; 
	        	$scope.options = [{name : 'ROC_Delhi', value : 1001},
	        					  {name : 'ROC_Mumbai', value : 1002},
	        					  {name : 'ROC_Chennai', value : 1003}
	        					];

	        };


	        $scope.loadRegistrations = function() {
	        	console.log('Inside loadRegistrations');

	        	$scope.registrations = [{name :  'Karthik Chandrsekar', email : 'karthik@gmail.com' , company : 'Sangam Pvt Ltd' , cin : 'E1341244143', email_valid_flag : 0, cin_valid_flag : 0, status : 1 , entry_date : new Date(2014,1,2,0,0,0,0)  },
								 		 {name : 'Sandesh Jaikrishan', email : 'sandesh@gmail.com' , company : 'NCubeTech Pvt Ltd' , cin : '1EA41244143', email_valid_flag : 0, cin_valid_flag : 0, status : 1 , entry_date : new Date(2014,5,2,0,0,0,0)  },
								 		 {name : 'Karthik Chandrsekar', email : 'karthik@gmail.com' , company : 'Sangam Pvt Ltd' , cin : 'E1341244143', email_valid_flag : 0, cin_valid_flag : 0, status : 1 , entry_date : new Date(2014,1,2,0,0,0,0)  },
								 		 {name : 'Sandesh Jaikrishan', email : 'sandesh@gmail.com' , company : 'NCubeTech Pvt Ltd' , cin : '1EA41244143', email_valid_flag : 0, cin_valid_flag : 0, status : 1 , entry_date : new Date(2014,5,2,0,0,0,0)  },
								 		 {name : 'Karthik Chandrsekar', email : 'karthik@gmail.com' , company : 'Sangam Pvt Ltd' , cin : 'E1341244143', email_valid_flag : 0, cin_valid_flag : 0, status : 1 , entry_date : new Date(2014,1,2,0,0,0,0)  },
								 		 {name : 'Sandesh Jaikrishan', email : 'sandesh@gmail.com' , company : 'NCubeTech Pvt Ltd' , cin : '1EA41244143', email_valid_flag : 0, cin_valid_flag : 0, status : 1 , entry_date : new Date(2014,5,2,0,0,0,0)  }
	        					 		]; 
	   								 		
	        };

	        $scope.load = function() {
	        	$scope.comp = {};
	        	

	        	$scope.fields = [{label : 'Name', type : 'text', index : 1, findex:'f_1', htxt : 'Enter your Name'},
								 {label : 'Support Docs', type : 'file', index : 2, findex:'f_11', htxt : 'Enter Support Docs to Name Registration'},
	        					 {label : 'Age', type : 'textarea', index : 3, findex:'f_2', htxt : 'Enter your Age'},
	        					 {label : 'Sex', type : 'select', index : 4, findex:'f_3', htxt : 'Enter your Sex',options : [{val:'Male'},{val:'Female'}]},
	        					 {label : 'Phone', type : 'text', index : 5, findex:'f_4', htxt : 'Enter your Phone Number'},
	        					 {label : 'File', type : 'file', index : 6, findex:'f_5', htxt : 'Select files for upload'}
	        					 ]; 

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

	        $scope.loadProfile = function() {
	        	$scope.comp = {};
	        	$scope.status = {open : true};
	        	$scope.org = {};
	        					
				$http.get('/org/'+$rootScope.org._id
				).success(function(data, status, headers, config) {
						console.log('success response');
						$scope.org = data.org;		    			
				}).error(function(data, status, headers, config) {
						$scope.error = true;
						$scope.errorList = ['Error loading Organization Details '+'\n'+ data.errors]; 
				});

				$http.get('/lexgetorgdoclist/' + $rootScope.org._id
				).success(function(data, status, headers, config) {
						console.log('success response');
						$scope.org.docs = data.orgDocs;		    			
				}).error(function(data, status, headers, config) {
						$scope.error = true;
						$scope.errorList = ['Error loading docss '+$scope.docClass.doc_mnemonic+ '\n'+ data.errors]; 
				});

	        	
	        	$scope.groups = [   { name : 'Company - Basic Details',
									  fields : [{label:'Name', type :'text',entity_name : 'org',attribute_name:'org_name'},
												{label:'Organization Category', type :'text',entity_name : 'org',attribute_name:'org_type'},
												{label:'Incorporation Date', type :'text',entity_name : 'org',attribute_name:'inc_dt'},
												{label:'Registration No', type :'text',entity_name : 'org',attribute_name:'reg_no'},
												{label:'Registered Office Address', type :'textarea',entity_name : 'org',attribute_name:'reg_off_add'},
												{label:'TAN', type :'text',entity_name : 'org',attribute_name:'tan'},
												{label:'PAN', type :'text',entity_name : 'org',attribute_name:'pan'},
												{label:'CIN', type :'text',entity_name : 'org',attribute_name:'cin'},
												{label:'ROC Code', type :'text',entity_name : 'org',attribute_name:'roc_code'}												
											   ]},
									 {name : 'Company - Address Details',		   
									  fields : [{label:'Activity Description', type :'text',entity_name : 'org',attribute_name:'activity_dsc'},
												{label:'Address Line1', type :'text',entity_name : 'org',attribute_name:'address_line_1'},
												{label:'Address Line2', type :'text',entity_name : 'org',attribute_name:'address_line_2'},
												{label:'City', type :'text',entity_name : 'org',attribute_name:'city'},
												{label:'State', type :'text',entity_name : 'org',attribute_name:'state_name'},
												{label:'Country', type :'text',entity_name : 'org',attribute_name:'country'},
												{label:'PIN', type :'text',entity_name : 'org',attribute_name:'pin_code'}
											   ]},
									{name : 'Company - Key Events & Capital Details',		   
									 fields : [{label:'Last AGM Date', type :'text',entity_name : 'org',attribute_name:'date_last_agm'},
											   {label:'Last Balance Sheet Date', type :'text',entity_name : 'org',attribute_name:'date_last_bs'},
											   {label:'Auth Capital', type :'text',entity_name : 'org',attribute_name:'auth_cap'},
												{label:'Paid Up Capital', type :'text',entity_name : 'org',attribute_name:'paid_up_cap'}
											  ]} 
	        						]; 

	        		        					

	        	$scope.directors = [{name : 'Karthik Chandrasekar', din : 'A1232132FG', appt_date :'10-Oct-2010', category :'Promoter' , type :'Chairman', designation :'Director'},      		
	        					    {name : 'James Andreson', din : 'A1232132FG', appt_date :'15-Aug-2012', category :'Professional' , type :'Director', designation :'Addnl Director'},      		
	        					    {name : 'Phil Hughes', din : 'A1232132FG', appt_date :'10-Jan-2011', category :'Independent' , type :'Exec Director', designation :'Director'}     		
	        						];	

	        	$scope.shareholders = [{name : 'Karthik Chandrasekar', shareholding_pct :'20%', type_of_share :'Equity' , conv_date : '12-Jan-2017', special_right : 'LIQ_PREF, DIFF_VOT_RGHT'},      		
	        					    {name : 'James Anderson', shareholding_pct :'25%', type_of_share :'Equity' , conv_date : '12-Jan-2017', special_right : 'LIQ_PREF, DIFF_VOT_RGHT'},
	        					    {name : 'Kirsti Jones', shareholding_pct :'15%', type_of_share :'Equity' , conv_date : '12-Jan-2017', special_right : 'LIQ_PREF, DIFF_VOT_RGHT'},
	        					    {name : 'Phil Hughes', shareholding_pct :'40%', type_of_share :'Equity' , conv_date : '12-Jan-2017', special_right : 'LIQ_PREF, DIFF_VOT_RGHT'}	        	   		
	        						];	

	        	$scope.auditors = [{name : 'KPMG', ad_type :'Statutory', appt_date :'13-Jan-2014' , duration : '1 Year'},      		
	        					   {name : 'ABC Corp', ad_type :'Internal', appt_date :'10-Mar-2012' , duration : '5 Years'}      		
	        					   ];		

				$scope.docs = [{name : 'INCP_2102131.pdf', class :'INC_DOC', tags :'name:Sangam\ndate:12Jan2014\nCIN:A123213' , date : '12-Jan-2011'},      		
	        				   {name : 'Board_Mtg_2131.pdf', class :'BMR_DOC', tags :'date:12Jan2014\nName Resolution' , date : '12-Jan-2014'},  
	        				   {name : 'Board_Mtg_245.pdf', class :'BMR_DOC', tags :'date:12Jan2014\nDirector Change' , date : '12-Feb-2014'},  
							   {name : 'INCP_2102131.pdf', class :'INC_DOC', tags :'name:Sangam\ndate:12Jan2014\nCIN:A123213' , date : '12-Jan-2011'},      		
	        				   {name : 'Board_Mtg_2131.pdf', class :'BMR_DOC', tags :'date:12Jan2014\nName Resolution' , date : '12-Jan-2014'},  
	        				   {name : 'Board_Mtg_245.pdf', class :'BMR_DOC', tags :'date:12Jan2014\nDirector Change' , date : '12-Feb-2014'}
	        				 ];

				  						
				$scope.events = [{type : 'DIR_CHG', purpose :'Director Change', tags :'12-Apr-2013' , status : 'Complete' , pend_at : ''},
							    {type : 'CMP_NM_CHG', purpose :'Company Name Change', tags :'12-Apr-2014' , status : 'Pending', pend_at : 'MCA filing pending'},
								{type : 'INC_APP', purpose :'Company Incorporation', tags :'12-Apr-2011' , status : 'Complete', pend_at : ''}	      		
	        				  ];

	        	
	        };	        

		 	

        $scope.postData = function(isValid) {
            if (isValid) {
                $scope.uploader.uploadAll();
                $log.info($scope.comp);
                
            } else {
                $scope.submitted = true;
            }
        };  


        $scope.items = ['item1', 'item2', 'item3'];

        $scope.openMetaDataModal = function (size) {
			  	console.log('Open Modal functiona called');

			  	var modalInstance = $modal.open(
			  		{
				      templateUrl: '/lexstart/views/tagging.html',
				      controller: ModalInstanceCtrl,
				      size: size,
				      resolve: { 
				      				items: function () 
				      				{
				          				return $scope.items;
				        			}
		      					}
	    			});

			    modalInstance.result.then(function (selectedItem) {
			      $scope.selected = selectedItem;
			    }, function () {
			      $log.info('Modal dismissed at: ' + new Date());
			    });

	        
		};

		$scope.testSvc = function() {
			console.log('inside test Service');
			$scope.test = {key : 'value'};
            $http({	method: 'Get', 
            		url: '/testsvc',
            		data  : $scope.register,  // pass in data as strings
    				headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    		}).success(function(data, status, headers, config) {
    				console.log('success response');
			      	$location.path('/lexstart/response');
			}).error(function(data, status, headers, config) {
					console.log('error response');
			      	$location.path('/');
			});
                
            
        };  


	}	
]);

