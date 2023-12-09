const express = require('express')
const router = express.Router()
const { validationResult, body, } = require('express-validator')
const islogin = require('../middleware/islogin');
const Notes = require('../models/Notes');
const mongoose = require('mongoose')

// Fetching ALL Notes
router.get('/fetchallnotes', islogin, async (req, res) => {
    try {
        const user = req.user;
        const notes = await Notes.find({ user: user })
        console.log(notes);
        res.send(notes)
    }
    catch (e) {
        return res.status(500).send({ error: "Internal Server Error!!" })
    }

})

// Adding New Notes
router.post('/addnote', islogin, [
    body('title', "enter a Valid Title (atleast 3 charecters)").isLength({ min: 3 }),
    body('descryption', "enter a valid desc").isLength({ min: 5 }),
], async (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
        return res.status(400).send({ error: result.array() })
    }
    try {
        const postnote = await Notes.create(
            {
                title: req.body.title,
                descryption: req.body.descryption,
                tag: req.body.tag,
                user: req.user

            })
        console.log(postnote);
        res.send(postnote)
    } catch (e) {
        return res.status(500).send({ error: "Internal Server Error" })
    }
})


// Updating a Note
router.put('/updatenote/:id', islogin, async (req, res) => {

    try {
        const { title, descryption, tag } = req.body;
        //get new note to be updated
        let newnote = {}
        if (title) { newnote.title = title }
        if (descryption) { newnote.descryption = descryption }
        if (tag) { newnote.tag = tag }

        // find the note to be updated 
        let update_note = await Notes.findById(req.params.id)
        if (!update_note) {
            // if note id not found
            return res.status(400).send({ error: "Note Not Found" })
        }

        if (update_note.user.toString() !== req.user) {
            // sending error if wrong user acessing
            return res.status(401).send({ error: "Unauthorised Note" })
        }

        update_note = await Notes.findByIdAndUpdate(req.params.id, { $set: newnote }, { new: true })
        res.json(update_note)

    } catch (error) {

        return res.status(400).send({ error: error.message })
    }
})


router.delete('/deletenote/:id' , islogin ,async (req,res)=>{

    try {
    console.log(req.params.id);

    let delete_note = await Notes.findById(req.params.id)
    if (!delete_note) {
        // if note id not found
        return res.status(400).send({ error: "Note Not Found" })
    }

    if (delete_note.user.toString() !== req.user) {
        // sending error if wrong user acessing
        return res.status(401).send({ error: "Unauthorised Note" })
    }

    
    delete_note = await Notes.findByIdAndDelete(req.params.id)
    res.json(delete_note)
    }
    catch (e) {

        return res.status(400).send({ error: e.message })
    }
})

module.exports = router