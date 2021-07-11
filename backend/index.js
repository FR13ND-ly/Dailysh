const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const passport = require('passport');

const app = express()
const PORT = process.env.PORT || 3000 

const tasksRoutes = require('./routes/tasks')
const usersRoutes = require('./routes/users')

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use('/tasks', tasksRoutes)
app.use('/users', usersRoutes)
app.use(passport.initialize())

async function start(){
    try {
        await mongoose.connect('mongodb+srv://Alan:to8dEVHCFD7sQyhc@cluster0.8fua2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
    } catch(e){
        console.warn(e)
    }
}

start()

app.listen(PORT, ()=> {
    console.log(`Server started on port ${PORT}`)
})