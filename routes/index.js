var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple')
var app = express()
app.use(require('body-parser').json())
var _ = require('lodash')
var bcrypt = require('bcrypt')

// var users = [{username: 'dickeyxxx', password: '$2a$10$mTQfCYSeHZ4EsO0xdQN2q.dOUtT4LZJMrstq6.qHWZsADY7WKakMu'}]
var secretKey = 'supersecretkey'

var User = require('../models/user')


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});


// function findUserByUsername(username) {
//     return _.find(users, {username: username})
// }
//
// function validateUser(user, password, cb) {
//     return bcrypt.compare(password, user.password, cb)
// }


router.post('/user', function (req, res, next) {
    var user = new User({username: req.body.username})
    bcrypt.hash(req.body.password, 10, function (err, hash) {
        user.password = hash
        user.save(function (err) {
            if (err) { throw next(err) }
            res.send(201)
        })
    })
})

router.post('/session', function (req, res, next) {

    User.findOne({username: req.body.username})
        .select('password')
        .exec(function (err, user) {
        if (err) { return next(err) }
        if (!user) { return res.send(401) }
        bcrypt.compare(req.body.password, user.password, function (err, valid) {
            if (err) { return next(err) }
            if (!valid) { return res.send(401) }
            var token = jwt.encode({username: req.body.username}, secretKey)
            res.json(token)
        })
    })
})
//
//
router.get('/user', function (req, res, next) {
    var token = req.headers['x-auth']
    var auth = jwt.decode(token, secretKey)
    User.findOne({username: auth.username}, function (err, user) {
        if (err) { return next(err) }
        if (!user) { return res.sendStatus(401) }
        res.json(user)
    })
})


module.exports = router;
