'use strict';

var lextestctrl = require('../controllers/test_lexstart');


// The Package is past automatically as first parameter
module.exports = function(Lexstart, app, auth, database) {

    

     app.route('/testsvc')
        .get(lextestctrl.testService);

    

};
