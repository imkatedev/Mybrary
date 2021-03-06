const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')

//get all authors route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if(req.query.name != null && req.query.name !== '' ){
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try{
        const authors = await Author.find(searchOptions)
            res.render('authors/index', 
            {
                authors: authors,
                searchOptions: req.query
            })
    }
    catch{
        res.redirect('/')
    }
})

//new author router
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author() })
    //console.log(req.body)
})



//create new author route
router.post('/', express.urlencoded({ limit: '10mb', extended: false }), async (req, res) => {
    const author = new Author({
        name: req.body.name
    })

    try{
        const newAuthor = await author.save()
        res.redirect(`authors/${newAuthor.id}`)
       
    }
    catch(err){
        console.log(err)
        res.render('authors/new', 
        {
            author: author,
            errorMessage: 'Error creating Author'
        })
    }
})

//show author and books
router.get('/:id', async (req, res) => {

    try {
        const author = await Author.findById(req.params.id)
        const books = await Book.find({ author: author.id }).limit(5).exec()
        return res.render('authors/show', {
            author: author,
            booksByAuthor: books
        })
    }
    catch (err) {
        console.log(err)
        return res.redirect('/')
    }
     res.send('Show Author' + req.params.id)
})



router.get('/:id/edit',async (req,res) =>{
    try{
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', { author: author })
    }
    catch{
        res.redirect("/authors")
    }
    
})


//update route
router.put('/:id', express.urlencoded({ limit: '10mb', extended: false }), async (req,res)=>{
    let author;
    try {
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect(`/authors/${author.id}`)
    }
    catch {
        if(author == null){
            res.redirect('/')
        }
        else{
            res.render('authors/edit', {
                author: author,
                errorMessage: 'Error updating Author'
            })
        }
    }
})

//delete route
router.delete('/:id', express.urlencoded({ limit: '10mb', extended: false }), async (req, res) => {
    let author;
    try {
        author = await Author.findById(req.params.id)
        await author.remove()
        res.redirect(`/authors`)
    }
    catch {
        if (author == null) {
            res.redirect('/')
        }
        else {
            res.redirect(`/authors/${author.id}`)
        }
    }
})



module.exports = router;
