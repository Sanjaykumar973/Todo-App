const express = require("express");

const router = express.Router();
const { checkBodyParams} = require("../midllewares/Generals.js");


// import controllors

const {
    signup, 
    login, 
    activateAccount, 
    sendForgetPasswordLink, 
    hanldePasswordUpdateDetials,
  } = require("../controllors/authentication");

//***********AUTHENTICATION ******************

// SingUp |POST|
router.post("/singup", checkBodyParams, signup );
// Route that will handle the account activation link sent on email
router.get("/activate-account/:token", activateAccount );
//  Login |POST|
router.post("/login",login); 
//sending forget password link
router.post("/forget-password", sendForgetPasswordLink);
//handle password
router.post("/handle-password-update", hanldePasswordUpdateDetials); 


module.exports = router;
