const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World! ID: ' + process.env.SERVICE);
});

app.listen(3000, () => {
  console.log('Server is running');
});
