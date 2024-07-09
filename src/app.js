const express = require('express');
const port = process.env.PORT || 3000;
const app = express();
const route = require('./routes/index');
const bodyParser = require('body-parser');
const cors = require('cors');
const handleError = require('./common/error');
require('./database/mongoose');


app.use( bodyParser.json() );
app.use( express.json() );


// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Frontend URL you want to allow CORS requests from
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};
app.use(cors(corsOptions));
app.use('/', route);

app.use((err, req, res, next) => {
  handleError(err, req, res);
});

app.listen(port, () => {
  console.log('Server listening on ' + port);
});
