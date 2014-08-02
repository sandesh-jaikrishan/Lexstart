'use strict';

angular
	.module('mean.lexstart')
		.factory('LexOrgSvc', [ '$resource',
				  function($resource) 
				 	{
						return $resource('/org/:orgId',{orgId: '@id'});
	   		 		}
				 ]);


					 	
