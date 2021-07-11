const { Router } = require('express')
const router = Router()
const User = require('../models/user')
const bcrypt = require('bcrypt');

router.post('/register', async (req, res) => {
    let dateToday = new Date()
    console.log(`[${dateToday.getHours()}:${dateToday.getMinutes()}:${dateToday.getSeconds()}] POST: users/register`)
    
    if (!req.body.username.trim()) {
        return res.send({msg : "Username field cannot be empty"})
    }
    let userExists = await User.find({"username" : req.body.username})
    if (userExists.length) {
        return res.send({msg : "This username already exists"})
    }
    if (req.body.password.trim().length < 6) {
        return res.send({msg : "Password must be 6 symbols at least"})
    }

    let user = new User();
    user.username = req.body.username;
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            user.password = hash
            user.salt = salt
            user.save()
            return res.send({id : user._id, username : user.username})
        })
    })  
})

router.post('/login', async (req, res) => {
    let dateToday = new Date()
    console.log(`[${dateToday.getHours()}:${dateToday.getMinutes()}:${dateToday.getSeconds()}] POST: users/login`)
    if(!!!req.body.username.trim()){
        return res.send({msg : "Username field can't be empty"})
    }
    if(!!!req.body.password.trim()){
        return res.send({msg : "Password field can't be empty"})
    }
    let userExists = await User.find({"username" : req.body.username})
    if (!userExists.length) {
        return res.send({msg : "Incorrect username or password"})
    }
    const user = await User.findOne({"username" : req.body.username})
    if (bcrypt.compareSync(req.body.password, user.password)){
        id = user._id
        username = user.username
        return res.send({id, username})
    }
    else {
        return res.send({msg : "Incorrect username or password"})
    }
})

router.get('/profile/:id', async (req, res) => {
    let dateToday = new Date()
    console.log(`[${dateToday.getHours()}:${dateToday.getMinutes()}:${dateToday.getSeconds()}] GET: profile/${req.params.id}`)
    const user = await User.findById(req.params.id)
    res.send({username : user.username})
})

module.exports = router