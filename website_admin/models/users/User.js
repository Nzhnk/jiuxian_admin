const mongoose = require('./config')

const userSchema = new mongoose.Schema({
    username: String,
    password: String
})

const User = mongoose.model('User', userSchema)

const signup = ({username, password, cb}) => {
    User.find({username})
    .then(result => {
        if (result.length > 0) {
            cb(false);
        } else {
            new User({username, password})
                .save()
                .then(() => {
                    cb(true);
                })
                .catch(() => {
                    cb(false);
                })
        }
    }).catch((error) => {
        console.error('query user failed: ' + error);
        cb(false);
    });
}

const signin = ({username, cb}) => {
    User.findOne({username})
        .then((result) => {
            if (result) {
                cb(result);
            } else {
                cb(false);
            }
        })
        .catch((error) => {
            cb(false)
        })
}

module.exports = {
    signup,
    signin
}