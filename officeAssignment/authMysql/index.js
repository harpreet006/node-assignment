var express         = require('express'),
app             = express(),
passport        = require('passport'),
LocalStrategy   = require('passport-local').Strategy,
bodyParser      = require('body-parser'),
session         = require('express-session');
users =require('./models/users')

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: "tHiSiSasEcRetStr",
    resave: true,
    saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());
// passport needs ability to serialize and unserialize users out of session
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (id, done) {    
    done(null, id);
});

function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
        next();
    } else{
        res.redirect("/login");
    }
}
passport.use('local-login', new LocalStrategy(function (username, password, done) {
        users.userLogin(username,password,function(err,responce){
            if(err) throw (err)
                if(responce.length){
                    done(null,responce)
                }else{
                    done(null,false)
                }
        })
    })
);
 
app.get("/", function (req, res) {
    if(req.user){
         res.send(`welcome ${req.user[0].name}  you can your these method<br> <a href="users">LIST OF USERS</a><br><a href="users">GET SINGLE USER (PASS ID INTO URL AFTER USERS FOR EXAMPLE:USERS/:ID)</a>`);
    }else{
        res.send("welcome to home page <a href='/login'>login</a>");
    }
});

app.get("/login", function (req, res) {
    if(req.user){
        res.redirect('/content')
    }else{
        res.send("<p>Please login!</p><form method='post' action='/login'><input type='text' name='username'/><input type='password' name='password'/><button type='submit' value='submit'>Submit</buttom></form>");
    }
});

app.post('/signup', function(req, res) {
    mainRequest=Object.keys(req.body);
    let errorMessage=[]
    mainRequest.forEach(function(data){
        if(req.body[data]==""){
            errorMessage.push(data," Is empty")
        }
    })
    if(errorMessage.length){
         return res.send({status:'200',message:errorMessage})
    }else{
       users.checkUserExist(req.body,function(err,responce){
            if(err) throw (err)
                if(responce){
                    res.send({status:200,message:"User is already exist"})
                }else{
                    users.saveUser(req.body,function(err,responce){
                        if(err) throw (err)
                        if(responce){
                            res.send({status:200,message:"User successfully saved"})
                        }else{
                            res.send({status:200,message:"User can't saved"})
                        }
                    })
                }
        })
       
    }
});


app.get('/signup',function(req,res){
    res.send("<p>Signup login!</p><form method='post' action='/signup'><input type='text' name='fname'/><input type='password' name='password'/><button type='submit' value='submit'>Submit</buttom></form>")
})

app.get("/users", checkAuthentication,function (req, res) {
    users.findAllUser(function(err,result){
        if(err) throw(err)
            if(result.length){
               res.send({status:200,result:result})
            }else{
               res.send({status:200,message:"Record Not Found"})
            }
    })
});

app.get("/users/:id", checkAuthentication,function (req, res) {
    users.findAllUserById(req.params.id,function(err,result){
        if(err) throw(err)
            if(result.length){
               res.send({status:200,result:result})
            }else{
               res.send({status:200,message:"Record Not Found"})
            }
    })
});

app.post("/login",passport.authenticate("local-login", { failureRedirect: "/login"}),
    function (req, res) {
        res.redirect("/content");
});

app.post("/signup",passport.authenticate("local-signup", { failureRedirect: "/signup"}),
    function (req, res) {
        res.redirect("/content");
});

app.get('/content',checkAuthentication,function(req,res){     
    res.send({status:"200",message:`User successfully registered ${req.user[0].name}`})
}) 

// launch the app
app.listen(3031);
console.log("App running at localhost:3031");