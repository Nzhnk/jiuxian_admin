const User = require('../../models/users/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path');

const issignin = (req, res, next) => {
    res.render('users/issignin.ejs', {
        issignin: true,
        username: req.username
    })
}

const signup = (req, res, next) => {
    res.set( 'Content-Type', 'application/json; charset=utf-8' );
    const username = req.body.username;
    const password = req.body.password;

    bcrypt.hash(password, 10).then(cryptPassword => {
        User.signup({
            username,
            password: cryptPassword,
            cb: result => {
                if (result) {
                    res.render('users/signup.ejs', {
                        success: result
                    })
                } else {

                }
            }
        })
    })
}

const signin = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.signin({
        username,
        password,
        cb: result => {
            if (result) {
                bcrypt
                    .compare(password, result.password)
                    .then(compareResult => {
                        if (compareResult) {
                            res.render('users/signin.ejs', {
                                success: true,
                                token: getToken(result.username),
                                username: result.username
                            })
                        } else {
                            res.render('users/signin.ejs', {
                                success: false,
                                token: '',
                                username: ''
                            })
                        }
                    })
            } else {
                res.render('users/signin.ejs', {
                    success: false,
                    token: '',
                    username: ''
                })
            }
        }
    })
}

function getToken(username) {
    const payload = {
        username
    }
    const privateKey = fs.readFileSync(path.resolve(__dirname, '../keys/private.key'));
    const token = jwt.sign(payload, privateKey, {
        algorithm: 'RS256'
    })
    return token;
}

module.exports = {
    issignin,
    signup,
    signin
}
