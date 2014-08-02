'use strict';

/**
 * Module dependencies.
 */

var us= require('underscore');
var multiparty = require('multiparty');
var path = require('path');
var mime = require('mime');
var fs = require('fs');

var mongoose = require('mongoose'),
    ProspectMdl = mongoose.model('prospect'),
    OrganizationMdl = mongoose.model('organization'),
    PersonMdl = mongoose.model('person'),
    UserMdl = mongoose.model('User'),
    EmailMdl = mongoose.model('email'),
    PhoneMdl = mongoose.model('phone'),
    AddressMdl = mongoose.model('address'),
    DocClassMdl = mongoose.model('doc_class'),
    DocumentModel = mongoose.model('documents'),
    DocTagModel = mongoose.model('doc_tags'),
    DocClassTagsMdl = mongoose.model('doc_class_tags'),
    AttributeMdl = mongoose.model('attribute'),
    LexUsrLnkMdl = mongoose.model('lex_user_link');

var config = require('meanio').loadConfig();    
var nodemailer = require('nodemailer'),
    templates = require('../template'),
    async = require('async');  


exports.loadAllUserOrg = function(req,res) {
    var _username=req.params.username;

    async.waterfall([
                    // Get User 
                    function(callback) { 
                        console.log('About to save user record');
                        UserMdl.findOne({username : _username}).exec(function(err, _user) {
                            if (err) { console.log('Error finding user',_username,err); return callback(err);}
                            console.log('Found User record successfully', _user);                                
                            callback(null, _user);                            
                        });
                        
                    },
                    // Get orgs link to user
                    function(_user, callback) {
                        console.log('About to fetch linked Orgs for user',_user);
                        if (_user.roles.indexOf('lexadmin')!==-1) 
                        {
                            LexUsrLnkMdl.find().populate('org').exec(function(err,_usrLnkList){
                                if (err) { console.log('Error finding linked org for ',_username,err); return callback(err);}
                                console.log('Found Org linked to User successfully');
                                _parseOrgList(_usrLnkList);
                                 
                            });    
                        }
                        else if (_user.roles.indexOf('lexadmin')!==-1) 
                        {
                            LexUsrLnkMdl.find({user : _user._id}).populate('org').exec(function(err,_usrLnkList){
                                if (err) { console.log('Error finding linked org for ',_username,err); return callback(err);}
                                console.log('Found Org linked to User successfully');
                                _parseOrgList(_usrLnkList);
                                 
                            });
                        }
                        
                        function _parseOrgList(_usrLnkList){
                            var orgList = [];  
                            _usrLnkList.forEach(function(item){
                                orgList.push(item.org);
                            });                            
                            callback(null, _user,orgList); 

                        }                       
                    }
                    ],    
                    function(err, _user,_orgList) {
                            if (err) return res.status(400).send({errors: err.errors});
                            res.jsonp({orgList : _orgList});
                    });   


};      


exports.downloadDocs = function(req, res) {
    console.log('download docs');
    var file_name=req.params.file_name;

    console.log('document to download',file_name);

    var file = 'C:\\temp\\lexstart\\' + file_name;

    var filename = path.basename(file);
    var mimetype = mime.lookup(file);
    

    // to open document in browser
    res.setHeader('Content-disposition', 'inline; filename=' + filename);
    // to download document
    //res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', mimetype);

    var filestream = fs.createReadStream(file);
    filestream.pipe(res);
};

