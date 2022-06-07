const googleAuth = require("passport-google-oauth20").Strategy;
const facebookAuth = require("passport-facebook").Strategy;
const twitterAuth = require("passport-twitter").Strategy;
const githubAuth = require("passport-github2").Strategy;
const User = require("../models/UserModel");
require("dotenv").config();

async function verifyCallback(accessToken, refreshToken, profile, done) {
    console.log("Access token:", accessToken);
    console.log("Profile:", profile);
    User.findOne({providerID: profile.id}, async (err, user) => {
        if(err) {
            return done(err, null);
        } else {
            if (!user) {
                const newUser = await User.create({
                    email: profile.email,
                    username: profile.displayName,
                    providerID: profile.id,
                    provider: profile.provider,
                });
                return done(null, newUser);
            }
            return done(null, user);
        }
    })
}

const googleStrategy = new googleAuth({
    callbackURL: "/auth/google/callback",
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
}, verifyCallback);

const facebookStrategy = new facebookAuth({
    callbackURL: "/auth/facebook/callback",
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET
}, verifyCallback);

const twitterStrategy = new twitterAuth({
    callbackURL: "/auth/twitter/callback",
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET
}, verifyCallback);

const githubStrategy = new githubAuth({
    callbackURL: "/auth/github/callback",
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET
}, verifyCallback);

function serializeUser (user, done) {
    console.log("Serialization:", user);
    done(null, user.providerID || user._id);
}

function deserializeUser (userID, done) {
    console.log("Deserialization:", userID);
    User.findOne({providerID: userID}, (err, user) => {
        if(err) {
            done(err, null);
        } else {
            done(null, user);
        }
    })
};

const sessionOptions = {
    secret: [process.env.COOKIE_SESSION_KEY_1, process.env.COOKIE_SESSION_KEY_2],
    resave: true,
    saveUninitialized: true,
    cookie: {
        sameSite: "none",
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 30
    }
}

module.exports = {
    googleStrategy,
    facebookStrategy,
    twitterStrategy,
    githubStrategy,
    serializeUser,
    deserializeUser,
    sessionOptions
}