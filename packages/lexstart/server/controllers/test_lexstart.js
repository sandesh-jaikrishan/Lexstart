'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    userMdl = mongoose.model('User'),
    LexUsrLnkMdl = mongoose.model('lex_user_link');

var async = require('async');    



/**
 * Find Org by id
 */
exports.testService = function(req, res, next) {
    console.log('Server lextestCtrl:testService');

    async.waterfall([
                    function(callback) { 
                        userMdl.findOne({username : 'karthik'}).exec(
                            function(err, user) {
                                if (err) return callback(err);
                                if (!user) return callback(new Error('No user record exists for username : karthik'));            
                                console.log('User Found : ', user);
                                callback(null,user);
                            }    
                        );    
                    },
                    // Fetch Org, Person & User Details
                    function(usr, callback){
                        LexUsrLnkMdl.findOne({user : usr._id}).populate('org').populate('person').populate('user').exec(
                            function(err, usrlnk) {
                                if (err) return callback(err);
                                if (!usrlnk) return callback(new Error('No user link record exists for username : karthik'));            
                                console.log('User Link Found : ', usrlnk);
                                callback(null,usrlnk);
                            }    
                        );                           

                    }],
                        function(err, results) {
                            if (err) return next(err);
                            res.jsonp(results);
                    });    
    
    //res.status(200).send('Ok');


};



