'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AddressSchema = new Schema(
{	
	address_line_1  : {type: String,default: '',trim: true},
	address_line_2  : {type: String,default: '',trim: true},
	city  : 		  {type: String,default: '',trim: true},
	state_code  : {type: String,default: '',trim: true},
	pin_code  : {type: String,default: '',trim: true}
},
{
    collection : 'address'
}
);



	
mongoose.model('address', AddressSchema);	
	
var AttributeSchema = new Schema(
{	
	attribute_name  : {type: String,default: '',trim: true},
	table_name : {type: String,default: '',trim: true},
	col_name : {type: String,default: '',trim: true}, 
	col_data_type : {type: String,default: '',trim: true},
	col_valset_cdtype : {type: String,default: '',trim: true}
},
{
    collection : 'attribute'
}
);	



mongoose.model('attribute', AttributeSchema);	

var PersonSchema = new Schema(
{
	full_name : {type: String,default: '',trim: true},
	first_name : {type: String,default: '',trim: true},
	middle_name : {type: String,default: '',trim: true},
	last_name : {type: String,default: '',trim: true},
	salutation : {type: String,default: '',trim: true},
	pan : {type: String,default: '',trim: true},
	din : {type: String,default: '',trim: true},
	nationality : {type: String,default: '',trim: true},
	date_of_birth  : {type: Date},
	gender : {type: String,default: '',trim: true},
	fathers_full_name: {type: String,default: '',trim: true},
	address_id : {type: Schema.Types.ObjectId, ref: 'address' }
},
{
    collection : 'person'
}
);	
mongoose.model('person', PersonSchema);	

var OrganizationSchema = new Schema(
{
	org_name : {type: String,default: '',trim: true},
	inc_dt : {type: Date},  
	pan  : {type: String,default: '',trim: true},
	tan  : {type: String,default: '',trim: true},
	cin  : {type: String,default: '',trim: true},
	reg_no  : {type: Number},
	activity_dsc  : {type: String,default: '',trim: true},
	org_type   : {type: String,default: '',trim: true},
	roc_code  : {type: Number},
	auth_cap   : {type: Number},
	paid_up_cap   : {type: Number},
	date_last_agm   : {type: Date},
	date_last_bs   : {type: Date},
	last_upd_dt   : {type: Date},
	mailing_add   : {type: String, default: '',trim: true},
	state_id  : {type: Boolean},
	email_id  : {type: String,default: '',trim: true},
	key_contact_id : {type: Schema.Types.ObjectId, ref: 'person' },
	reg_off_add_id : {type: Schema.Types.ObjectId, ref: 'address' },
	mailing_add_id : {type: Schema.Types.ObjectId, ref: 'address' }
},
{
    collection : 'organization'
}
);	
mongoose.model('organization', OrganizationSchema);	

var AuditorSchema = new Schema(
{
	org_id : {type: Schema.Types.ObjectId, ref: 'organization' },
	ad_type : {type: Number},
	name : {type: String,default: '',trim: true},
	pan : {type: String,default: '',trim: true},
	address_id : {type: Schema.Types.ObjectId, ref: 'address' },
	membership_no : {type: String,default: '',trim: true},
	firm_reg_no  : {type: String,default: '',trim: true},
	appt_date  : {type: Date},
	resgn_date  : {type: Date},
	resgn_type : {type: Number},
	appt_duration : {type: Number}
},
{
    collection : 'auditor'
}
);	
mongoose.model('auditor', AuditorSchema);	

var BoardMemberSchema = new Schema(
{
	person_id : {type: Schema.Types.ObjectId, ref: 'person' },
	org_id  : {type: Schema.Types.ObjectId, ref: 'organization' },
	appt_date  : {type: Date},
	resgn_date  : {type: Date},
	bm_category_id : {type: Number},
	bm_type_id : {type: Number},
	bm_designation_code : {type: Number},
	shareholding_id : {type: String,default: '',trim: true}, 
	event_id : {type: String,default: '',trim: true},
	doc_id : {type: String,default: '',trim: true},
	nominee_company : {type: String,default: '',trim: true},
	alt_bm_id : {type: String,default: '',trim: true},
	dsc_available : {type: Boolean,default: '',trim: true}
},
{
    collection : 'board_member'
}
);	
mongoose.model('board_member', BoardMemberSchema);	


