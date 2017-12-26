// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
/*anirudh*/
// load up the user model
var User            = require('../app/models/user');
// expose this function to our app using module.exports
module.exports = function(passport) {
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {
        // console.log("dumdum");
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
             /* 8-10-2017 NO LONGER ALLOW NEW USERS*/
              
             if ( user) {
            //if (true) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

                // if there is no user with that email
                // create the user
                var newUser            = new User();

                // set the user's local credentials
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password);

                newUser.local.genre_broa_cur = 0 ;
                newUser.local.genre_caba_cur = 0 ;
                newUser.local.genre_chil_cur = 0 ;
                newUser.local.genre_conc_cur = 0 ;
                newUser.local.genre_danc_cur = 0 ;
                newUser.local.genre_lect_cur = 0 ;
                newUser.local.genre_live_cur = 0 ;
                newUser.local.genre_musi_cur = 0 ;
                newUser.local.genre_othe_cur = 0 ;
                newUser.local.genre_play_cur = 0 ;
                newUser.local.genre_spec_cur = 0 ;
                newUser.local.genre_spor_cur = 0 ;

                newUser.local.genre_broa_fut = 0 ;
                newUser.local.genre_caba_fut = 0 ;
                newUser.local.genre_chil_fut = 0 ;
                newUser.local.genre_conc_fut = 0 ;
                newUser.local.genre_danc_fut = 0 ;
                newUser.local.genre_lect_fut = 0 ;
                newUser.local.genre_live_fut = 0 ;
                newUser.local.genre_musi_fut = 0 ;
                newUser.local.genre_othe_fut = 0 ;
                newUser.local.genre_play_fut = 0 ;
                newUser.local.genre_spec_fut = 0 ;
                newUser.local.genre_spor_fut = 0 ;

                newUser.local.genre_alls_fut = 0 ;
                newUser.local.genre_alls_cur = 0 ;


        // save the user --- turning off this function
                newUser.save();
             }});    

        });

    }));



  // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            console.log("SUCCESS!");
            return done(null, user);
        });

    }));

};
