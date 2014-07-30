'use strict';

var app = angular.module('mean.lexstart');

app.controller('LexRegistrationCtrl', 
	    function($scope, $http, $location, Global)
	    {
	        $scope.global = Global;

	        $scope.LexRegnCtrlScope = {};

	        $scope.loadRegisterInterestForm = function() {
	        	if (!$scope.submitted)
	        		$scope.prospect = {opt1 : false, opt2 : false, opt3 : false, opt4 : false}; 	        	
	        };
	        
	        $scope.postRegisterInterest = function(isValid) {
				console.log('inside post registration data form', $scope.prospect);

	            if (isValid) {
	                $http.post('/lexreginterest',
	                		   {prospect : $scope.prospect}
	        		).success(function(data, status, headers, config) {
	        				console.log('success response', data.regn_token);
	        				$scope.global.regn_token = data.regn_token;
					      	$location.path('/lexstart/regnInterestResp');
					}).error(function(data, status, headers, config) {
							console.log('error response');
					});
	                
	            } else {
	                $scope.submitted = true;
	            }
        	};  	  

	        
		}	
);

