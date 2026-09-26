const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());

const notes = [
    {
        username: "heygaurav1",
        notes: "Go to library"
    }
]; // file based memory

const users = [
    {
        username: "heygaurav1",
        password: "gaurav7781"
    }
];


// SIGNUP
app.post("/signup", function(req, res) {

    const username = req.body.username;
    const password = req.body.password;

    const userExist = users.find(
        user => user.username === username
    );

    if (userExist) {
        return res.status(403).json({
            message: "user with this username already exists!"
        });
    }

    users.push({
        username: username,
        password: password
    });

    res.json({
        message: "You have signed up!"
    });
});


// SIGNIN
app.post("/signin", function(req, res) {

  const username = req.body.username;
  const password = req.body.password;

  const userExist = users.find(
    user => user.username === username &&
            user.password === password
  );

  if (!userExist) {
    return res.status(403).json({
      message: "No users exist"
    });
  }

  const token = jwt.sign(
    {
      username: username
    },
    "gaurav7781"
  );

  res.json({
    token: token
  });
});


// POST: create a new note
app.post("/notes", function(req, res) {

    const token = req.header("token"); //Bugs 1

    if (!token) {
        res.status(403).send({
            message: "You are not logged in"
        });
        return;
    }

    const decode = jwt.verify(token,"gaurav7781");
    const username = decode.username;

    if(!username) {
        res.status(403).json({
         message: "malformed token"
      });
      return;
    }

    const note = req.body.note;
    notes.push({
        username: username,
        notes: note
    });   

    res.json({
        message: "Done!"
    });
});


// GET: all notes
app.get("/notes", function(req, res) {
    const token = req.header("token"); // Bug 2

    if(!token) {
        res.status(403).send({
            message: "You are not logged in"
        });
        return;
    }

    const decode = jwt.verify(token,"gaurav7781");
    const username = decode.username;

    if (!username) {
        return res.status(403).json({
            message: "malformed token"
        });
    }

    const userNotes = notes.filter(
        note => note.username === username
    );

    res.json({
        notes: userNotes
    });
});


// Home page
app.get("/", function(req, res) {
 res.sendFile("/Users/gauravpaul/Developer/Cohorts/web2/authetication_JWT_localStorages/jwt/notes.html");

});

app.get("/signin", function(req, res) {
    res.sendFile("/Users/gauravpaul/Developer/Cohorts/web2/authetication_JWT_localStorages/jwt/signin.html");
   
   });

   app.get("/signup", function(req, res) {
    res.sendFile("/Users/gauravpaul/Developer/Cohorts/web2/authetication_JWT_localStorages/jwt/signup.html");
   
   });
   


app.listen(3001);

// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImhleWdhdXJhdjEiLCJpYXQiOjE3OTA0NDQ3MTN9.cM1zMLEL_e1zZf43MFqT2mFvJbvT4pnzPATFVVbOdA4"