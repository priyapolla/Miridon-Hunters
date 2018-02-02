var express = require("express");

var passport = require("../config/passport");

var path = require("path");

var isAuthenticated = require("../config/middleware/isAuthenticated");

var router = express.Router();

//for Sequelize operations
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// Import the models to use their database functions.
var db = require("../models");
//--------------------------------
// FINISHED ROUTES
//--------------------------------
// Create all our routes and set up logic within those routes where required.


router.post("/login", passport.authenticate("local"), function(req, res) {
  res.send("/profile");
});

// router.post("/login", passport.authenticate("local"), { successRedirect: "/profile",
//   failureRedirect: "/" }));

// router.get("/profile", function(req, res) {
//   res.render("profile");
// });

router.get("/", function(req, res) {
    res.render("login");
});

// router.get("/members", function(req, res) {
//   res.render("character-selection");
// });


router.post("/signup", function(req, res) {
  db.User.create(
  {
      email : req.body.email,
      password : req.body.password,
      username : req.body.username,
      user_bio : req.body.user_bio,
      profile_image : req.body.profile_image
  })
  .then(function(dbUser) {
    console.log(".then of signup post")
    res.redirect(307, "/login");
    // res.send("/profile" + "/" + dbUser.user_id);
    // res.render("login", dbUser);
  }).catch(function(err) {
    console.log(err);
    res.json(err);
    // res.status(422).json(err.errors[0].message);
  });

});

// router.get("/member", isAuthenticated, function(req, res) {
//   res.sendFile(path.join(__dirname, "../views/test_profile.html"));
// });

router.get("/loggedin", function(req, res) {
  if (!req.user) {
    // The user is not logged in, send back an empty object
    res.json({});
  }
  else {
    // Otherwise send back the user's email and id
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      email: req.user.email,
      username: req.user.username
    });
  }
});

router.get("/profile", function(req, res) {
  db.User.findOne({
    where: {
      user_id: req.user.user_id
    }
  }).then(function(data) {
    // console.log(JSON.stringify(data));
    // var hbsObject = data.dataValues;
    // console.log(hbsObject);
    // res.render("profile", hbsObject);
    var hbsObject = data.dataValues;
    console.log(hbsObject);
    // console.log(hbsObject);
    // console.log(hbsObject.user_id);
    res.render("profile", hbsObject);
  });
});

//generates page based on which class is selected
router.get("/generator/", function(req, res) {
  db.Class.findAll({
  }).then(function(data) {
    var hbsObject = {
        Class: data,
        Stats: [{name: "Strength",
            reference: "strength_point"},
            {name: "Speed",
            reference: "speed_point"},
            {name: "Ghost HP",
            reference: "ghost_hp"}
        ]};

    console.log(hbsObject);
    res.render("character-generator", hbsObject);
  });
});

router.get("/selection/:id", function(req, res) {
  // With no choices input from other characters
  // db.Character.findOne({
  //     where: {
  //     id: req.params.id
  // }}).then(function(hbsObject) {
  //     res.render("character-selection", hbsObject);
  // });


  //we want to get all the names and id's from character, but only the full character of the one shown.
  var hbsObject;
  db.Character.findAll({
    attributes: ['character_id','character_name']
  }).then(function(data) {
    hbsObject = {
      AllCharacters: data
    };
    console.log(hbsObject);
      db.Character.findOne({
        where: {
            id: req.params.id
        }
      }).then(function(data2) {
        hbsObject.character = data2;
        res.render("character-selection", hbsObject);
      });
    
  });
});

router.get("/battle/:id", function(req, res) {
  // Battle page needs:
  //   -All actions that are listed as 'basic' ...later we can add more types
  //   -actiontypes
  //   -player's character with findOne
  //   -enemy's character with findOne (generated based on player's win/loss ratio)

  //Action Types
  db.ActionTypes.findAll({
  }).then(function(typeData) {
    var hbsObject = {
      ActionTypes: typeData
      };
      console.log("-----------------------------------------");
    console.log("Action types: "+JSON.stringify(hbsObject));

    //Actions
    db.Action.findAll({
      where: {
        //List only basics for now
        category: 'basics'
      }
    }).then(function(ActionsData) {
      hbsObject.Actions = ActionsData;
      console.log("//////");
      console.log(JSON.stringify(hbsObject, null, 2));

      //player
      db.Action.findOne({
        where: {
          id: req.params.id
        }
      }).then(function(PlayerData) {
        hbsObject.Player = PlayerData;
        console.log(JSON.stringify(hbsObject, null, 2));
        //Finds win/plays ratio of player, adds random number between -.1 and .1 to it
        var randEnemy = parseFloat(Math.random()*.2 - .1) + (parseFloat(PlayerData.wins) / (parseFloat(PlayerData.wins) + parseFloat(PlayerData.losses)));
        if(!randEnemy){
          randEnemy = 0;
        }
        console.log(randEnemy);
        //enemy
        db.Action.findOne({
          where: {
            //not the player
            id: {
              [Op.ne]: req.params.id
            }
          },
          order: [
            [Sequelize.fn('ABS', Sequelize.literal('case when "wins" is null then 0 else ("wins" / ("wins"+ "losses") - '+randEnemy+') end')), 'ASC']]
            //((parseFloat("wins") / (parseFloat("wins") + parseFloat("losses"))) - randEnemy)

            //orders by how close enemy's win/play ratio is to players
          //[ABS( (parseFloat(wins) / (parseFloat(wins) + parseFloat(losses))) - randEnemy ) || 0, 'ASC']]
        }).then(function(EnemyData) {
          hbsObject.Enemy = EnemyData;
          console.log(hbsObject);
          res.render("battle", hbsObject);
        });
      });
    });
  });
});