var DocClassSchema = new Schema(
{
	doc_mnemonic : {type: String,default: '',trim: true},
	doc_name  : {type: String,default: '',trim: true},
	doc_type : {type: String,default: '',trim: true},
	purpose : {type: String,default: '',trim: true}
},
{
    collection : 'doc_class'
}
);	
mongoose.model('doc_class', DocClassSchema);

var DocumentsSchema = new Schema(
{
	doc_class_id : {type: Schema.Types.ObjectId, ref: 'doc_class' },
	org_id : {type: Schema.Types.ObjectId, ref: 'organization' },
	doc_date  : {type: Date},
	file_name : {type : String},
	orig_file_name : {type : String},
	file_size : {type : Number}
},
{
    collection : 'documents'
}
);	
mongoose.model('documents', DocumentsSchema);

var DocClassTagsSchema = new Schema(
{
	doc_class_id : {type: Schema.Types.ObjectId, ref: 'doc_class' },
	attribute_id : {type: Schema.Types.ObjectId, ref: 'attribute' },
	reference_type : {type: Number} // Primary or Secondary
},
{
    collection : 'doc_class_tags'
}
);	  

mongoose.model('doc_class_tags', DocClassTagsSchema);  


var DocTagsSchema = new Schema(
{
	doc_id : {type: Schema.Types.ObjectId, ref: 'documents' },
	attribute_id : {type: Schema.Types.ObjectId, ref: 'attribute' },
	value : {type: String,default: '',trim: true},
	verified : {type: Boolean} 
},
{
    collection : 'doc_tags'
}
);	  

mongoose.model('doc_tags', DocTagsSchema);  


var EmailSchema = new Schema(
{
	address_id : {type: Schema.Types.ObjectId, ref: 'address' },
	email : {type: String,default: '',trim: true},
	classification :  {type: Number} // 'personal or official or record' ,
},
{
    collection : 'email'
}
);	  

mongoose.model('email', EmailSchema);  

var LegalActionTypeSchema = new Schema(
{
	doc_class_id  : {type: Schema.Types.ObjectId, ref: 'doc_class' },
	legal_action  : {type: String,default: '',trim: true} 
},
{
    collection : 'legal_action_type'
}
);	  
mongoose.model('legal_action_type', LegalActionTypeSchema);  

var LegalEventClassSchema = new Schema(
{
	legal_event_name  : {type: String,default: '',trim: true} ,
	purpose : {type: String,default: '',trim: true} ,
	event_type : {type: Number} // 'approval or intimation' 
},
{
    collection : 'legal_event_class'
}
);	  
mongoose.model('legal_event_class', LegalEventClassSchema);  


var EventActionMapSchema = new Schema(
{
	legal_event_class_id : {type: Schema.Types.ObjectId, ref: 'legal_event_class' },
	legal_action_type_id : {type: Schema.Types.ObjectId, ref: 'legal_action_type' },
	seq_no : {type: Number},
	option : {type: String,default: 'both',trim: true} , // default 'both' 
	required : {type: String,default: 'n',trim: true} // default 'n' 
},
{
    collection : 'event_action_map'
}
);	  
mongoose.model('event_action_map', EventActionMapSchema);  


var LegalEventsSchema = new Schema(
{
	org_id : {type: Schema.Types.ObjectId, ref: 'organization' },
	event_date  : {type: Date},
	legal_event_class_id : {type: Schema.Types.ObjectId, ref: 'legal_event_class' }
},
{
    collection : 'legal_events'
}
);	  
mongoose.model('legal_events', LegalEventsSchema);  


var LegalActionsSchema = new Schema(
{
	action_date  : {type: Date} ,
	org_id : {type: Schema.Types.ObjectId, ref: 'organization' },
	legal_action_type_id : {type: Schema.Types.ObjectId, ref: 'legal_action_type' },
	legal_event_id : {type: Schema.Types.ObjectId, ref: 'legal_events' },
	sequence_no : {type: Number},
	option : {type: String,default: 'both',trim: true} , // default 'both' 
	multiple : {type: Boolean}
},
{
    collection : 'legal_actions'
}
);	  
mongoose.model('legal_actions', LegalActionsSchema);  

