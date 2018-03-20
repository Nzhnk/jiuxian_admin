const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/jiuxian-admin', function() {
    console.log('mongodb connected')
})

module.exports = mongoose
