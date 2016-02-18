/**
 * Created by Dhian on 2/13/2016.
 */
module.exports = {

    'facebook' : {
        'clientID'      : '214640925552429', // your App ID
        'clientSecret'  : 'c9591e659c9a325a6e5c692fe22859ac', // your App Secret
        'callbackURL'   : 'http://192.168.1.113:3333/api/auth/facebook/callback',
        'profileFields' : ['id', 'displayName', 'name', 'gender', 'photos', 'bio', 'location', 'hometown', 'about']
    },

    'twitter' : {
        'consumerKey'       : '8LyElI7kykBI1OmYvl5mrvNU2',
        'consumerSecret'    : 'zbumaD6rOCtYtXqXjQLrXOvX4JeEijn9hKsq20nb6oHKN8wJ5C',
        'callbackURL'       : 'http://192.168.0.101:3333/api/auth/twitter/callback'
    },

    'google' : {
        'clientID'      : 'your-secret-clientID-here',
        'clientSecret'  : 'your-client-secret-here',
        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    }

};