require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const User = require("./models/User.model");
const passport     = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const bcrypt = require("bcryptjs");
const saltRounds = 10;


const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();
const createSession = require('./configs/session.config');
createSession(app);

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//PASSPORT SETUP
passport.serializeUser((user, callback) => {
  callback(null, user._id);
});

passport.deserializeUser((id, callback) => {
  User.findById(id)
    .then(user => {
      callback(null, user);
    })
    .catch(error => {
      callback(error);
    });
});

passport.use(
  new GoogleStrategy({
      clientID: `${process.env.GOOGLE_ID}`,
      clientSecret: `${process.env.CLIENT_SECRET}`,
      callbackURL: "/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("Google account details:", profile);
      User.findOne({
          googleID: profile.id
        }).then(user => {
          if (user) {
            done(null, user);
            return;
          }
          
          bcrypt
            .genSalt(saltRounds)
            .then(salt => bcrypt.hash(profile.id, salt))
            .then(hashedPassword => {
              return User.create({
              googleID: profile.id,
              email: profile.emails[0].value,
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              profilePic: profile.photos[0].value,
              username: profile.displayName,
              passwordHash: hashedPassword
            })
            })
            .then(newUser => {
              done(null, newUser);
            })
            .catch(err => done(err)); // closes User.create()



        })
        .catch(err => done(err)); // closes User.findOne()
    })
);

app.use(passport.initialize());
app.use(passport.session());
//END OF PASSPORT SETUP

// Express View engine setup
app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));

//require DB configuration
require('./configs/db.config');
//require Session configuration
require('./configs/session.config')(app);

//register views, partials and static content
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, "/views/partials"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.png')));

//register helper
hbs.registerHelper("googleKey", () => process.env.GOOGLE_MAPS_KEY)

// default value for title local
app.locals.title = 'Mi Mascota';


//Routes
const index = require('./routes/index.routes');
const authRouter = require('./routes/auth.routes');
const userRouter = require('./routes/user.routes')
const petRouter = require('./routes/pet.routes')
const appointmentsRouter = require('./routes/appointment.routes')
app.use('/', index);
app.use('/', authRouter);
app.use('/', userRouter);
app.use('/', petRouter);
app.use('/', appointmentsRouter)


module.exports = app;
