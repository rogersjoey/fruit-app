const express = require('express');
const router = express.Router();

// const users = require("../users");
const Fruit = require('../models').Fruit;
const User = require('../models').User;

router.get("/profile/:id", (req, res) => {
    // IF USER ID FROM TOKEN MATCHES THE REQUESTED ENDPOINT, LET THEM IN
    if (req.user.id == req.params.id) {
      User.findByPk(req.params.id, {
        include: [
          {
            model: Fruit,
            attributes: ["id", "name"],
          },
        ],
      }).then((userProfile) => {
        res.render("users/profile.ejs", {
          user: userProfile,
        });
      });
    } else {
      // res.json("unauthorized");
      res.redirect("/");
    }
  });

//pull up user profile data to EDIT
router.put('profile/:id', (req, res) => {
    User.update(req.body,{
        where: {
            id:req.params.id,
        },
        returning:true,
    }).then((updatedUser) => {
        res.redirect(`users/profile/${req.params.id}`);
    });
});

router.delete("/:id", (req,res)=> {
    User.destroy({
        where:{
           id:req.params.id,
        },
    }).then(() => {
        res.redirect('/')
    });
});

module.exports = router;