var LegalActionTagsSchema = new Schema(
{

	legal_action_id : {type: Schema.Types.ObjectId, ref: 'legal_actions' },
	attribute_id  : {type: Schema.Types.ObjectId, ref: 'attribute' },
	value  : {type: String,default: '',trim: true} 
 },
{
    collection : 'legal_action_tags'
}
);	  
mongoose.model('legal_action_tags', LegalActionTagsSchema);  

var LegalActionTypeTagsSchema = new Schema(
{
	legal_action_type_id : {type: Schema.Types.ObjectId, ref: 'legal_action_type' },
	attribute_id  : {type: Schema.Types.ObjectId, ref: 'attribute' },
	reference_type : {type: Number}
 },
{
    collection : 'legal_action_type_tags'
}
);	  
mongoose.model('legal_action_type_tags', LegalActionTypeTagsSchema);  

var McaEformClassSchema = new Schema(
{
	mca_eform_name : {type: String,default: '',trim: true} ,
	mca_eform_url : {type: String,default: '',trim: true} ,
	mca_eform_help_url : {type: String,default: '',trim: true} ,
	mca_eform_purpose  : {type: String,default: '',trim: true} ,
	mca_eform_version_date  : {type: Date} ,
	eform_doc_class_id : {type: Schema.Types.ObjectId, ref: 'doc_class' },
	companies_act_year : {type: Number} 
 },
{
    collection : 'mca_eform_class'
}
);	  
mongoose.model('mca_eform_class', McaEformClassSchema);  

var McaEformSchema = new Schema(
{
	doc_id : {type: Schema.Types.ObjectId, ref: 'documents' },
	mca_eform_class_id : {type: Schema.Types.ObjectId, ref: 'mca_eform_class' },
	srn : {type: String,default: '',trim: true} ,
	org_id : {type: Schema.Types.ObjectId, ref: 'organization' }  
 },
{
    collection : 'mca_eform'
}
);	  
mongoose.model('mca_eform', McaEformSchema);  

var OrgPastNamesSchema = new Schema(
{
	org_id : {type: Schema.Types.ObjectId, ref: 'organization' },
	org_name  : {type: String,default: '',trim: true} ,
	change_date  : {type: Date} ,
	doc_id : {type: Schema.Types.ObjectId, ref: 'documents' }
 },
{
    collection : 'org_past_names'
}
);	  
mongoose.model('org_past_names', OrgPastNamesSchema);  

var PhoneSchema = new Schema(
{
	address_id : {type: Schema.Types.ObjectId, ref: 'address' },
	phone : {type : String},
	type : {type: Number}, // 'mobile or landline' 
	classification : {type: Number} // 'personal or official or record' 
 },
{
    collection : 'phone'
}
);	  
mongoose.model('phone', PhoneSchema);

var ResolutionsSchema = new Schema(
{
	org_id : {type: Schema.Types.ObjectId, ref: 'organization' },
	notice_doc_id : {type: Schema.Types.ObjectId, ref: 'documents' },
	notice_dispacth_date  : {type : Date},
	resolution_type : {type : Number}, // 'type - ordinary, special, requisite majority' ,
	resolution_auth : {type : Number}, // 'authority - board of directors, shareholders, class of shareholders, creditors' ,
	passing_date  : {type : Date},
	resolution_doc_id : {type: Schema.Types.ObjectId, ref: 'documents' }
 },
{
    collection : 'resolutions'
}
);	  
mongoose.model('resolutions', ResolutionsSchema); 

var ResolutionPurposeSchema = new Schema(
{
	resolution_id : {type: Schema.Types.ObjectId, ref: 'organization' },
	purpose_id : { type : Number},
	purpose : { type : String},
	subject_matter : { type : String}
 },
{
    collection : 'resolution_purpose'
}
);	  
mongoose.model('resolution_purpose', ResolutionPurposeSchema); 

