/**
 * Created by Dhian on 2/13/2016.
 */
module.exports = {

    'facebook' : {
        'clientID'      : '214640925552429', // your App ID
        'clientSecret'  : 'c9591e659c9a325a6e5c692fe22859ac', // your App Secret
        'callbackURL'   : 'http://localhost:3333/api/auth/facebook/callback',
        'profileFields' : ['id', 'displayName', 'name', 'gender', 'photos']
    },

    'twitter' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    },

    'google' : {
        'clientID'      : 'your-secret-clientID-here',
        'clientSecret'  : 'your-client-secret-here',
        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    }

};