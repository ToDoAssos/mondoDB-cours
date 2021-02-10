
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Restaurant = require("./app/models/model");


const app = express();

const db = require("./app/models");
db.mongoose.connect(db.url, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => { console.log("Connected to the database!");})
  .catch(err => { console.log("Cannot connect to the database!", err); process.exit();});



var corsOptions = { origin: "http://localhost:3000" };
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//== Create
app.post("/", (req, res) => {
  const resto = new Restaurant({
    name: req.body.name,
    location: req.body.location,
  });
  resto.save(resto).then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send('Error');
  });
});

//== Get
app.get('/' ,(req, res) => {
  Restaurant.find().then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send('Error');
  });
});

//== Get Id
app.get('/:id' ,(req, res) => {
  Restaurant.find({_id: req.params.id}).then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send('Error');
  });
});


//== Update Id
app.post('/update' ,(req, res) => {
  Restaurant.findByIdAndUpdate(req.body._id, req.body).then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send('Error');
  });
});

//== Delete Id
app.post('/delete' ,(req, res) => {
  Restaurant.findByIdAndRemove(req.body._id).then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send('Error');
  });
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
