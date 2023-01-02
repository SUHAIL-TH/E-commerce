module.exports = {
    verifyLoginAdmin: (req, res, next) => {
      if (req.session.logedIn ) {
        next();
      } else {
        res.redirect("/admin");
      }
    },
    verifyLoginUser: (req, res, next) => {
      if (req.session.logedIn ){
        customer=true
        next();
      } else {
        res.redirect("/userlogin");
      }
    },
  };