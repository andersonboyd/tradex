var db = require("../models");
var passport = require("../config/passport");
var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {
  // Load index page
  app.get("/", isAuthenticated, function(req, res) {
    if(!isAuthenticated){
      res.redirect("/login");
    }
    db.Example.findAll({}).then(function(dbExamples) {
      res.render("index", {
        msg: "Welcome!",
        examples: dbExamples
      });
    });
  });

  app.post("/register", function(req, res){
    res.render("register");
  });

  app.post("/login", passport.authenticate("local"), {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  });

  // Load example page and pass in an example by id
  app.get("/example/:id", function(req, res) {
    db.Example.findOne({ where: { id: req.params.id } }).then(function(dbExample) {
      res.render("example", {
        example: dbExample
      });
    });
  });

  app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
  });
  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