exports.uploadDocs = function(req, res, next) {
        console.log('data posted via upload form');
        var _uploadDir = 'C:\\temp\\lexstart';


        async.waterfall([
                    // Get Doc Class Address
                    function(callback){
                        var form = new multiparty.Form({uploadDir : _uploadDir});
                        form.parse(req, function(err, fields, files) {
                            if (err) { console.log('Error uploading file',files,err); return callback(err);}
                            // processing on successful uploading

                            console.log('Files =>',typeof files ,files);
                            console.log('Fields => ',typeof fields,fields);
                            console.log('Files =>',typeof files ,files.file);
                            var docClassInst = JSON.parse(fields.value);
                            var fileDtl = files.file[0];
                            docClassInst.file_name = path.basename(fileDtl.path);
                            docClassInst.orig_file_name = fileDtl.originalFilename;
                            docClassInst.file_size = fileDtl.size;

                           
                            console.log('docClassInst => ',docClassInst);
                            callback(null,docClassInst);
                            
                            // res.writeHead(200, {'content-type': 'text/plain'});
                            // res.write('received upload:\n\n');
                            // res.end(util.inspect({fields: fields, files: files}));
                        });
                    },
                    function(docClassInst, callback){
                        var doc = new DocumentModel(docClassInst);

                        doc.save(function(err,_doc) {
                            if (err) { console.log('Error creating Document', doc, err); return callback(err);}
                                console.log('Created new document successfully',_doc);   
                                docClassInst._id = _doc.id;                             
                                callback(null,docClassInst);
                         });
                    },
                    function(docClassInst, callback){

                        docClassInst.tags.forEach(function(tag){
                            tag.doc_id = docClassInst._id;
                        });

                        console.log('About to save docClass tags record');
                        DocTagModel.create(docClassInst.tags,function(err) {
                            if (err) { console.log('Error creating document tags ',docClassInst.tags, err); return callback(err);}
                            console.log('Created new DocClassTags successfully');                                
                            callback(null,docClassInst);                            
                        });
                    },
                    // Update organization & related table
                    function(docClassInst, callback){
                        docClassInst.org = {};
                        docClassInst.org.update_status = false;
                        docClassInst.org.update_query = {};
                        docClassInst.tags.forEach(function(tag){
                            if (tag.table_name === 'organization')
                            {
                                docClassInst.org.update_query[tag.attribute_name] = tag.value; 
                            }
                            
                        });

                        console.log('Org update query', docClassInst.org_id, docClassInst.org.update_query);

                        OrganizationMdl.update({_id : docClassInst.org_id},
                          docClassInst.org.update_query, 
                          function(err,numberAffected, rawResponse) {
                              if (err) console.log('Error updating organization ', err);
                              docClassInst.org.err = err;
                              finalize();
                        }); 

                        function finalize() {
                            if (docClassInst.org.update_status)
                            {
                                callback(null,docClassInst); 
                            }

                        }                       
                    }

                    ],    
                    function(err, docClassInst) {
                        if (err) return res.status(400).send({errors: err.errors});
                        console.log('successfully create document ',docClassInst);
                        res.status(200).send('Ok');                        
                    }); 
                        
};                
    

/**
 * Register Prospect Interest
 */
exports.getAllProspects = function(req, res, next) {
    console.log('Server Inside lexCtrl:getAllProspects', req.body);

    ProspectMdl.find().exec(function(err, prospects) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp({prospects : prospects});
        }
    });
};    

/**
 * Register Prospect Interest
 */
exports.getOrgDocList = function(req, res, next) {
    console.log('Server Inside lexCtrl:getOrgDocList', req.body);
    var orgId=req.params.orgId;

    DocumentModel.find({org_id : orgId}).populate('doc_class_id').exec(function(err, docs) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp({orgDocs : docs});
        }
    });
};    

exports.getDocClassList_old = function(req,res,next) {
    console.log('Inside getAllDocClassWithAttrList');
    DocClassTagsMdl.find().populate('doc_class_id').populate('attribute_id').exec(function(err, docTagList) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            var docClassList = [];
            //console.log('Doc Tag List : ',docTagList);
            // Returned BSON object contain mongoose specific attr and fuctions that meddle
            // during object manipulation, hence converting to JSON string and back to JS object
            // to get pure db column value attributes for parsing, manipulation and sending back
            var str = JSON.stringify(docTagList);
            docTagList = JSON.parse(str);
            docTagList.forEach( function(item) {                
                var docclsid = item.doc_class_id._id;                
                var docClass = us.find(docClassList, function(element) {return element._id === docclsid;});
                //if (!docClassList[docclsid]) 
                if (typeof docClass === 'undefined') 
                {
                    docClass = {} ;
                    us.extend(docClass, item.doc_class_id); 
                    docClass.tags = [];
                    //docClassList[docclsid] = docClass;
                    docClassList.push(docClass);
                }
                // else
                // {
                //     docClass = docClassList[docclsid];
                // }
                delete item.doc_class_id;
                docClass.tags.push(item);                
            });
            console.log('Doc Class List : ',docClassList);
            res.setHeader('Date', new Date().toString());
            res.jsonp({docClassList : docClassList});
        }
    });
};

