const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 3001
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('./src/middleware/cors')
const xss = require('xss-clean')
const user = require('./src/router/userRouter')
const post = require('./src/router/postRouter')

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(morgan('combined'))
app.use(helmet())
app.use(cors)
app.use(xss())

app.get('/', (req, res) => {
    res.json({ info: 'Project Online V1', author: 'Mahardhika Putra Pratama'})
})

app.use(user)
app.use(post)

app.listen(port, ()=>{
    console.log(`App running on http://localhost:3001`)
})