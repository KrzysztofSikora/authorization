/**
 * Created by krzysztof on 10.05.16.
 */

var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/auth_demo');

var user = mongoose.Schema({
    username: String,
    password: {type: String, select: false}
})


module.exports = mongoose.model('User', user)