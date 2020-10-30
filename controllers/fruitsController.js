const express = require('express');
const router = express.Router();

// Add fruit model
//const fruits = require("../fruits.js");
const Fruit = require('../models').Fruit;
const User = require('../models').User;
const Season = require("../models").Season;

// Add index route
router.get("/", (req, res) => {
  Fruit.findAll().then((fruits) => {
    res.render("index.ejs", {
      fruits: fruits,
    });
  });
});

//put this above your show.ejs file
router.get("/new", (req, res) => {
  res.render("new.ejs");
});

//POST ==> Create a new fruit
router.post('/',(req,res) => {
  if(req.body.readyToEat === 'on'){
      req.body.readyToEat = true;
  } else {req.body.readyToEat = false;}
  // console.log(fruits);
  Fruit.create(req.body).then((newFruit) => {
    res.redirect("/fruits");
  });
});


//GET ==> this is our homepage
//and user can click on the url to create a new fruit
router.get('/', (req, res) => {
  res.render('index.ejs',{
      fruits: fruits
  });
});

//GET ==> show form to user
router.get('/new',(req,res) => {
  res.render('new.ejs');
})



router.get("/:id", (req, res) => {
  Fruit.findByPk(req.params.id, {
    include : [{
      model: User,
      attributes: ["name"],
    },
    {
      model: Season,
    }, 
  ],
  }).then(fruit => {
    res.render('show.ejs', {
        fruit: fruit
    });
  })
});

// router.get('/:index', (req, res) => {
//   res.render('show.ejs',{ //second param must be an object
//       fruit: fruits[req.params.index] //there will be a variable available inside the ejs file called fruit, its value is fruits[req.params.index]
//   });
//   res.redirect('/');
  //October 15 code
  // if(fruits[req.params.index]){
  //     res.send(fruits[req.params.index]);
  // } else {
  //     res.send('Cannot find the fruit')
  // }
  // console.log(fruits[req.params.index]);
  // console.log(req.params.index);
  // res.send(fruits[req.params.index]);
// });


//DELETE single object
router.delete("/:id", (req, res) => {
  Fruit.destroy({ where: { id: req.params.id } }).then(() => {
    res.redirect("/fruits");
  });
});


//GET ==> prefill the data from the model//

router.get('/:id/edit', function(req, res){
  Fruit.findByPk(req.params.id).then((foundFruit) => {
    Season.findAll().then((allSeasons) =>{
      res.render("edit.ejs", {
        fruit: foundFruit,
        seasons: allSeasons,
      });
    });
  });
});
// res.render(
//   'edit.ejs', //render views/edit.ejs
//   { //pass in an object that contains
//     fruit: fruits[req.params.index], //the fruit object
//     index: req.params.index //... and its index in the array
//   }
//   );
// });

//PUT ==> Update the date in our model
router.put("/:id", (req, res) => {
  if (req.body.readyToEat === "on") {
    req.body.readyToEat = true;
  } else {
    req.body.readyToEat = false;
  }
  Fruit.update(req.body, {
    where: { id: req.params.id },
    returning: true,
  }).then((updatedFruit) => {
    Season.findByPk(req.body.season).then((foundSeason) =>{
      Fruit.findByPk(req.params.id).then((foundFruit) => {
        foundFruit.addSeason(foundSeason);
        res.redirect("/fruits");
      });
    });
  });
});

module.exports = router;	