exports.getDocClassList = function(req,res,next) {
    console.log('Inside getAllDocClassWithAttrList');

    async.waterfall([
                    // Get Doc Class Address
                    function(callback){
                         DocClassMdl.find().exec(function(err, docClassList) {
                            if (err) { console.log('Error completing operation',err); return callback(err);}
                                console.log('Created new DocClassTags successfully');                                
                                callback(null,docClassList);
                         });

                    },
                    function(docClassList, callback){
                        DocClassTagsMdl.find().populate('attribute_id').exec(function(err, docTagList) {
                        if (err) { console.log('Error completing operation',err); return callback(err);}
                                console.log('Created new DocClassTags successfully');                                
                                callback(null,docClassList, docTagList);
                         });
                    }
                    ],    
                    function(err, docClassList, docTagList) {
                        if (err) return res.status(400).send({errors: err.errors});
                        var str = JSON.stringify(docTagList);
                        docTagList = JSON.parse(str);
                        str = JSON.stringify(docClassList);
                        docClassList = JSON.parse(str);
                        docClassList.forEach(function(item){
                            item.tags = [];
                            for (var i=0;i<docTagList.length;i++)
                            {
                                var tag = docTagList[i];
                                if (tag.doc_class_id===item._id)
                                {
                                    item.tags.push(tag);
                                }
                            }
                        });
                        res.setHeader('Date', new Date().toString());
                        res.jsonp({docClassList : docClassList});                            
                    }); 
};

exports.getAttributeList = function(req,res,next) {
    console.log('Inside lexgetattributelist');
    AttributeMdl.find().exec(function(err, attributeList) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            console.log('Attribute List : ',attributeList);
            res.setHeader('Date', new Date().toString());
            res.jsonp({attributeList : attributeList});
        }
    });
};

exports.updateProspect = function(req, res, next) {
    console.log('Server Inside lexCtrl:updateProspect', req.body);
    var _prospect = req.body.prospect;

    ProspectMdl.update({_id : _prospect._id},
                          {name : _prospect.name, 
                          email : _prospect.email,
                          company : _prospect.company,
                          cin : _prospect.cin,
                          prospect_status : _prospect.prospect_status,
                          prospect_type : _prospect.prospect_type,
                          notes : _prospect.notes }, 
                          function(err,numberAffected, rawResponse) {
                            if (err) {
                                console.log('Error updating prospect',err);
                                res.render('error', {
                                    status: 500
                                });
                            } else {
                                res.status(200).send('Ok');
                            }
                        });
};        

