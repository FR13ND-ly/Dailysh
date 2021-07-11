const { Router } = require('express')
const { translateAliases } = require('../models/task')
const router = Router()
const Task = require('../models/task')

router.get('/:id', async (req, res) => {
    let dateToday = new Date()
    console.log(`[${dateToday.getHours()}:${dateToday.getMinutes()}:${dateToday.getSeconds()}] GET: tasks/`)
    const tasks = await Task.find({userId: req.params.id}).sort({ position : 1 })
    let response = [[], [], []]
    let days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday']
    tasks.forEach(async task => {
        if (task.lastUpdated.getDate() != dateToday.getDate() || task.lastUpdated.getMonth() != dateToday.getMonth() || task.lastUpdated.getYear() != dateToday.getYear()) {
            if (task.repeatWeek.includes(days[dateToday.getDay()])) {
                task.col = 1
                task.disabled = false
            }
            else {
                task.col = 3
                task.disabled = true
            }
            task.lastUpdated = dateToday
            await task.save()
        }
        response[task.col - 1].push({
            id: task._id,
            text: task.text,
            repeat: task.repeat,
            repeatDone: task.repeatDone,
            repeatWeek: task.repeatWeek,
            disabled: task.disabled
        })
    });
    return res.json(response)
})

router.post('/create', async (req, res) => { 
    let dateToday = new Date()
    console.log(`[${dateToday.getHours()}:${dateToday.getMinutes()}:${dateToday.getSeconds()}] POST: tasks/create`)
    console.log('a', req.body.repeat != "", req.body.repeat)
    const task = new Task({
        userId: req.body.userId,
        text: req.body.text,
        repeat: req.body.repeat != "" ? 1 : req.body.repeat,
        repeatWeek: req.body.repeatWeek,
    })
    await task.save()
    res.send({msg: "Success"})
})

router.put('/changeCol', async(req, res) => {
    let dateToday = new Date()
    console.log(`[${dateToday.getHours()}:${dateToday.getMinutes()}:${dateToday.getSeconds()}] PUT: tasks/changeCol`)
    if (req.body.col < 4){
        let i = 0
        let max = Object.entries(req.body.order).length
        Object.entries(req.body.order).forEach(async (ord) => {
            let task = await Task.findById(ord[1])
            if (task.col != 3 && req.body.col == 3 && (task.repeat != task.repeatDone || task.repeatDone == null)){
                task.repeatDone++
                task.col = task.repeatDone == task.repeat ? 3 : 2
            }
            else {
                task.col = req.body.col
            }
            task.position = ord[0]
            await task.save()
            i++
            if (i == max) {
                return res.send({msg: "Success"})
            }
        })
    }
    else {
        return res.send({msg: "Fail"})
    }
    
})

router.delete('/delete/:id', async (req, res) => {
    let dateToday = new Date()
    console.log(`[${dateToday.getHours()}:${dateToday.getMinutes()}:${dateToday.getSeconds()}] DELETE: tasks/delete/${req.params.id}`)
    await Task.deleteOne({_id: req.params.id})
    res.send({msg: "Success"})
})

router.put('/edit/:id', async (req, res) => {
    let dateToday = new Date()
    console.log(`[${dateToday.getHours()}:${dateToday.getMinutes()}:${dateToday.getSeconds()}] PUT: tasks/edit/${req.params.id}`)
    let task = await Task.findById(req.params.id)
    task.text = req.body.text
    task.repeat = req.body.repeat
    task.repeatDone = req.body.repeatDone
    if (task.repeatDone == 0 && task.repeat != null) task.col = 1
    else if (task.repeatDone < task.repeat) task.col = 2
    else if (task.repeatDone == task.repeat) task.col = 3
    if (JSON.stringify(task.repeatWeek) != JSON.stringify(req.body.repeatWeek)){
        let days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday']
        if (req.body.repeatWeek.includes(days[dateToday.getDay()])) {
            task.col = 1
            task.repeatDone = 0
            task.disabled = false
        }
        else {
            task.col = 3
            task.disabled = true
        }
    }
    task.repeatWeek = req.body.repeatWeek
    await task.save()
    res.send({msg: "Success"})
})

router.put('/progress', async (req, res) => {
    let dateToday = new Date()
    console.log(`[${dateToday.getHours()}:${dateToday.getMinutes()}:${dateToday.getSeconds()}] PUT: tasks/progress`)
    let task = await Task.findById(req.body.id)
    if (task.repeat == 1){
        task.col = 3
        await task.save()
        return res.send({msg: `Well done, you finished "${task.text}"`})
    }
    else {
        task.repeatDone++
        if (task.repeat == task.repeatDone) {
            task.col = 3
            task.position = await Task.find({userId : task.userId}).length
            await task.save()
            return res.send({msg: `Well done, You've finished "${task.text}"`})
        }
        else {
            task.col = 2
        }
        await task.save()
    }
    return res.send({msg: "Success"})
})

router.put('/resetProgress', async (req, res) => {
    let dateToday = new Date()
    console.log(`[${dateToday.getHours()}:${dateToday.getMinutes()}:${dateToday.getSeconds()}] PUT: tasks/resetProgress`)
    let task = await Task.findById(req.body.id)
    if (task.col != 1){
        task.repeatDone = 0
        task.col = 1
        await task.save()
    }
    return res.send({msg: "You've reset " + task.text})
})

module.exports = router