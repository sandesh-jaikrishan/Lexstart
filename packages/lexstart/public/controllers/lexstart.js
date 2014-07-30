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
	.controller('LexstartController', ['$scope', '$http', '$location', '$modal', '$log','$fileUploader','Global','LexOrgSvc','LexOrgUsrSvc',
	    function($scope,  $http, $location, $modal, $log, $fileUploader, Global, LexOrgSvc, LexOrgUsrSvc)
		{
	        $scope.global = Global;
	        $scope.package = {
	            name: 'lexstart'
	        };

	        $scope.addDocClassRow = function() {
	        	console.log('Inside addDocClassRow');
	        	$scope.classes.push({selected : true, name :'', type :'', purpose :''});	        	

	        };

	        $scope.loadDocsForTagging = function() {
	        	console.log('Inside loadDocsForTagging');
	        	$scope.docs = [{name : 'INCP_2102131.pdf', class :'INC_DOC', tags :'name:Sangam\ndate:12Jan2014\nCIN:A123213' , date : '12-Jan-2011', action :''},      		
	        				   {name : 'Board_Mtg_2131.pdf', class :'BMR_DOC', tags :'date:12Jan2014\nName Resolution' , date : '12-Jan-2014', action :''},  
	        				   {name : 'Board_Mtg_245.pdf', class :'BMR_DOC', tags :'date:12Jan2014\nDirector Change' , date : '12-Feb-2014', action :''},  
							   {name : 'INCP_2102131.pdf', class :'INC_DOC', tags :'name:Sangam\ndate:12Jan2014\nCIN:A123213' , date : '12-Jan-2011', action :''},      		
	        				   {name : 'Board_Mtg_2131.pdf', class :'BMR_DOC', tags :'date:12Jan2014\nName Resolution' , date : '12-Jan-2014', action :''},  
	        				   {name : 'Board_Mtg_245.pdf', class :'BMR_DOC', tags :'date:12Jan2014\nDirector Change' , date : '12-Feb-2014', action :''}
	        				 ];
	        	$scope.actions = [{name : 'Change Company Name', value : 1001},
	        					  {name : 'Change Director Name', value : 1002},
	        					  {name : 'Change Company Address', value : 1003}
	        					];

	        };

	        $scope.loadDocTaggingAttributes = function() {
	        	console.log('Inside loadDocTaggingAttributes');

	        	$scope.fields = [ 
									{label:'Name', type :'text',findex:'org_name',supportDocs:'Y',groupId :1, value :''},
									{label:'CIN', type :'text',findex:'cin',supportDocs:'Y',groupId :1, value :''},
									{label:'ROC Code', type :'select',findex:'roc_code',supportDocs:'Y',groupId :1, value :''},
									{label:'PIN', type :'text',findex:'pin_code',supportDocs:'Y',groupId :2, value :''}
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

	        	$scope.groups = [ {id : 1, name : 'Company - Basic Details'},
	        					  {id : 2, name : 'Company - Address Details'},
	        					  {id : 3, name : 'Company - Key Events & Capital Details'}
	        					];

	        	$scope.fields = [ 
									{label:'Name', type :'text',findex:'org_name',supportDocs:'Y',groupId :1},
									{label:'Organization Category', type :'text',findex:'org_cat',supportDocs:'Y',groupId :1},
									{label:'Incorporation Date', type :'text',findex:'inc_dt',supportDocs:'Y',groupId :1},
									{label:'Registration No', type :'text',findex:'reg_no',supportDocs:'Y',groupId :1},
									{label:'Registered Office Address', type :'textarea',findex:'reg_off_add',supportDocs:'Y',groupId :2},
									{label:'TAN', type :'text',findex:'tan',supportDocs:'Y',groupId :1},
									{label:'PAN', type :'text',findex:'pan',supportDocs:'Y',groupId :1},
									{label:'CIN', type :'text',findex:'cin',supportDocs:'Y',groupId :1},
									{label:'ROC Code', type :'text',findex:'roc_code',supportDocs:'Y',groupId :1},
									{label:'Auth Capital', type :'text',findex:'auth_cap',supportDocs:'Y',groupId :3},
									{label:'Paid Up Capital', type :'text',findex:'paid_up_cap',supportDocs:'Y',groupId :3},
									{label:'Activity Description', type :'text',findex:'activity_dsc',supportDocs:'Y',groupId :1},
									{label:'Address Line1', type :'text',findex:'address_line_1',supportDocs:'Y',groupId :2},
									{label:'Address Line2', type :'text',findex:'address_line_2',supportDocs:'Y',groupId :2},
									{label:'City', type :'text',findex:'city',supportDocs:'Y',groupId :2},
									{label:'State', type :'text',findex:'state_name',supportDocs:'Y',groupId :2},
									{label:'Country', type :'text',findex:'country',supportDocs:'Y',groupId :2},
									{label:'PIN', type :'text',findex:'pin_code',supportDocs:'Y',groupId :2},
									{label:'Last AGM Date', type :'text',findex:'date_last_agm',supportDocs:'Y',groupId :3},
									{label:'Last Balance Sheet Date', type :'text',findex:'date_last_bs',supportDocs:'Y',groupId :3}
	        						]; 

	        	$scope.profile = { 
	        						org_name:{value:'Sangam Pvt Ltd',compliant : 'Y', isMCAInfo : 'Y'},
									org_cat:{value:'Private Ltd',compliant : 'Y', isMCAInfo : 'Y'},
									inc_dt:{value:'40310',compliant : 'N', isMCAInfo : 'Y'},
									reg_no:{value:'12347132',compliant : 'Y', isMCAInfo : 'Y'},
									reg_off_add:{value:'24 Hauz Khaz,\nNew Delhi',compliant : 'Y', isMCAInfo : 'Y'},
									tan:{value:'TE79173039TY6',compliant : 'N', isMCAInfo : 'Y'},
									pan:{value:'A1238083278FGD',compliant : 'Y', isMCAInfo : 'Y'},
									cin:{value:'U74140DL2013PTC248145',compliant : 'Y', isMCAInfo : 'Y'},
									roc_code:{value:'ROC_Delhi',compliant : 'N', isMCAInfo : 'Y'},
									auth_cap:{value:'100000',compliant : 'Y', isMCAInfo : 'Y'},
									paid_up_cap:{value:'100000',compliant : 'Y', isMCAInfo : 'Y'},
									activity_dsc:{value:'Venture Capital',compliant : 'N', isMCAInfo : 'Y'},
									address_line_1:{value:'24 B, XYZ Street,',compliant : 'Y', isMCAInfo : 'Y'},
									address_line_2:{value:'Hauz Khaz',compliant : 'N', isMCAInfo : 'Y'},
									city:{value:'New Delhi',compliant : 'Y', isMCAInfo : 'Y'},
									state_name:{value:'Delhi',compliant : 'Y', isMCAInfo : 'Y'},
									country:{value:'India',compliant : 'Y', isMCAInfo : 'Y'},
									pin_code:{value:'119876',compliant : 'Y', isMCAInfo : 'Y'},
									date_last_agm:{value:'4-Jan-2014',compliant : 'Y', isMCAInfo : 'Y'},
									date_last_bs:{value:'11-Apr-2014',compliant : 'Y', isMCAInfo : 'Y'}

	        					};	

	        					

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

	        	//LexstartSvc.query({orgId:'53b55201ad97a73085ea6283'}, function(org) {
	        	//LexstartSvc.get({orgId:'53b56f69625bf2e3a8d30ac3'}, function(org) {	    
	        	LexOrgUsrSvc.get({orgUsrId:'53ab20056570e18c2abd8328'}, function(org) {	
	        		console.log('Fetched Org',org, org.name);
                	$scope.org = org;
                	$scope.profile.f_1.value = $scope.org.name;
                	$scope.profile.f_2.value = $scope.org.inc_date;
                	$scope.profile.f_4.value = $scope.org.tan;
                	$scope.profile.f_5.value = $scope.org.pan;
                	$scope.profile.f_6.value = $scope.org.cin;	
            	});

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

