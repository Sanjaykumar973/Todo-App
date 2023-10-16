
const jwt = require("jsonwebtoken");
//this midleware will be use for vaidating the data while singup
function checkBodyParams(req, res, next)
{
 const {firstName, lastName, email, phone, age, gender, password} = req.body;


 if(!firstName || !lastName ||!email || !phone || !age || !gender || !password )
 return res.json({success:false, message:"Invalid Data"});


 if(password.length <6 )
    return res.json({success:false, message:"Week Password"});


 if (firstName.length <=1 )
  return res.json({success:false, message: "Invalid Name"});


  if(email.length < 6)
  return res.json({success:false, message:"Invalid Email"});


  next();
}

// This middleware you can use in any route where you need only loggedin peopel
function isLoggedIn(req,res,next)
{
   const token = req.headers.authorization;

   try{
      const data = jwt.verify(token, "2552");
      
      // Injecting the dat inside the request so that the next controllor can access this injected data this is the
    // method for passing the data from  middleware to controllor
      req.tokenData = data;

      return next();

      //after you can write your token
   }
   catch(err){
      return res.json({ success:false, message: err.message });
   }
}


module.exports= { checkBodyParams, isLoggedIn }