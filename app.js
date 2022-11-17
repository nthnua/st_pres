const fs = require('fs/promises')
const express = require('express')
require('dotenv').config()
const app = express()

const PORT = '8080'
const HOST = '127.0.0.1'

app.use(express.urlencoded({ extended: false }), express.json())
app.head('/api/greetings', (req,res,next)=>{
    res.setHeader('Custom-Capability','true').send()
})
app.get('/api/greetings', (req, res, next) => {
    const name = req.query.name
    if (name !== undefined) {
        res.send(`Hello there, ${name}`)
    }
    else {
        res.status(400).send('No name provided!')
    }
})
app.post('/api/greetings', (req, res, next) => {
    const greeting = req.body.message
    const from = req.body.from
    console.log(`${from} says: ${greeting}`)
    res.send(`Hi ${from}, Greetings!`)
})

app.put('/api/upload', (req, res, next) => {
    const accessToken = req.headers.authorization
    console.log(accessToken.split(' ')[1],process.env.SECRET)
    if (accessToken !== undefined && accessToken.split(' ')[1] === process.env.SECRET) {
        const fileName = req.body.name
        const data = req.body.data
        fs.writeFile(`files/${fileName}`, data).then(() => {
            res.send("File created succesfully.")
        }).catch(() => {
            res.status(500).send("File creation failed!")
        })
    } else {
        res.status(401).send("Authorization required to access this endpoint!")
    }
})

app.delete('/api/remove', (req, res, next) => {
    const accessToken = req.headers.authorization
    if (accessToken !== undefined && accessToken.split(' ')[1] === process.env.SECRET) {
        const fileName = req.body.name
        fs.rm(`files/${fileName}`).then(()=>{
            res.send("Deleted file successfully.")
        }).catch(()=>{
            res.status(500).send("File deletion failed!")
        })
    } else {
        res.status(401).send("Authorization required to access this endpoint!")
    }
})

app.listen(PORT, HOST, () => {
    console.log(`Listening at http://${HOST}:${PORT}`)
})

