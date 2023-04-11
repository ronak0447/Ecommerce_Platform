const nodemailer = require('nodemailer');


const sendEmail = (options)=>{

    const transporter = nodemailer.createTransport({
        host:process.env.SMPT_HOST,
        port:process.env.SMPT_PORT,
        service:process.env.SMPT_SERVICE,
        auth:{
            user:process.env.SMPT_USERNAME,
            pass:process.env.SMPT_PASS,
        },
    });

    const mailOptions = {
        from:process.env.SMPT_USERNAME,
        to:options.email,
        subject:options.subject,
        text:options.message,
    };
     transporter.sendMail(mailOptions)
};

module.exports = sendEmail