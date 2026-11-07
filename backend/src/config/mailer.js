const { createTransport } = require("nodemailer");
const config = require("./config");

const transporter = createTransport({
    service: "gmail",
    auth:{
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS
    }
})

module.exports = transporter