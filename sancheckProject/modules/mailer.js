const nodemailer = require('nodemailer');
const senderInfo = require('../config/senderInfo.json');
// 메일발송 객체
const mailSender = {
	// 메일발송 함수
    sendGmail : function(param){
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            prot : 587,
            host :'smtp.gmlail.com',
            secure : false,
            requireTLS : true,
            auth: {
                user: senderInfo.user,
                pass: senderInfo.pass
            }
        });
        // 메일 옵션
        var mailOptions = {
                from: senderInfo.user,
                to: param.toEmail, // 수신할 이메일
                subject: param.subject, // 메일 제목
                text: param.text // 메일 내용
            };
        // 메일 발송    
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
            console.log(error);
            } else {
            console.log('Email sent: ' + info.response);
            }
        });
        
    }
}
// 메일객체 exports
module.exports = mailSender;