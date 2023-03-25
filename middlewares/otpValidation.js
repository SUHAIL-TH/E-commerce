 const nodemailer = require("nodemailer");

module.exports={
    mailTransporter: nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: 'eshoes518@gmail.com',
            pass:''
        },
    }),
      
     OTP : `${Math.floor(1000 + Math.random() * 9000)}`,

}
