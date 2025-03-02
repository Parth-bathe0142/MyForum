const express = require("express")
const path = require('path')
const session = require('express-session')
const { connectDB } = require('./mongoClient.js')
const { ObjectId } = require('mongodb');

require('dotenv').config()

const port = process.env.PORT
const app = express()
let client;


app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.use('/', express.static(path.join(__dirname, '../public')))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/test", (_, res) => {
    res.json({ result: "success" })
})






app.post("/signup_request", async (req, res) => {
    client = await connectDB()
    const { username, password } = req.body
    const accounts = client.db('forums').collection('accounts')

    try {
        const match = await accounts.findOne({ username })
        
        if (match) {
            res.json({ result: "Failure", reason: "User already exist" })
        }
        else {
            let inserted = await accounts.insertOne({ username, password })
            req.session.username = username
            req.session.userId = inserted.insertedId
            res.json({ result: "success" })
        }
    } catch (error) {
        console.error("Signup error:", error)
        res.json({ result: "Failure", reason: "Internal server error" })
    }
})

app.post("/login_request", async (req, res) => {
    client = await connectDB()
    const { username, password } = req.body
    const accounts = client.db('forums').collection('accounts')

    try {
        const user = await accounts.findOne({ username })
        if (!user) {
            return res.json({ result: "failure", reason: "User not found" })
        } else if (password !== user.password) {
            return res.json({ result: "failure", reason: "Incorrect username/password" })
        }
        req.session.username = username
        req.session.userId = user._id

        res.json({ result: "success" })
    } catch (error) {
        console.log("Login error : ", error)
        res.json({ result: "failure", reason: "Internal server error" })
    }
})

app.get("/logout_request", (req, res) => {
    delete req.session.username
    delete req.session.userId
    res.json({ result: "success" })
});








app.get("/pageload", (req, res) => {
    if(req.session.username) {
        res.json({ result: "success", username: req.session.username })
    } else {
        res.json({ result: "failure", reason: "not logged in" })
    }
})

app.get("/forum-list", async (_, res) => {
    try {
        client = await connectDB()
    
        const collection = client.db('forums').collection('forum_data')
        const documents = collection.find({})
    
        let str = ""
        let count = 0;
        for await (const doc of documents) {
            str += `<div id="${doc._id}" class="forum-item">
            <h3 class="forum-name">${doc.name}</h3>
            <h4 class="forum-owner">Started by: ${doc.owner}</h4>
            </div>`
            count++
        }

        if(count == 0) {
            str = `<div class="no-forums">No forums exist</div>`
        }
        
        return res.json({ result: "success", count, elements: str })
        
    } catch (error) {
        res.json({ result: "failure", reason: error })
    }
})

app.get("/forum/:id", async (req, res) => {
    try {
        client = await connectDB()
        

        const collection = client.db('forums').collection('posts')
        const documents = collection.find({ forumId: req.params.id }).sort("timestamp")
    
        let str = ""
        let count = 0;
        for await (const doc of documents) {
            
            str += `<div id="${doc.forumId}" class="post-item">
            <h3 class="post-poster">${doc.poster}</h3>
            <h4 class="post-message">${doc.message}</h4>
            </div>`
            count++
        }
    
        if(count == 0) {
            str = `<div class="no-post">No posts here</div>`
        }

        return res.json({ result: "success", count, elements: str })
        
    } catch (error) {
        res.json({ result: "failure", reason: error })
    }
    
})





app.post("/new-forum", async (req, res) => {
    client = await connectDB()

    const name = req.body.name
    const { username, userId } = req.session
    if(!name || !username) {
        return res.json({ result: "failure", reason: "empty name" })
    }
    const forums = client.db("forums").collection("forum_data")

    let match = await forums.findOne({ name })
    if(match) {
        return res.json({ result: "failure", reason: "already exists" })
    }
    forums.insertOne({ name, owner: username, ownerId: userId })

    return res.json({ result: "success" })
})


app.post("/new-post", async (req, res) => {
    client = await connectDB()
    
    const { message, forum } = req.body
    const { username, userId } = req.session
    if (!message || !forum || !username) {
        return res.json({ result: "failure", reason: "Invalid input" })
    }

    const forums = client.db("forums").collection("forum_data")
    const posts = client.db("forums").collection("posts")

    const forumExists = await forums.findOne({ _id: new ObjectId(forum) })
    if (!forumExists) {
        return res.json({ result: "failure", reason: "Forum does not exist" })
    }

    await posts.insertOne({ message, poster: username, posterId: userId, forumId: forum })

    return res.json({ result: "success" });
});



app.listen(port, async () => {
    console.log(`Listening at http://localhost:${port}`)
})
