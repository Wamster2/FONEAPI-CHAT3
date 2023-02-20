const express = require("express")
const router = express.Router()
const User = require("../models/User")
const MessageHistory = require("../models/Messages")
const bodyParser = require('body-parser')

const AuthController = require("../controllers/AuthController")


router.get("/register", (req,res) => {
    res.render("register")
})
router.get("/login", (req,res) => {
    res.render("login")
})
router.get("/dashboard", (req,res) => {
    res.render("dashboard")
})
router.get("/logout", (req,res) => {
    // req.logout()
    res.redirect("login")
})

//For post methods
router.post("/login", AuthController.register, (req,res) =>{
    res.render("login")
})

router.post("/dashboard", AuthController.login, async(req,res) =>{
    var LocalStorage = require('node-localstorage').LocalStorage;
    var localStorage = new LocalStorage('./scratch');
    localStorage.setItem('userToken', req.body.name)//if you are sending token. 
    console.log(localStorage.getItem('userToken'));
    res.render("dashboard")
})

// router.post("/addcontact", AuthController.addUserContact, (req, res) => {
//     // var contactName = document.getElementById("add-contact-input")
//     res.render("dashboard")
// })



module.exports = router