const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors')
const timeout = require('connect-timeout');
var emoji = require('node-emoji');

app.use(cors()); // this will Enable All CORS Requests 
app.use(timeout('5s'));
app.listen(port, () => console.log(`Listening on port ${port}`));

const STATE = [
  'online',
  'offline',
  'timeout',
  'error'
]

// create a GET route
app.get('/status', (req, res) => {
  // res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
  const currentStatus = STATE[Math.floor(Math.random()*STATE.length)]

  if (currentStatus !== 'timeout') {
    if (currentStatus === 'error') {
      return res.status(500).send({
        status: currentStatus,
        ...emoji.random(),
      })
    }

    if (Math.floor(Math.random()*2) === 0) {
      return res.send({
        status: currentStatus,
        ...emoji.random(),
      })
    }

    setTimeout(() => {
      res.send({
        status: currentStatus,
        ...emoji.random(),
      })
    }, 3000);
  }

});