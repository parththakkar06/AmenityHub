const mailer = require('nodemailer')

const mailSend = async(to,subject,text) => {
    const transport = mailer.createTransport({
        service : "gmail",
        auth : {
            user : 'parththakkar1013@gmail.com',
            pass : 'scgf okfy vmny hodz'
        }
    })

    const mailOptions = {
        from : "parththakkar1013@gmail.com",
        to : to,
        subject : subject,
        html : text
    }

    const mailResponse = await transport.sendMail(mailOptions)
    console.log(mailResponse)
}


module.exports = {mailSend}