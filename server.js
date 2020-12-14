require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const app = express()
const moviedex = require('./movies-data-small.json')
const PORT = process.env.PORT || 8000

const morganSetting = process.env.NODE_ENV === 'production'?'tiny':'common'
app.use(morgan(morganSetting))
app.use(helmet())
app.use(cors())
app.use(validateBearerToken)
app.get('/movie',handleMovieGet)
app.use((error, req, res, next)=>{
    let response
    if (process.env.NODE_ENV === 'production'){
        response = {error:{message:'server error'}}
    } else {
        response = {error}
    }
    res.status(500).json(response)
})
app.listen(PORT, ()=>{
    console.log('bumping at '+PORT)
})

function validateBearerToken(req,res,next){
    const bearerToken = req.get('Authorization')
    const apiToken = process.env.API_TOKEN

    if (bearerToken.split(' ')[1] !== apiToken) {
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


