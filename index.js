require('dotenv').config()

const db = require('./database')

const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors())

const morgan = require('morgan')
app.use(morgan('tiny'))

const bodyParser = require('body-parser')
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/signup', async (req, res) => {
    data = req.body
    const user = await db.User.findOne({ email: data.email })

    if (user) {
        return res.status(400).send('This email already registered!')
    }

    const new_user = new db.User(data)

    res.status(200).send(await new_user.save())
})

app.post('/login', async (req, res) => {
    data = req.body
    user = await db.User.findOne({ email: data.email })

    if (!user) {
        return res.status(400).send('Username does not exist.')
    }

    if (user.password != data.password) {
        return res.status(400).send('Your password was not match.')
    }

    const generateAccessToken = require('./jwt').generateAccessToken
    const token = generateAccessToken({ email: data.email })

    res.status(200).send(token)
})

const port = process.env.PORT || 8080

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})
