require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const app = express()
const moviedex = require('./movies-data-small.json')

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())
app.use(validateBearerToken)
app.get('/movie',handleMovieGet)
app.listen(8000, ()=>{
    console.log('bumping at 8k')
})

function validateBearerToken(req,res,next){
    const bearerToken = req.get('auth')
    const apiToken = process.env.API_TOKEN

    if (bearerToken !== apiToken) {
        return res.status(401).json({error: 'Unauthorized so get outta here'})
    }
    next()
}

function handleMovieGet (req,res) {
    const queryRes = filterByQuery(req)
    res.json(queryRes)
}

function filterByQuery(req) {
    let response=moviedex
    
    if (req.query.genre) {
            response = response.filter(movie =>
            movie.genre.toLowerCase() == req.query.genre.toLowerCase()
            )
        }
    if (req.query.country) {
            response = response.filter(movie =>
            movie.country.toLowerCase() == req.query.country.toLowerCase()
            )
        }
    if (req.query.rating) {
            response = response.filter(movie =>
            Number(movie.avg_vote) >= Number(req.query.rating)
            )
        }
    return response
}


