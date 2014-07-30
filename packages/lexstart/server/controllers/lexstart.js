'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    OrgMdl = mongoose.model('Org'),
    OrgUsrLnkMdl = mongoose.model('lex_user_link'),
    userMdl = mongoose.model('User'),
    LexUsrLnkMdl = mongoose.model('lex_user_link');

var async = require('async');    


/**
 * Find Org by id
 */
exports.setOrg = function(req, res, next, id) {
    console.log('Server lexCtrl:setOrg');
    OrgMdl.loadOrg(id, function(err, org) {
        if (err) return next(err);
        if (!org) return next(new Error('Failed to load Org ' + id));
        req.org = org;
        console.log('Object returned ',org);
        next();
    });
};


/**
 * Find Org by id
 */
exports.setUserOrg = function(req, res, next, id) {
    console.log('Server lexCtrl:getOrgUser');
    var uid =  new mongoose.Types.ObjectId(id);
    // Find linked Org Id for the given user Id
    console.log('Server lexCtrl:getOrgUser - Looking for OrgUser Link for User : ',uid);
    OrgUsrLnkMdl.findOne({user : uid}).exec(
        function(err, userOrg) {
            if (err) return next(err);
            if (!userOrg) return next(new Error('No Orgs to user exists for user : ' + id));            
            console.log('Server lexCtrl:getOrgUser - Found userOrgLink : ', userOrg);
            console.log('Type of userOrg.org : ', typeof(userOrg.org));
            var oid =  new mongoose.Types.ObjectId(userOrg.org);
            console.log('Type of oid : ', typeof(oid));
            
            console.log('Server lexCtrl:getOrgUser - Looking for Org for oid : ', oid, OrgMdl.collection);
            OrgMdl.findOne({_id : userOrg.org}).exec(function(err, org) {
            //OrgMdl.find().exec(function(err, org) {    
                    if (err) return next(err);
                    if (!org) return next(new Error('Failed to find Org for : ' + oid));
                    console.log('Server lexCtrl:getOrgUser - Found Org for userOrg : ', org);
                    req.org = org;
                    next();                
            });            
    });
};

/**
 * Find Org by id
 */
exports.getOrg = function(req, res, next) {
    console.log('Server lexCtrl:getOrg');
    res.jsonp(req.org);
};

/**
 * List of Articles
 */
exports.getAllOrg = function(req, res) {
   console.log('Invoke GetAllOrg called');
   res.status(200).send('Ok');
};


exports.getLexUsrDtl = function(req, res, next) {
    console.log('Server lextestCtrl:getLexUsrDtl');

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