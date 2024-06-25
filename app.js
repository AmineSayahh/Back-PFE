var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
var logger = require('morgan');
const { userRouter } = require('./routes/users.route');
const { authRouter } = require('./routes/auth.route');
const passport = require("passport");
const { postRouter } = require('./routes/posts.route');
const { adminRouter } = require('./routes/admin.route');
const { superAdminRouter } = require ('./routes/superAdmin.route');
const { enseignantRouter } = require('./routes/enseignant.route');
const { groupeRouter } = require('./routes/groupe.route');
const { testsRouter } = require('./routes/tests.route');
const cors = require('cors');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(passport.initialize());
require("./middleware/passport")(passport);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("db connected"))
  .catch((err) => console.log(err));

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
};

app.use(cors(corsOptions));

app.use("/api", [userRouter, authRouter, postRouter, adminRouter, superAdminRouter, enseignantRouter, groupeRouter, testsRouter ]);

module.exports = app;
