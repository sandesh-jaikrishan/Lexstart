'use strict';

module.exports = {
  db: 'mongodb://localhost/lexstart',
  clean : {
    debug : true
  },
  app: {
        name: 'Lexstart'
    },
  facebook: {
    clientID: 'APP_ID',
    clientSecret: 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
  },
  twitter: {
    clientID: 'CONSUMER_KEY',
    clientSecret: 'CONSUMER_SECRET',
    callbackURL: 'http://localhost:3000/auth/twitter/callback'
  },
  github: {
    clientID: 'APP_ID',
    clientSecret: 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/github/callback'
  },
  google: {
    clientID: 'APP_ID',
    clientSecret: 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  linkedin: {
    clientID: 'API_KEY',
    clientSecret: 'SECRET_KEY',
    callbackURL: 'http://localhost:3000/auth/linkedin/callback'
  },
  emailFrom: 'ABC <sandesh.jaikrishan@gmail.com>', // sender address like ABC <abc@example.com>
  mailer: {
    service: 'Gmail',
    auth: {
      user: 'sandesh.jaikrishan@gmail.com',
      pass: 'adesh617'
    }
  }
};
