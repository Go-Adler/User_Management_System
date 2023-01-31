const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const nodeMailer = require('nodemailer')

const sendVerifyMail = async (name, email, user_id) => {
    try {
        const transporter = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: 'goadlerstorage@gmail.com',
                pass: 'Amg4w4i-illicit?galm'
            }
        })
        const mailOptions = {
            from: 'goadlerstorage@gmail.com',
            to: email,
            subject: 'For verification.',
            html: '<p>Hi' + name + 'please click here to <a href = "http://127.0.0.1:3000/verify?id=' + user_id + '"> verify </a> your email.</p>'
        }
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error);
            } else {
                console.log("Email has been sent: " + info.response);
            }
        })
    } catch (error) {
        console.log(error.message);
    }
}

const securePassword = async(password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10)
        return passwordHash
    } catch (error) {
        console.log(error.message);
    }
}
const loadRegister = async(req, res) => {
    try {
        res.render('registration')
    } catch (error) {
        console.log(error.message)
    }
}

const insertUser = async(req, res) => {
    try {
        const sPassword = await securePassword(req.body.password)
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mno,
            image: req.file.filename,
            password: sPassword,
            is_admin: 0,
        })
        const userData = await user.save()
        if (userData) {
            sendVerifyMail(req.body.name, req.body.email, userData._id)
            res.render('registration', {message: 'Your registration has been successful, please verify you mail.'})
        } else {
            res.render('registration', {message: 'Your registration has been failed.'})
        }
    } catch (error) {
        console.log(error.message)
    }
}

const verifyMail = async(req, res) => {
    try {
        const updateInfo = User.updateOne({_id:req.query.id}, {$set: {is_verified:1}})
        console.log(updateInfo);
        res.render('email-verified')
    } catch (error) {
        console.log(error.message);
    }
}
module.exports = {
    loadRegister,
    insertUser,
    verifyMail
}

