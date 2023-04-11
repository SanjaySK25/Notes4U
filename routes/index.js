const express = require('express')
const indexRouter = express.Router()
const Note = require('../models/note.js')

indexRouter.get('/', async(req,res) => {
    notes = await Note.find().sort({ createdAt: 'desc' }).limit(8).exec()
    res.render('index.ejs',{notes:notes})
})

module.exports = indexRouter