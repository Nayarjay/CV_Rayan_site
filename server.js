"use strict"



//cookie
const cookieSession = require('cookie-session');



/* Serveur pour le site de recettes */
var express = require('express');
var mustache = require('mustache-express');

//var model = require('./model');
var app = express();
// Définition du dossier pour les fichiers statiques (images, CSS, etc.)

app.use(express.static('public'));

// parse form arguments in POST requests
const bodyParser = require('body-parser');
const { rawListeners, title } = require('process');
const { Console } = require('console');
app.use(bodyParser.urlencoded({ extended: false }));

app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', './view');
app.use(express.static('./view/css'));
app.use(express.static('./view/image'))

app.use(cookieSession({
  secret: 'mot-de-passe-du-cookie',
}));
app.use(authenticated);
//app.use(change_header);

function is_authenticated(req, res, next) {
 
  if (!req.session.userid) {
   // res.redirect('/not_authenticated')
    return res.redirect('/login')
    
  }
  
  next();
}
function authenticated(req, res, next) {
  if(req.session.userid && req.session){
    res.locals.authenticated =true;
    res.locals.name = req.session.name;
   
  }else{
    // la session n'est pas valide
    res.locals.authenticated = false;
  }
 
  next();
}


/**** Routes pour voir les pages du site ****/

/* Retourne une page principale avec le nombre de recettes */
app.get('/', (req, res) => {


    res.render('index.html');

});










  







//récupération des données 
app.post('/login', (req, res) => {
  const { name, password } = req.body;

  // Vérifier si les champs sont renseignés
  if (!name || !password) {
    return res.redirect('/login?error=missing');
  }
  let result =model.checkLoginInput(name,password)
  //console.log(result.id);
  if(result != null ){
    
    req.session.userid= result.id;
    req.session.name=result.name;
    //console.log( "USER ID"+req.session.userid)
    res.redirect('/');
  }else{
    res.redirect('/loginFail');
    //res.redirect('/login');
  }

  

});
//logOutPost
app.post('/logout', (req, res) => {
  req.session.userid = null; // Destroys the current session
  req.session.name='';
  res.redirect('/'); // Redirects the user to the homepage
});


/* fonction permettant de gérer la création d'un utilisateur */

app.listen(3000, () => console.log('listening on http://localhost:3000'));

//