var RocOfficesSchema = new Schema(
{
	roc_office : { type : String},
	roc_office_name : { type : String},
	roc_office_desc : { type : String},
	roc_code : { type : Number}
 },
{
    collection : 'roc_offices'
}
);	  
mongoose.model('roc_offices', RocOfficesSchema); 
	

var ShareCapitalSchema = new Schema(
{
	org_id  : {type: Schema.Types.ObjectId, ref: 'organization' },
	sharecapital_status : { type : Number}, //  'authorised' ,
	shareclass : {type : String},
	sharecapital_type : { type : Number}, // 'preference' ,
	nominal_value : { type : Number},
	no_of_shares : { type : Number}, 
	conversion_date  : { type : Date},
	redemption_date  : { type : Date}
 },
{
    collection : 'share_capital'
}
);	 
mongoose.model('share_capital', ShareCapitalSchema); 
	
var ShareholdersSchema = new Schema(
{
	org_id  : {type: Schema.Types.ObjectId, ref: 'organization' },
	shareholder_name : { type : String}, 
	sharecapital_id  : {type: Schema.Types.ObjectId, ref: 'share_capital' },
	sharecapital_amount : { type : Number}, 
	percentage_stake : { type : Number}, 
	special_rights : { type : String}
 },
{
    collection : 'shareholders'
}
);	 
mongoose.model('shareholders', ShareholdersSchema); 

var StatesSchema = new Schema(
{
	state_code : { type : String},
	state_name : { type : String}
 },
{
    collection : 'states'
}
);	 
mongoose.model('states', StatesSchema); 


	
/**
 * Org Schema
 */
var OrgSchema = new Schema(
{
    name: {type: String,default: '',trim: true},
    inc_date: {type: Date},    
    pan: {type: String,default: '',trim: true},
    tan: {type: String,default: '',trim: true},
    cin: {type: String,default: '',trim: true}       
},
{
    collection : 'Org'
}
);

OrgSchema.statics.loadOrg = function(id, cb) {
    //debugger;
    console.log('Server lexModel:loadOrg',id);
    var oid =  new mongoose.Types.ObjectId(id);
    console.log('Object Id : ', oid);
    this.findOne({_id : oid}).exec(cb);
    //this.find({}).exec(cb);

};
mongoose.model('Org', OrgSchema);

/**
 * Director Schema
 */
var DirectorSchema = new Schema(
{
    org :  { type: Schema.Types.ObjectId, ref: 'org' },
    name: {type: String, default: 0},
    eff_Frm_Dt: {type: Date},
    eff_To_Dt: {type: Date},    
    din: {type: String,default: '',trim: true}    
},
{
    collection : 'Director'
}
);
mongoose.model('Director', DirectorSchema);


var LexUsrLnkSchema = new Schema(
{
    org :  { type: Schema.Types.ObjectId, ref: 'organization' },
	person :  { type: Schema.Types.ObjectId, ref: 'person' },
    user : { type: Schema.Types.ObjectId, ref: 'User' }    
},
{
    collection : 'lex_user_link'
}
);
mongoose.model('lex_user_link', LexUsrLnkSchema);

var LexCodeTypeSchema = new Schema(
{
    code_type :  { type : String },
	mnemonic :  { type : String },
    code : { type: Number},
	description : { type : String }
},
{
    collection : 'lex_code_type'
}
);
mongoose.model('lex_code_type', LexCodeTypeSchema);


var ProspectSchema = new Schema(
{	
	name  : {type: String,default: '',trim: true},
	email  : {type: String,default: '',trim: true},
	phone  : {type: String,default: '',trim: true},
	company  : {type: String,default: '',trim: true},
	cin  : {type: String,default: '',trim: true},
	prospect_type : {type: Number},
	prospect_status : {type: Number},
	notes  :  {type: String,default: '',trim: true},
	capture_date : {type: Date},
	contact_date : {type: Date},
	regn_date : {type: Date},	
	regn_token : {type: String},
	mail_token : {type: String}	
},
{
    collection : 'prospect'
}
);

mongoose.model('prospect', ProspectSchema);





