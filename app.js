require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()

// Config JSON response
app.use(express.json())

// Models
const User = require('./models/User')

// Open Route - Public Route
app.get('/', (req, res) => {
    res.status(200).json({ msg: 'Bem vindo à minha API' })
})

// Private route
app.use('/user/:id', checkToken(), async (req, res) => {
    const id = req.params.id

    // Check if user exists
    const user = await User.findById(id, '-password')

    if (!user)
        return res.status(404).json({ msg: 'User not founded' })

    res.status(200).json({ user })
})

function checkToken(req, res, next) {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]

    if (!token)
        return res.status(401).json({ msg: 'Acesso negado' })

    try {
        
        const secret = process.env.secret

        jwt.verify(token, secret)

        next()
      
    } catch (err) {
        return res.status(400).json({ msg: 'Token inválido!' })
    }
}

// Register User
app.post('/auth/register', async (req, res) => {

    const { name, email, password, confirmPassword } = req.body

    if (!name || !email || !password || !confirmPassword)
        return res.status(400).json({ msg: 'Todos os campos são obrigatórios!' })

    if (password !== confirmPassword)
        return res.status(400).json({ msg: 'As senhas não conferem' })

    // Check if user already exists
    const userExists = await User.findOne({ email: email })

    if (userExists)
        return res.status(400).json({ msg: 'Email já cadastrado!' })

    // Create password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    const user = new User({
        name,
        email,
        password: passwordHash
    })

    try {

        await user.save()

        res.status(201).json({ msg: 'Usuario criado com sucesso! ' })

    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Aconteceu um erro no servidor, tente novamente mais tarde' })
    }
})

// Login User 
app.post('/auth/login', async (req, res) => {

    const { email, password } = req.body

    // Validations
    if (!email || !password)
        return res.status(400).json({ msg: 'Todos os campos são obrigatórios!' })

    // Check if user already exists
    const user = await User.findOne({ email: email })

    if (!user)
        return res.status(404).json({ msg: 'User not founded' })

    // Check if password match
    const checkPassword = await bcrypt.compare(password, user.password)

    if (!checkPassword)
        return res.status(422).json({ msg: 'Senha inválida' })

    try {

        const secret = process.env.secret
        const token = jwt.sign({
            id: user._id
        },
            secret,
        )

        res.status(200).json({ msg: 'login successful', token })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: 'Erro no servidor' })
    }
})

// Credencials
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD

mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@node-auth-jwt.posjvgk.mongodb.net/?retryWrites=true&w=majority&appName=Node-Auth-JWT`).then(() => {
    app.listen(3000)
    console.log("Connected to database")
}).catch((err) => console.log(err))