//New user route
router.post("/api/User", function(req, res) {
  db.User.create([
    'email', 'password'
  ],[
    req.body.email, req.body.password
  ]).then(function(dbUser) {
  res.json({ id: dbUser.insertId });
  });
});

//New character
router.post("/api/Character", function(req, res) {
  db.Character.create(req.body).then(function(dbUser) {
  res.json({ id: dbUser.insertId });
  });
});


//API routes to get json data
router.get("/api/users", function(req, res) {
    db.User.findAll({
    }).then(function(dbUser) {
      res.json(dbUser);
    });
});

router.get("/api/characters", function(req, res) {
    db.Character.findAll({
    }).then(function(dbCharacter) {
      res.json(dbCharacter);
    });
});

router.get("/api/characters/:id", function(req, res) {
  db.Character.findOne({
    where: {
      id: req.params.id
    }
  }).then(function(dbCharacter) {
    res.json(dbCharacter);
  });
});

router.get("/api/users/:id", function(req, res) {
  db.User.findOne({
    where: {
      id: req.params.id
    }
  }).then(function(dbUser) {
    res.json(dbUser);
  });
});


router.get("/api/actions", function(req, res) {
  db.Action.findAll({
  }).then(function(dbAction) {
    res.json(dbAction);
  });
});

router.get("/api/actions/basics/", function(req, res) {
  db.User.findAll({
    where: {
      category: 'basics'
    }
  }).then(function(dbActions) {
    res.json(dbActions);
  });
});

router.get("/api/actions/availableByType/:type/:Strength/:Speed", function(req, res) {
  db.User.findAll({
    where: {
      category: 'basics',
      strength_cost: {[Op.lte]: reg.params.Strength},
      speed_cost: {[Op.lte]: reg.params.Speed},
      actionType: req.params.type
    }
  }).then(function(dbActions) {
    res.json(dbActions);
  });
});

router.get("/api/actions/available/:Strength/:Speed", function(req, res) {
  db.User.findAll({
    where: {
      category: 'basics',
      strength_cost: {[Op.lte]: req.params.Strength},
      speed_cost: {[Op.lte]: req.params.Speed}
    }
  }).then(function(dbActions) {
    res.json(dbActions);
  });
});

router.get("/api/actions/:name", function(req, res) {
  db.Action.findOne({
    where: {
      name: req.params.name
    }
  }).then(function(dbAction) {
    res.json(dbAction);
  });
});
//Update profile
router.put("/api/users/:id", function(req, res) {
  db.User.update({
    user_name: req.body.name,
    //user_email: req.body.email,
    password: req.body.password,
    user_bio: req.body.bio,
    profile_image: req.body.image
  }, {
    where: {
      id: req.body.id
    }
  }).then(function(dbUser) {
    res.json(dbUser);
  });
});

//update wins for user and character
router.put("/won/:user/:character", function(req, res) {
  db.User.update({
    wins: sequelize.literal(wins + 1)
  }, {
    where: {
      id: req.body.user
    }
  }).then(function(dbUser) {
    res.json(dbUser);
  });
  db.Character.update({
    wins: sequelize.literal(wins + 1)
  }, {
    where: {
      id: req.body.character
    }
  }).then(function(dbCharacter) {
    res.json(dbCharacter);
  });
});

//update losses for user and character
router.put("/lost/:user/:character", function(req, res) {
  User.update({
    losses: sequelize.literal(losses + 1)
  }, {
    where: {
      id: req.body.id
    }
  }).then(function(dbUser) {
    res.json(dbUser);
  });
  Character.update({
    losses: sequelize.literal(losses + 1)
  }, {
    where: {
      id: req.body.character
    }
  }).then(function(dbCharacter) {
    res.json(dbCharacter);
  });
});

//Delete user
router.delete("/api/users/:id", function(req, res) {
  db.User.destroy({
    where: {
        id: req.params.id
    }
  }).then(function(dbUser) {
  res.json(dbUser);
  });
});

//Delete character
router.delete("/api/characters/:id", function(req, res) {
  db.Character.destroy({
    where: {
        id: req.params.id
    }
  }).then(function(dbCharacter) {
  res.json(dbCharacter);
  });
});
//--------------------------------
// UNFINISHED ROUTES
//--------------------------------

// Export routes for server.js to use.
module.exports = router;