exports.updateInsertDocClass = function(req, res, next) {
    console.log('Server Inside lexCtrl:updateInsertDocClass', req.body);
    var _docClass = req.body.docClass;
    req.assert('docClass.doc_mnemonic', 'Mnemonic cannot be empty').notEmpty();
    req.assert('docClass.doc_name', 'Doc Name cannot be empty').notEmpty();
        
    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).send(errors);
    }
    var docClass = new DocClassMdl();
    if (_docClass._id)
        docClass._id = _docClass._id;
    docClass.doc_mnemonic = _docClass.doc_mnemonic;
    docClass.doc_name = _docClass.doc_name;
    docClass.purpose = _docClass.purpose;
    docClass.doc_type = _docClass.doc_type;

    var docClassTags = _docClass.tags;
    var createDocClassTags = [];
    var deleteDocClassTags = [];
    var updateDocClassTags = [];

    // for (var i=docClassTags.length-1;i>=0;i--)
    // {
    //     var item = docClassTags[i];
    //     if (!item._id)
    //     {
    //         newDocClassTags.push(item);
    //         docClassTags.splice(i,1);
    //     }
    // }
    docClassTags.forEach(function(item){
        if (item.operation === 'create')
            createDocClassTags.push(item);
        else if (item.operation === 'update')
            updateDocClassTags.push(item);
        else if (item.operation === 'delete')
            deleteDocClassTags.push(item);
    });
    



    async.waterfall([
                    // Create Doc Class
                    function(callback){
                        console.log('About to update/create docClass Address');
                        //Create if duplicate error do an update...
                        docClass.save(function(err, _docClass) {
                            if (err) 
                            {
                                if (err.code === 11000)     
                                {
                                    DocClassMdl.update({_id : docClass._id},
                                                       {doc_name : docClass.doc_name, 
                                                        doc_type : docClass.doc_type,
                                                        purpose : docClass.purpose,
                                                        doc_mnemonic : docClass.doc_mnemonic}, function(err){
                                                            if (err) { console.log('Error completing operation',err); return callback(err);}
                                                            console.log('Saved docClass successfully', docClass);                                
                                                            callback(null,docClass); 
                                                        });
                                }
                                else
                                {  
                                    console.log('Error completing operation',err); 
                                    return callback(err);
                                }
                            }
                            else
                            {
                                console.log('Saved docClass successfully', _docClass);                                
                                callback(null,_docClass);                            
                            }
                        });
                    },
                    // Create Doc Class Tags
                    function(_docClass,callback){
                        if (createDocClassTags.length > 0)
                        {
                            console.log('About to save docClass tags record');
                            createDocClassTags.forEach(function(item){
                                item.doc_class_id = _docClass._id;
                                item.attribute_id = item.attribute_id._id;
                            });

                            DocClassTagsMdl.create(createDocClassTags,function(err) {
                                if (err) { console.log('Error completing operation',err); return callback(err);}
                                console.log('Created new DocClassTags successfully');                                
                                callback(null,_docClass);                            
                            });
                        }   
                        else
                        {
                            callback(null,_docClass);
                        }                     
                    },
                    // UPdate doc class tags
                    function(_docClass,callback){
                        if (updateDocClassTags.length > 0)
                        {
                            updateDocClassTags.forEach(function(item){
                                console.log('About to update docClass tags record',item); 
                                DocClassTagsMdl.update({_id : new mongoose.Types.ObjectId(item._id)},
                                                    { $set:{doc_class_id : _docClass._id, 
                                                    attribute_id : item.attribute_id._id, 
                                                    reference_type : item.reference_type}}, function(err) {
                                    if (err) { console.log('Error completing operation',item,err); return callback(err);}
                                    console.log('Updated new DocClassTags successfully', item);                                                                  
                                    
                                });

                            });
                            callback(null,_docClass);                            
                        }   
                        else
                        {
                            callback(null,_docClass);
                        }                     
                    },
                    // delete doc class tags
                    function(_docClass,callback){
                        if (deleteDocClassTags.length > 0)
                        {
                            console.log('About to delete docClass tags record');
                            deleteDocClassTags.forEach(function(item){
                                item.doc_class_id = _docClass._id;
                                item.attribute_id = item.attribute_id._id;
                                var docClassTag = new DocClassTagsMdl(item); 
                                docClassTag.remove(function(err) {
                                    if (err) { console.log('Error deleting docClass Tag operation : ',docClassTag._id,err); return callback(err);}
                                    console.log('Deleted DocClassTags successfully',docClassTag._id);
                                });

                            });
                            callback(null,_docClass);                            
                        }   
                        else
                        {
                            callback(null,_docClass);
                        }                     
                    }
                    ],    
                    function(err, _docClass) {
                            if (err) return res.status(400).send({errors: err.errors});
                            res.status(200).send('Ok');
                    }); 


};

