const mailer = require('nodemailer')

const getTransporter = () => {
    const user = process.env.EMAIL_USER || 'parththakkar1013@gmail.com'
    const pass = process.env.EMAIL_PASS || 'scgf okfy vmny hodz'

    return mailer.createTransport({
        service: "gmail",
        auth: { user, pass }
    })
}

const mailSend = async (to, subject, text) => {
    const user = process.env.EMAIL_USER || 'parththakkar1013@gmail.com'
    const transport = getTransporter()

    const mailOptions = {
        from: `"AmenityHub" <${user}>`,
        to: to,
        subject: subject,
        html: text
    }

    const mailResponse = await transport.sendMail(mailOptions)
    console.log("Email sent:", mailResponse.messageId)
    return mailResponse
}

const sendOtpMail = async (to, otp) => {
    const user = process.env.EMAIL_USER || 'parththakkar1013@gmail.com'
    const transport = getTransporter()

    const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AmenityHub Verification Code</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f4f7f6;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 550px;
                margin: 30px auto;
                background: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 15px rgba(0,0,0,0.08);
            }
            .header {
                background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
                padding: 30px 20px;
                text-align: center;
                color: #ffffff;
            }
            .header h1 {
                margin: 0;
                font-size: 26px;
                font-weight: 700;
                letter-spacing: 1px;
            }
            .header p {
                margin: 5px 0 0 0;
                font-size: 14px;
                opacity: 0.9;
            }
            .content {
                padding: 35px 30px;
                text-align: center;
                color: #334155;
            }
            .content h2 {
                margin-top: 0;
                font-size: 20px;
                color: #1e293b;
            }
            .otp-box {
                margin: 25px 0;
                padding: 20px;
                background: #f1f5f9;
                border-radius: 8px;
                border: 2px dashed #cbd5e1;
                display: inline-block;
            }
            .otp-code {
                font-family: 'Courier New', Courier, monospace;
                font-size: 38px;
                font-weight: 800;
                letter-spacing: 12px;
                color: #4f46e5;
                margin-left: 12px;
            }
            .warning {
                background-color: #fef3c7;
                border-left: 4px solid #f59e0b;
                padding: 12px 15px;
                border-radius: 6px;
                font-size: 13px;
                color: #92400e;
                text-align: left;
                margin-top: 25px;
            }
            .footer {
                background: #f8fafc;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #94a3b8;
                border-top: 1px solid #e2e8f0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>AmenityHub</h1>
                <p>Residential & Facility Management</p>
            </div>
            <div class="content">
                <h2>Your Verification Code</h2>
                <p>Use the following 6-digit OTP code to complete your login verification:</p>
                <div class="otp-box">
                    <span class="otp-code">${otp}</span>
                </div>
                <div class="warning">
                    <strong>⏰ Important:</strong> This code is valid for <strong>5 minutes</strong> and can only be used once. Please do not share this code with anyone.
                </div>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} AmenityHub. All rights reserved.
            </div>
        </div>
    </body>
    </html>
    `

    const mailOptions = {
        from: `"AmenityHub Support" <${user}>`,
        to: to,
        subject: `🔒 ${otp} is your AmenityHub Verification Code`,
        html: htmlTemplate
    }

    const mailResponse = await transport.sendMail(mailOptions)
    console.log("OTP Email sent to", to, ":", mailResponse.messageId)
    return mailResponse
}

module.exports = { mailSend, sendOtpMail }