const signinHelper = require('../../models/user/signin')
const client = require('twilio')(process.env.accountSID, process.env.authToken);


exports.postUserSignup = (req, res) => {
    console.log(req.body);
    signinHelper.userSignup(req.body).then((response) => {
        // res.redirect('/user_signin')
        res.json({ status: true })
    }).catch((response) => {
        res.json({ status: false })
    })
}

exports.postUesrSignin = (req, res) => {
    signinHelper.userSignin(req.body).then((response) => {
        // let phoneNumber = response.user.phone_number;
        // client
        //   .verify
        //   .services(process.env.serviceID)
        //   .verifications
        //   .create({
        //     to: `+91${phoneNumber}`,
        //     channel: 'sms'
        //   }).then(() => {
        //     req.session.user = response.user;
        //     res.render('user/otp_verification', { phoneNumber, nohead: true })
        //   }).catch((err) => {
        //     console.log(err)
        //   })
        req.session.loggedIn = true;
        req.session.user = response.user;
        res.json({ status: true })
    }).catch((response) => {
        res.json({ status: false })
    })
}

// exports.postOTP = (req, res) => {
//     client
//         .verify
//         .services(process.env.serviceID)
//         .verificationChecks
//         .create(
//             {
//                 to: `+91${req.body.phoneNumber}`,
//                 code: req.body.code
//             }).then((data) => {
//                 console.log(data);
//                 if (data.valid) {
//                     req.session.loggedIn = true;
//                     res.redirect('/')
//                 } else {
//                     delete req.session.user;
//                     res.redirect('/user_signin')
//                 }
//             }).catch((err) => {
//                 delete req.session.user;
//                 res.redirect('/user_signin')
//             })
// }

exports.userLogout = (req, res) => {
    delete req.session.user
    delete req.session.loggedIn
    res.redirect('/')
}