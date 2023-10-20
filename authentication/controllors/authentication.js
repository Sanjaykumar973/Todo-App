const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../modals/user");
const signup = (req, res) => {
    const { firstName, lastName, email, phone, age, gender, password } = req.body;
  
    // If account with this email is already exist
    UserTodos.findOne({ email: req.body.email })
      .then((User) => {
        // If Email exist return the response from here only
        if (User) {
          return res.json({ success: false, message: "Email Already Use!" });
        }
        
        // if email is new then first we will has the password
        bcrypt.hash(password, 10, (err, has) => {
          if (err) {
            return res.json({ success: false, message: err.message });
          }
  
          //Create User in Database
          UserTodos.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            age: age,
            gender: gender,
            password: has,
          })
            .then((newUser) => {
              // if account is created successfully then sent an account Activation mail
              
              // generate token
              const token = jwt.sign(
                {
                  // firstName: newUser.firstName,
                  // email: newUser.email,
                  _id: newUser._id,
                },
                "2552",
                {expiresIn: 30*30}
              );
              
              // send this token on mail
                var transporter = nodemailer.createTransport({
                  service: "gmail",
                  auth: {
                    user : "sanjayka1993@gmail.com",
                    pass:"qugc vcsi fcxa hqgy",
                  },
                });
  
                var mailOptions = {
                  from:"sanjayka1993@gmail.com",
                  to: newUser.email,
                  subject:'Activate Your Account Todo',
                  html:`
                  <p>Hey ${newUser.firstName}, Wellcome in Todo APP. Your Account has been Created.
                  In Order to use your Account you have  to verify your email by clicking on following link.
                  </p>
                  <a style="padding:10px; background-color: dodgerblue; color:white" href="http://localhost:3010/auth/activate-account/${token}"> Activate Account </a>
                  `,
                };
                //sending email
                transporter.sendMail(mailOptions, function(error, info ){
                  if(error){
                    return  res.json({ success: false, message: "Error Occured" })
                  }
                  else{
                    return res.json({ 
                      success: true, 
                      message: 
                      "An Account Activation Link has been given Email" 
                    });
                  }
                });
              // res.json({ success: true, message: "Account Created" })
            })
            .catch((err) => res.json({ success: false, message: err.message }));
        });
      })
      .catch((err) => res.json({ success: false, message: err.message }));
  };

  const login = (req, res) => {
    const { email, password } = req.body;
    console.log(req.headers);
    UserTodos.findOne({ email: email })
      .then((User) => {
        if (!User) {
          return res.json({ success: false, message: "Email not found" });
        }
        // checking only: if user Exist then we will check emailisverify or not
        if(User.emailVerified== false){
          return res.json({ 
            success: false, 
            message: "Please Verify Your Account by link sent on mail" 
          });
        }
        // if user exsit then compare password
        bcrypt.compare(password, User.password, (err, result) => {
          if (result == true) {
            // if password is verified
            // We well Generate a token
            const token = jwt.sign(
              {
                firstName: User.firstName,
                email: User.email,
                _id: User._id,
              },
              "2552",
              {expiresIn: 30*30}
            );
  
            return res.json({
              success: true,
              message: "Logged In",
              token: token,
              firstName: User.firstName,
            });
          } else {
            return res.json({ success: false, message: "Wrong Password" });
          }
        });
      })
      .catch((err) => res.json({ success: false, message: err.message }));
  };



  const activateAccount = (req,res)=> {
    const token = req.params.token;
    //try to verify token
    try{
      const data= jwt.verify(token, "2552");
      
      //try to find the user now
      UserTodos.findOneAndUpdate({_id:data._id}, { emailVerified: true})
     .then (()=> res.redirect("http://localhost:5173/"))
     .catch(()=>res.json({
      success:false,  
      message:"Please Try again! we are sorry for inconvinece!"
    }));
    }
     
    catch(err)
    {
      return res.json({success:false, message:"Link has been Expired"})
    }
    
  };


  const sendForgetPasswordLink =(req, res) => {
            const {email} = req.body;
            
            //1 check if any Accounr exist with this email
            UserTodos.findOne({email})
            
            .then((user)=>{
            if(!user){
                return res.json({success:false, message:"No Account find with this email!"})
            }
            });
            
            // generete forget password token 
            
            let token = jwt.sign({_id:user._id}, "forgetPasswordToken2552",{
            expiresIn:30*30,
            });
            
            // modify the oken so that it will work on vite 
            let newToken1 = token.replace(".","-");
            let newToken2 = newToken1.replace(".","-");
            
            //send thistoken on email
            var transporter= nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:"sanjayka1993@gmail.com",
                pass: "qugc vcsi fcxa hqgy",
            },
            });
            
            var mailOptions ={
            from:"sanjayka1993@gmail.com",
            to: user.email,
            subject:"Forget Password",
            html:`
            <p>Hey ${user.firstName} Click on the followinglink to update your password</p>
            <a style="pading:10px; background-color:dogerblue"href="http://localhost:5173/forget-password/${newToken2}"> Update Password</a>
            <p>If it's not done by you, just ingone it </p>
            `,
            };
            
            // sending email
            transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return res.json({success:false, message:"Error Occured"});
            }
            else{
                return res.json({
                success:true,
                message:"An Forget Password Link Sent to Your email",
                });
            }
            })
            .catch((err)=> res.json({success:false, message:err.message}));
    };


    const hanldePasswordUpdateDetials = (req,res)=>{
        const {token,password} =req.body;
        
        //first change the token 
        //modify the token so that it will work on vite 
        let newToken1 = token.replace("--",".");
        let newToken2 = newToken1.replace("--",".");
      
        //verify the token 
        try{
          const data= jwt.verify(newToken2, "forgetpasswordToken2552");
      
          //has the password 
          bcrypt.hash(password, 10, (err,has)=>{
            if(err){
              return res.json({success:false,message:err.message});
            }
            UserTodos.findByIdAndUpdate(data._id, {password:has})
            .then(()=> res.json({success:true, message:"Password Updated"}))
            .catch((err)=> res.json({success:false, message:err.message}));
          });
        }
        catch(err){
          return res.json({success:false, message:err.message});
        }
      };



      module.exports = {signup, login, activateAccount, sendForgetPasswordLink, hanldePasswordUpdateDetials,};






