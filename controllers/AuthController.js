const User = require("../models/User")
const MessageHistory = require("../models/Messages")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const bodyParser = require('body-parser')
const store = require("store2");


//Handles registration process
const register = async(req,res,next) => {
    bcrypt.hash( req.body.password,10 , function(err,hashedpass) {
        if(err){
            res.json({
                error:err
            })             
        }
        let user = new User({
            name: req.body.name,
            password: hashedpass
        })
        console.log(user)
        user.save()

        return res.render("login")
        // .then(user =>{
        //     res.json({
        //         message:"User Successfully registered"
        //     })
        // })
        // .catch(error => {
        //     res.json({
        //         message: "An error Occured"
        //     })
        // })
    })
}

//Handles Login process.
const login = async(req, res ) =>{
    var username = req.body.username
    var password = req.body.password


    const user = await User.findOne({name: username}) 
    //const userCookie = user.name
    // window.localStorage.setItem(key,JSON.stringify(userCookie)); 
    //console.log(userCookie)
    // store.set("loggedUser", {name: user.name})
    // console.log(store("loggedUser"))
        const match = await bcrypt.compare(password,user.password)
        console.log(match)

            if(match){
                return res.redirect(`dashboard?username=${username}`)
            }else{
                return res.render("login")
            }
}


// const addUserContact = (req, res, ) => {
//     const contactName = req.body.addcontactInput
    
//     return res.redirect("dashboard")
// }




module.exports = {
    register,login
}