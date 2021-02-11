
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const User = require("./app/models/model");
const redis = require("redis")
const db = require("./app/models");


const app = express();

db.mongoose.connect(db.url, {useNewUrlParser: true, useUnifiedTopology: true})
// db.mongoose.connect(db.url, {useNewUrlParser: true, useUnifiedTopology: true, user: 'root', pass : 'root', auth : {authdb : "admin"} } )
  .then(() => { console.log("Connected to the database!");})
  .catch(err => { console.log("Cannot connect to the database!", err); process.exit();});

const config = {
    host: 'localhost',
    port: 6379,
    password: 'root'
}
var publisher  = redis.createClient(config)




var corsOptions = { origin: "http://localhost:3000" };
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//== Create
app.post("/", (req, res) => {
  const user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  });
  user.save(user).then(data => {
      publisher.publish("users channel", "Utilisateur ajouté: '" +  user.firstname + "'/'" +  user.lastname + "'")
      res.send(data);
    })
    .catch(err => {
      res.status(500).send('Error add');
  });
});

//== Get
app.get('/' ,(req, res) => {
  User.find().then(data => {
      publisher.publish("users channel", "Liste des utilisateurs récupérée")
      res.send(data);
    })
    .catch(err => {
      res.status(500).send('Error get');
  });
});

//== Get Id
app.get('/:id' ,(req, res) => {
  User.findById(req.params.id).then(data => {
      let firstname = data.firstname;
      let lastname = data.lastname;
      publisher.publish("users channel", "Utilisateur '" +  firstname + "'/'" +  lastname + "' récupéré")
      res.send(data);
    })
    .catch(err => {
      res.status(500).send('Error GetById');
  });
});


//== Update Id
app.post('/update' ,(req, res) => {
  User.findByIdAndUpdate(req.body._id, req.body).then(data => {
      let firstname = data.firstname;
      let lastname = data.lastname;
      publisher.publish("users channel", "Utilisateur '" +  firstname + "'/'" +  lastname + "' mis à jour")
      res.send(data);
    })
    .catch(err => {
      res.status(500).send('Error Update');
  });
});

//== Delete Id
app.post('/delete' ,(req, res) => {
  User.findByIdAndRemove(req.body._id).then(data => {
      publisher.publish("users channel", "Utilisateur id '" +  req.body._id +  "' supprimé")
      res.send('Utilisateur supprimé');
    })
    .catch(err => {
      res.status(500).send('Error delete');
  });
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
