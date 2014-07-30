'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    ProspectMdl = mongoose.model('prospect');

var crypto = require('crypto'),
    nodemailer = require('nodemailer'),
    templates = require('../template'),
    async = require('async');    

var config = require('meanio').loadConfig();    

/**
 * Register Prospect Interest
 */
exports.registerInterest = function(req, res, next) {
    console.log('Server lexCtrl:registerInterest', req.body);
    var rp = req.body.prospect; 
    console.log('Server lexCtrl:registerInterest', rp);
    // Map prospect type
    var prospect_type = rp.opt1 ? 1 : (rp.opt2 ? 2 : (rp.opt3 ? 3 : (rp.opt4 ? 4 : 0)));
    rp.prospect_type = prospect_type;
    console.log('Updated request body', rp);
    var prospect = new ProspectMdl(rp);
    console.log('Updated request body', prospect.name);
    // Set registration token
    //prospect.regn_token = 'AB12334123';

     async.waterfall([
                    // Set registration token
                    function(callback){
                        console.log('About to generate security tokens');
                        var email_token = '';
                        crypto.randomBytes(20, function(err, buf) {
                          if (err) return callback(err);   
                          console.log('generated email token', buf);
                          email_token = buf.toString('hex');   
                          callback(null, email_token);                       
                        });
                        
                        
                    },
                    // Set Email token
                    function(email_token,callback){
                        console.log('About to generate security tokens');
                        var regn_token = '';
                        crypto.randomBytes(6, function(err, buf) {
                          if (err) return callback(err);   
                          console.log('generated email token', buf);
                          regn_token = buf.toString('hex'); 
                          callback(null, email_token, regn_token);                         
                        });
                    },
                    // Save Prospect request to DB
                    function(email_token, regn_token,callback) { 
                        console.log('Tokens', email_token, regn_token);
                        console.log('About to save Prospect Data');
                        prospect.mail_token = email_token;
                        prospect.regn_token = regn_token;
                        prospect.prospect_status = 1;
                        prospect.capture_date = new Date();
                        prospect.save(function(err) {
                            if (err) return callback(err);
                            console.log('Saved Prospect successfully');                                
                            callback(null,prospect);                            
                        });
                    },
                    // Email Prospect
                    function(prospect, callback) {
                        console.log('About to Send email');
                        var mailOptions = {
                          to: prospect.email,
                          from: config.emailFrom
                        };
                        mailOptions = templates.register_interest_email(prospect.name, req, prospect.mail_token, mailOptions);
                        var transport = nodemailer.createTransport('SMTP', config.mailer);
                        transport.sendMail(mailOptions, function(err, response) {
                            if (err) return callback(err);
                            console.log('Mail Sent successfully');
                            callback(null, prospect);
                        });
                        
                      }
                    ],    
                    function(err, results) {
                            if (err) return res.send({errors: err.errors});
                            res.jsonp({regn_token: results.regn_token});
                    });   

};




