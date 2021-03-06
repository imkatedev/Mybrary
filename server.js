//set up server
//check if running in the production env or not 
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const methodoverride = require('method-override')
const cors = require('cors')


//model
const indexRouter = require('./routes/index')
const authoRouter = require('./routes/authors')
const bookRouter = require('./routes/books')
const userRouter = require('./routes/users')


//views
app.set('view engine','ejs')
app.set('views', __dirname + '/views')
app.set('layout','layouts/layout')


app.use(expressLayouts)
app.use(express.static('public'))
app.use(methodoverride('_method'))
app.use(cors())

//set up db connection 
const  mongoose = require('mongoose');
mongoose
    .connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database Connected'))
    .catch(err => console.log(err));

    
const db = mongoose.connection
db.on('error',error => console.log(error))
db.once('error',error => console.log(error))

app.use(express.urlencoded({ extended: true }));
app.use(express.json()) // To parse the incoming requests with JSON payloads


app.use('/',indexRouter)
app.use('/authors',authoRouter)
app.use('/books', bookRouter)
app.use('/users', userRouter)




app.listen(process.env.PORT || 5500)

//this is all we need to get the server up and running
//set up web server, db server