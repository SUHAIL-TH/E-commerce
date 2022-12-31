 const nodemailer = require("nodemailer");

module.exports={
    mailTransporter: nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: 'suhailth313@gamil.com',
            pass: 'dvyrubleuwqyeorr'
        },
    }),
      
     OTP : `${Math.floor(1000 + Math.random() * 9000)}`,

}
