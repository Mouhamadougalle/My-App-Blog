let express = require('express')
let sqlite3 = require('sqlite3')
let bodyParser = require('body-parser')
const cors = require('cors')



let app = express()
let port = 3001

// this is backend for our blog

// read blog_database.db
let db = new sqlite3.Database('blog_database.db', (err) => {
    if (err) {
        console.error(err.message)
    }
    console.log('Connected to the blog_database.db database.')
    }
)

// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())


app.post('/signup', bodyParser.urlencoded({ extended: true }),(req, res) => {
    console.log(req.body)
    let username = req.body.username
    let password = req.body.password
    let conf_password = req.body.conf_password

    if(!req.body.username || !req.body.password || !req.body.conf_password){
        res.send('Please fill out all fields')
        return
    }

    if (password !== conf_password) {
        res.send('Passwords do not match')
        return
    }
    // if username is too short
    if (username.length < 8) {
        res.send('Username must be at least 8 characters long')
        return
    }

    // if password is too short
    if (password.length < 8) {
        res.send('Password must be at least 8 characters long')
        return
    }

    // if username is too long
    if (username.length > 20) {
        res.send('Username must be less than 20 characters long')
        return
    }

    // if username already exists
    db.get('SELECT * FROM users WHERE username = ?', [username
    ], (err, row) => {
        if (err) {
            console.error(err.message)
        }
        if (row) {
            res.send('Username already exists')
            return
        }
        // if username is available
        else {
            db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err) => {
                if (err) {
                    console.error(err.message)
                }
                res.send('Account created')
        })}
    })
})

// login
app.post('/login', bodyParser.urlencoded({ extended: true }),(req, res) => {
    console.log(req.body)
    let username = req.body.username
    let password = req.body.password

    if(!req.body.username || !req.body.password){
        res.send('Please fill out all fields')
        return
    }

    // if incorrect username
    db.get('SELECT * FROM users WHERE username = ?', [username
    ], (err, row) => {
        if (err) {
            console.error(err.message)
        }
        if (!row) {
            res.send('Incorrect username')
            return
        }
        // if correct username
        else {
            // if incorrect password
            if (row.password !== password) {
                res.send('Incorrect password')
                return
            }
            // if correct password
            else {
                res.send('Login successful')
            }
        }
    })
})


app.post('/addblog', bodyParser.urlencoded({ extended: true }),(req, res) => {
    console.log(req.body)
    let title = req.body.title
    let content = req.body.content
    let author = req.body.author
    let date = req.body.date

    if(!req.body.title || !req.body.content || !req.body.author){
        res.send('Please fill out all fields')
        return
    }

    db.run('INSERT INTO blogs (title, content, creator, date) VALUES (?, ?, ?,?)', [title, content, author,date], (err) => {
        if (err) {
            console.error(err.message)
        }
        res.send('Blog added')
    })
})

app.get('/blogs', (req, res) => {
    db.all('SELECT * FROM blogs ORDER BY date DESC', (err, rows) => {
        if (err) {
            console.error(err.message)
        }
        res.send(rows)
    })
})



app.listen(port, () => {
    console.log(`Listening on port ${port}`)
}
)
