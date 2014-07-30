'use strict';

var lexctrl = require('../controllers/lexstart');
var lexregctrl = require('../controllers/lexregistration');
var lexadminctrl = require('../controllers/lexadminctrl');
var multiparty = require('multiparty');
var util = require('util');


// The Package is past automatically as first parameter
module.exports = function(Lexstart, app, auth, database) {

    

    app.post('/lexstart/file-upload', function(req, res, next) {
        console.log('data posted via upload form');
        //console.log(req);
        var _uploadDir = 'C:\\temp\\lexstart';
        var form = new multiparty.Form({uploadDir : _uploadDir});

        form.parse(req, function(err, fields, files) {
            console.log('files uploaded');
            console.log('Files =>',files);
            console.log('Fields => ',fields);

            res.writeHead(200, {'content-type': 'text/plain'});
            res.write('received upload:\n\n');
            res.end(util.inspect({fields: fields, files: files}));
        });
        //console.log(req.files);
        //res.status(200).send('File received on server');
    });

    app.route('/lexreginterest')
        .post(lexregctrl.registerInterest);

    app.route('/lexgetdocclasslist')
        .get(lexadminctrl.getDocClassList);    

    app.route('/updateInsertDocClass')
        .post(lexadminctrl.updateInsertDocClass);   

    app.route('/lexgetattributelist')
        .get(lexadminctrl.getAttributeList);                
        

    app.route('/org')
        .get(lexctrl.getAllOrg);

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

    app.route('/userorg/:orgUsrId')
        .get(lexctrl.getOrg);

    app.param('orgId', lexctrl.setOrg);

    app.param('orgUsrId', lexctrl.setUserOrg);

};
