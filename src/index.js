const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session');
const passport =require('passport');
const { database } = require('./keys');
// Initializations
const app = express();
require('./lib/passport');
// Settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname,'views'))
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'),'layouts'),
  partialsDir:  path.join(app.get('views'),'partials'),
  extname: '.hbs',
  helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');


// Middlewares
app.use(session({
  secret: 'raywaydaysql',
  resave: false,
  saveUninitialized: false,
  store: new MySQLStore(database)
}))
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false})); // con extended el false le digo que recibiré cadenas, números (algo básico), si está en true podría recibir imágenes etc...
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// Global variables
app.use((req,res,next) =>{
  app.locals.success = req.flash('success');
  next();
})

//Routes 
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/links',require('./routes/links'));

//Public
app.use(express.static(path.join(__dirname,'public')))
//Starting the server
app.listen(app.get('port'), () =>{
  console.log('Server on port:',app.get('port'));
});