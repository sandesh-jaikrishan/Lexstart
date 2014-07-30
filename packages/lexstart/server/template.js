'use strict';

module.exports = {
  register_interest_email: function(name, req, token, mailOptions) {
    mailOptions.html = [
      'Hi ' + name +',<br />',
      'Thank you for registering your interest in Lexstart Services Pvt. Ltd. If you made this request, please click on the link below or paste this into your browser to complete the process for email verification:<br />',
      'http://sangam.vc:3000/#!/reset/' + token+'<br/>',
	  'We will contact you shortly to discuss your requirement. Alternatively, you can call us at +91 0000000000 <br/>',	  
	  'Warm Regards', 
      'Lexstart Support Services',
      'www.lexstart.in'
    ].join('<br />');
    mailOptions.subject = 'Lexstart - Interest Registration';
    return mailOptions;
  },

  account_open_email : function(prospect , mailOptions) {
    mailOptions.html = [
      'Hi ' + prospect.name +',<br />',
      'Welcome to Lexstart Services Pvt. Ltd. You can login to our site using following credentials<br/>',   
      '		Username = '+prospect.email,
      '		Password = '+prospect.regn_token+'<br/>',
    'For any further assisstance contact us at +91 000000000 or mail us at xyz@test.com.<br/>',   
    'Warm Regards', 
    'Lexstart Support Services',
    'www.lexstart.in'
    ].join('<br />');
    mailOptions.subject = 'Lexstart - Account Details.';
    return mailOptions;
  }

};
