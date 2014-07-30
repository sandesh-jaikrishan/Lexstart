'use strict';

angular
	.module('mean.lexstart')
		.factory('LexOrgSvc', [ '$resource',
				  function($resource) 
				 	{
						return $resource('/org/:orgId',{orgId: '@id'});
	   		 		}
				 ]);

angular
	.module('mean.lexstart')
		.factory('LexOrgUsrSvc', [ '$resource',
				  function($resource) 
				 	{
						return $resource('/userorg/:orgUsrId',{orgUsrId: '@id'});
	   		 		}
				 ]);	

					 	
