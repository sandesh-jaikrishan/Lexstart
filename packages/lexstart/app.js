'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Lexstart = new Module('lexstart');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
 
Lexstart.register(function(app, auth, database) {

    //We enable routing. By default the Package Object is passed to the routes
    Lexstart.routes(app, auth, database);

    Lexstart.angularDependencies(['ngTable','angularFileUpload','multi-select']);
 

  //We are adding a link to the main menu for all authenticated users
   /***** 
    Lexstart.menus.add({
        title: 'Compliance',
        link: 'compliance',
        //roles: ['admin'],
        menu: 'main'
    });
   *****/
    // Lexstart.menus.add({
    //     title: 'Test',
    //     link: 'test',
    // //    roles: ['admin'],
    //     menu: 'main'
    // });

    // Lexstart.menus.add({
    //     title: 'Select Org',
    //     link: 'selectorg',
    //     roles: ['lexuser','lexadmin'],
    //     menu: 'main'
    // });

    Lexstart.menus.add({
        title: 'Profile',
        link: 'profile',
        roles: ['lexuser','lexadmin'],
        menu: 'main'
    });
	
	// Lexstart.menus.add({
 //        title: 'Service Request',
 //        link: 'svcrequest',
 //        roles: ['lexuser'],
 //        menu: 'main'
 //    });

    Lexstart.menus.add({
        title: 'Verify Docs',
        link: 'verifydocs',
        roles: ['lexadmin'],
        menu: 'main'
    });

    Lexstart.menus.add({
        title: 'Doc Class',
        link: 'admindocclass',
        roles: ['lexadmin'],
        menu: 'main'
    });

    Lexstart.menus.add({
        title: 'Legal Action',
        link: 'adminactiontype',
        roles: ['lexadmin'],
        menu: 'main'
    });

    Lexstart.menus.add({
        title: 'Event Class',
        link: 'admineventclass',
        roles: ['lexadmin'],
        menu: 'main'
    });
    

    // Lexstart.menus.add({
    //     //title: 'Classification',
    //     link: 'admineditdocclass',
    //    // roles: ['lexadmin'],
    //     menu: 'main'
    // });

	/*
    Lexstart.menus.add({
        title: 'Register',
        link: 'lexregister',     
		roles: ['lexadmin'],
        menu: 'main'
    });
*/
    Lexstart.menus.add({
        title: 'Registrations',
        link: 'prospects',
        roles: ['lexadmin'],
        menu: 'main'
    });

    // Lexstart.menus.add({
    //     title: 'Registrations',
    //     link: 'registrations',
    // //    roles: ['lexadmin'],
    //     menu: 'main'
    // });

    Lexstart.menus.add({
        title: 'Upload Docs',
        link: 'uploadDocs',
        roles: ['lexadmin'],
        menu: 'main'
    });

    // Lexstart.menus.add({
    //     title: 'Register Interest',
    //     link: 'registerinterest',
    // //    roles: ['lexadmin'],
    //     menu: 'main'
    // });

    Lexstart.aggregateAsset('css', 'lexstart.css');

    /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Lexstart.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Lexstart.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Lexstart.settings(function(err, settings) {
        //you now have the settings object
    });
    */

    return Lexstart;
});