exports.createAccount = function(req, res, next) {
    console.log('Server Inside lexCtrl:updateProspect', req.body);
    var prospect = req.body.prospect;
    req.assert('prospect.name', 'You must enter a name').notEmpty();
    req.assert('prospect.email', 'You must enter a valid email address').isEmail();
    
    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).send(errors);
    }

    var user = new UserMdl();
    console.log('User initialization ',user);
    user.name = prospect.name;
    user.email = prospect.email;
    user.username = prospect.email;
    user.password = prospect.regn_token;
    user.provider = 'local';
    user.roles =  ['lexuser'];
    console.log('User initialization ',user);

    var org = new OrganizationMdl();
    console.log('Organization initialization ',org);
    org.org_name = prospect.company;
    org.cin = prospect.cin;
    org.last_upd_dt = new Date();
    console.log('Organization initialization ',org);

    var person = new PersonMdl();
    console.log('Person initialization ',person);
    person.full_name = prospect.name;
    console.log('Person initialization ',person);

    var address = new AddressMdl();
    address.address_line_1 = '';
    address.address_line_2 = '';

    var person_email = new EmailMdl();
    person_email.email = prospect.email;

    var person_phone = new PhoneMdl();
    person_phone.phone = prospect.phone;    

    var lexUsrLnk = new LexUsrLnkMdl();

    //prospect.regn_token = 'AB12334123';

     async.waterfall([
                    // Create Address
                    function(callback){
                        console.log('About to create Person Address');
                        address.save(function(err, _address) {
                            if (err) { console.log('Error completing operation',err); return callback(err);}
                            console.log('Saved Address successfully', _address);                                
                            callback(null,_address);                            
                        });
                    },
                    // Set Person Address Email
                    function(_address,callback){
                        console.log('About to save person address email record');
                        person_email.address_id = _address._id;
                        person_email.save(function(err, _person_email) {
                            if (err) { console.log('Error completing operation',err); return callback(err);}
                            console.log('Saved Address Email successfully', _person_email);                                
                            callback(null,_address);                            
                        });
                        
                    },
                    // Set Person Address Phone
                    function(_address,callback) { 
                        console.log('About to save person address phone record');
                        person_phone.address_id = _address._id;
                        person_phone.save(function(err, _person_phone) {
                            if (err) { console.log('Error completing operation',err); return callback(err);}
                            console.log('Saved Address Phone successfully', _person_phone);                                
                            callback(null,_address);                            
                        });
                    },
                    // Set Person Address Phone
                    function(_address,callback) { 
                        console.log('About to save person address phone record');
                        person.address_id = _address._id;
                        person.save(function(err, _person) {
                            if (err) { console.log('Error completing operation',err); return callback(err);}
                            console.log('Saved Person record successfully', _person);                                
                            callback(null, _person);                            
                        });
                    },
                    // Set Organization 
                    function(_person, callback) { 
                        console.log('About to save organization record',org);
                        org.save(function(err, _org) {
                            if (err) { console.log('Error completing operation',err); return callback(err);}
                            console.log('Saved Organization record successfully', _org);                                
                            callback(null, _person, _org);                            
                        });
                    },
                    // Set User 
                    function(_person,_org, callback) { 
                        console.log('About to save user record');
                        user.save(function(err, _user) {
                            if (err) { console.log('Error completing operation',err); return callback(err);}
                            console.log('Saved User record successfully', _user);                                
                            callback(null, _person, _org, _user);                            
                        });
                        
                    },
                    function(_person,_org, _user, callback) { 
                        console.log('About to save User-Org-Person link record');
                        lexUsrLnk.org = _org._id;
                        lexUsrLnk.person = _person._id;
                        lexUsrLnk.user = _user._id;
                        lexUsrLnk.save(function(err, _lexUsrLnk) {
                            if (err) { console.log('Error completing operation',err); return callback(err);}
                            console.log('Saved User-Org-Person link record successfully', _lexUsrLnk);                                
                            callback(null, _person, _org, _user);                            
                        });                        
                    },
                    function(_person,_org, _user, callback) { 
                        console.log('About to save User-Org-Person link record');
                        lexUsrLnk.org = _org._id;
                        lexUsrLnk.person = _person._id;
                        lexUsrLnk.user = _user._id;
                        lexUsrLnk.save(function(err, _lexUsrLnk) {
                            if (err) { console.log('Error completing operation',err); return callback(err);}
                            console.log('Saved User-Org-Person link record successfully', _lexUsrLnk);                                
                            callback(null, _person, _org, _user);                            
                        });                        
                    },
                    // Send Person 
                    function(_person, _org, _user, callback) {
                        console.log('About to Send email');
                        var mailOptions = {
                          to: prospect.email,
                          from: config.emailFrom                         
                        };
                        mailOptions = templates.account_open_email(prospect, mailOptions);
                        var transport = nodemailer.createTransport('SMTP', config.mailer);
                        transport.sendMail(mailOptions, function(err, response) {
                            if (err) { console.log('Error completing operation',err); return callback(err);}
                            console.log('Mail Sent successfully');
                            callback(null, _person, _org, _user);
                        });
                        
                      },
                      function(_person, _org, _user, callback){
                        ProspectMdl.update({_id : prospect._id},{prospect_status : 3}, 
                        function(err,numberAffected, rawResponse) {
                            if (err) {console.log('Error updating prospect status',err);return callback(err);}
                            console.log('Prospect Status updated successfully');
                            callback(null, _person, _org, _user);
                        });
                      }
                    ],    
                    function(err, _person, _org, _user) {
                            if (err) return res.status(400).send({errors: err.errors});
                            res.status(200).send('Ok');
                    });   

};
    



