'use strict';

angular.module('mean.lexstart').config(['$stateProvider',
    function($stateProvider) {
       $stateProvider
        // .state('lexstart example page', {
        //     url: '/lexstart/example',
        //     templateUrl: 'lexstart/views/index.html'
        // })
        .state('compliance',{
        	url: '/lexstart/compliance',
        	templateUrl: '/lexstart/views/compliance.html'
        })
        .state('selectorg',{
            url: '/lexstart/selectorg',
            templateUrl: '/lexstart/views/selectorg.html'
        })        
        .state('profile',{
            url: '/lexstart/profile',
            templateUrl: '/lexstart/views/profile.html'
        })
		.state('svcrequest',{
            url: '/lexstart/svcrequest',
            templateUrl: '/lexstart/views/svcrequest.html'
        })
        .state('regnInterestResp',{
            url: '/lexstart/regnInterestResp',
            templateUrl: '/lexstart/views/regnInterestResp.html'
        })
        .state('registrations',{
            url: '/lexstart/registration',
            templateUrl: '/lexstart/views/registrations.html'
        })
        .state('prospects',{
            url: '/lexstart/prospects',
            templateUrl: '/lexstart/views/prospectlist.html'
        })
        .state('uploadDocs',{
            url: '/lexstart/uploadDocs',
            templateUrl: '/lexstart/views/uploadDocs.html'
        })
        .state('verifydocs',{
            url: '/lexstart/verifydocs',
            templateUrl: '/lexstart/views/verifydocs.html'
        })
        .state('tagdoc',{
            url: '/lexstart/tagdoc',
            templateUrl: '/lexstart/views/tagdoc.html'
        })
        .state('initaction',{
            url: '/lexstart/initaction',
            templateUrl: '/lexstart/views/initaction.html'
        })
        .state('admindocclass',{
            url: '/lexstart/admindocclass',
            templateUrl: '/lexstart/views/admindocclass.html'
        })
        .state('adminactiontype',{
            url: '/lexstart/adminactiontype',
            templateUrl: '/lexstart/views/adminactiontype.html'
        })  
        .state('admineventclass',{
            url: '/lexstart/admineventclass',
            templateUrl: '/lexstart/views/admineventclass.html'
        }) 
        .state('adminactionmap',{
            url: '/lexstart/adminactionmap',
            templateUrl: '/lexstart/views/adminactionmap.html'
        })        
        .state('admineditdocclass',{
            url: '/lexstart/admineditdocclass',
            templateUrl: '/lexstart/views/admineditdocclass.html'
        })
        .state('multiselect',{
            url: '/lexstart/multiselect',
            templateUrl: '/lexstart/views/multiselect.tmpl.html'
        })
        .state('registerinterest',{
            url: '/lexstart/registerinterest',
            templateUrl: '/lexstart/views/registerinterest.html'
        })
        .state('test',{
            url: '/lexstart/test',
            templateUrl: '/lexstart/views/test.html'
        });
    }
]);
