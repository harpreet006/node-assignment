var express         = require('express'),
    app             = express(),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local').Strategy,
    bodyParser      = require('body-parser'),
    session         = require('express-session');
    const  connection = require('./connection');
    var conn = connection.setconn
    conn.connect(function(err) {
  if (err) {
    return console.error('error: ' + err.message);
  }
 
  console.log('Connected to the MySQL server.');
});
 //   console.log(conn)
 
// hardcoded users, ideally the users should be stored in a database
/*var users = [
                {
                    "id":1, "username":"amy", "password":"amyspassword",
                    "id":2, "username":"singh", "password":"singh"
                }
            ];*/
 
// passport needs ability to serialize and unserialize users out of session
passport.serializeUser(function (user, done) {
    //console.log(user.id)
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    done(null, id);
});
 
// passport local strategy for local-login, local refers to this app
passport.use(new LocalStrategy(
 {
   usernameField: 'username',
   passwordField: 'password',
   passReqToCallback: true

 },
function (req, username, password, done) {
  {
    var fieldName = req.body.remebmer;
    console.log(fieldName)
    var sql= "select * from users where name='"+username+"' and password='"+password+"'"
    console.log(sql)
    conn.query(sql,function(req,responce){
        if(responce){
            return done(null, responce[0]);
        }else{
             return done(null, false, {"message": "User not found."});
        }
    })
    /*if (username === users[0].username && password === users[0].password) {
            return done(null, users[0]);
        } else {
            return done(null, false, {"message": "User not found."});
        }*/
  }
}));

/*passport.use('local', new LocalStrategy(
    function (username, password, done) {         
        if (username === users[0].username && password === users[0].password) {
            return done(null, users[0]);
        } else {
            return done(null, false, {"message": "User not found."});
        }
    })
);
*/
// body-parser for retrieving form data
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
// initialize passposrt and and session for persistent login sessions
app.use(session({
    secret: "tHiSiSasEcRetStr",
    resave: true,
    saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
 
// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    console.log(req.body)
    if (req.isAuthenticated())
        return next(); 
    res.redirect("/");
}

app.get("/", function (req, res) {
   //var loginvar= (req.user.id)?"req.user.id":""
    if(req.user){        
        var ajaxavar = req.user.username
        res.send("<p>Please login!</p><form  action='/logout'>welcome to "+ajaxavar+" user<button type='submit' value='submit'>Logout</buttom></form>!");
    }else{
        res.send("Hello!");
    }
});
 
// api endpoints for login, content and logout
app.get("/login", function (req, res) {
    if(req.user){
        res.redirect('/')
    }else{
        res.send("<p>Please login!</p><form method='post' action='/login'><input type='text' name='username'/><input type='password' name='password'/><input type='checkbox' name='remebmer' value='1'><button type='submit' value='submit'>Submit</buttom></form>");
    }
});
app.post("/login", 
    passport.authenticate("local", { failureRedirect: "/login"}),
    function (req, res) {

        res.redirect("/content");
});
app.get("/content", isLoggedIn, function (req, res) {

    res.send("Congratulations! you've successfully logged in.");
});

app.get("/test", isLoggedIn, function (req, res) {
    res.send("Welcome action working");
});

app.get("/logout", function (req, res) {
    req.logout();
    res.redirect('/')
});
 
// launch the app
app.listen(3030);
console.log("App running at localhost:3030");