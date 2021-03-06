const express = require("express");
const cors = require('cors')
const {
  notFound,
  mongooseError,
  productionError,
} = require("./handlers/errorHandlers");

const app = express();

app.use(cors({origin:'*'}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// setup routes
app.use(require("./routes/chatroom"));
app.use(require("./routes/user"));

// setup error handlers
app.use(notFound);
app.use(mongooseError);
app.use(productionError);

module.exports = app;
