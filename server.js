const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 5001;

app.use(cors());

//Run in development mode
if (process.env.NODE_ENV === 'development') {
  dotenv.config({
    path: path.resolve(__dirname, `${process.env.NODE_ENV || 'development'}.env`)
  });
}

app.use(bodyParser.json());

// Define API routes
const codeAssistantRouter = require('./routes/serverRoutes');
app.use('/api', codeAssistantRouter);

console.log(`NODE_ENV=${process.env.NODE_ENV}`);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
