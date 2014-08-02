'use strict';

var lexctrl = require('../controllers/lexstart');
var lexregctrl = require('../controllers/lexregistration');
var lexadminctrl = require('../controllers/lexadminctrl');


// The Package is past automatically as first parameter
module.exports = function(Lexstart, app, auth, database) {

    app.route('/lexstart/file-upload')
       .post(lexadminctrl.uploadDocs);

    app.route('/lexstart/download/:file_name')
       .get(lexadminctrl.downloadDocs);   

    app.route('/lexreginterest')
        .post(lexregctrl.registerInterest);

    app.route('/loadAllUserOrg/:username')
        .get(lexadminctrl.loadAllUserOrg);  

    app.route('/lexgetdocclasslist')
        .get(lexadminctrl.getDocClassList);   

    app.route('/lexgetorgdoclist/:orgId')
        .get(lexadminctrl.getOrgDocList);     

    app.route('/updateInsertDocClass')
        .post(lexadminctrl.updateInsertDocClass);   

    app.route('/lexgetattributelist')
        .get(lexadminctrl.getAttributeList);                
        

    // app.route('/org')
    //     .get(lexctrl.getAllOrg);

    app.route('/lexgetprospects')
        .get(lexadminctrl.getAllProspects);

    app.route('/updateProspect')
        .post(lexadminctrl.updateProspect); 

    app.route('/createAccount')
        .post(lexadminctrl.createAccount); 
            
    //    .post(auth.requiresLogin, lexctrl.createOrg);


    app.route('/org/:orgId')
        .get(lexctrl.getOrg);
    //    .put(auth.requiresLogin, hasAuthorization, lexctrl.updateOrg);

    // app.route('/userorg/:orgUsrId')
    //     .get(lexctrl.getOrg);

    // app.param('orgId', lexctrl.setOrg);

    // app.param('orgUsrId', lexctrl.setUserOrg);

};
