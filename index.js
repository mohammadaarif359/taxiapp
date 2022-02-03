const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')
connectToMongo();

const app = express()
const port = 5000

// for cors app 
app.use(cors())
// end cors app
app.use(express.json());

// available routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/supply', require('./routes/supply'))
app.use('/api/customer', require('./routes/customer'))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

