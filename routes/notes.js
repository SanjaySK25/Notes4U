const express = require('express')
const notesRouter = express.Router()
const Note = require('../models/note.js')

//Rendering the note index page
notesRouter.get('/', async (req,res) => {
    let searchOptions = {}
    if(req.query.title != null && req.query.title != ''){
        searchOptions.title = new RegExp(req.query.title,'i')
    }
    try{
        const notes = await Note.find(searchOptions).sort({ createdAt: 'desc' }).exec()
        res.render('notes/index.ejs',  {notes: notes, searchOptions:req.query})
    }catch{
        res.redirect('/')
    }
})

//Rendering the new note page
notesRouter.get('/new', (req, res) => {
    res.render('notes/new.ejs',  {note: new Note()})
})

//Creating the new note
notesRouter.post('/', async (req, res) => {

    const note = new Note({
        title: req.body.title,
        description: req.body.description
    })

    try{
        const newNote = await note.save()
        res.redirect(`/notes/${note.id}`)
    }catch{
        if(req.body.title == null || req.body.title == '' ){
            res.render('notes/new',{
                note:note,
                errorMessage: 'Title should not be null!'
            })
        }
        if(req.body.description == null || req.body.description == '' ){
            res.render('notes/new',{
                note:note,
                errorMessage: 'Description should not be null!'
            }) 
        }
        res.render('notes/new',{
            note:note,
            errorMessage: 'Error creating note!'
        })
    }

})

//Show Note Page
notesRouter.get('/:id', async(req,res) => {
    let note
    try{
        note = await Note.findById(req.params.id)
        res.render('notes/show',{note:note})
    }catch{
        if(note == null){
            res.redirect('/notes')
        }else{
            res.redirect('/')
        }
    }
})

//Rendering edit note page
notesRouter.get('/:id/edit', async (req,res) => {
    let note
    try{
        note = await Note.findById(req.params.id)
        res.render('notes/edit.ejs',{note:note})
    }catch{
        if(note == null){
            res.redirect('/notes')
        }else{
            res.redirect('/')
        }
    }
})

//Updating the note
notesRouter.put('/:id', async(req,res) => {
    let note
    try{
        note = await Note.findById(req.params.id)
        note.title = req.body.title
        note.description = req.body.description
        await note.save()
        res.redirect(`/notes/${note.id}`)
    }catch{
        if(note == null){
            res.redirect('/notes')
        }else{
            res.render(`/notes/${note.id}/edit`,{note:note})
        }
    }
})

//Delete Note
notesRouter.delete('/:id', async(req,res) => {
    let note
    try{
        note = await Note.findById(req.params.id)
        await Note.deleteOne({_id:req.params.id})
        res.redirect('/notes')
    }catch{
        if(note == null){
            res.redirect('/')
        }else{
            res.redirect(`/notes/${note.id}`)
        }
    }
})

module.exports = notesRouter