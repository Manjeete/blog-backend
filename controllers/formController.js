const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

exports.contactForm = async(req,res) =>{
    try{
        console.log(process.env.EMAIL_TO)
        const {email,name,message} = req.body;
    
        const emailData = {
            to:process.env.EMAIL_TO,
            from:"manjeetkr2017@gmail.com",
            subject:`Contact form email`,
            text:`Email recieved from contact form \n Sender name:${name} \n Sender email:${email} \n Sender message:${message}`,
            html:`
                <h4>Email recienved from contact form:</h4>
                <p>Sender name: ${name}</p>
                <p>Sender email: ${email}</p>
                <p>Sender message : ${message}</p>
                <hr />
                <p>This email may contain sensetive information</p>
                <p>https://manjeet.com</p>
            `
        };

        await sgMail.send(emailData).then(sent =>{
            return res.json({
                success:true,
                status:true
            })
        })
        
    }catch(err){
        console.log(err)
        return res.status(500).json({
            status:false,
            msg:err.response
        })
    }
}


exports.contactBlogAuthorForm = async(req,res) =>{
    try{
        console.log(process.env.EMAIL_TO)
        const {authorEmail,email,name,message} = req.body;

        let maillist = [authorEmail,process.env.EMAIL_TO]
    
        const emailData = {
            to:process.env.EMAIL_TO,
            from:"manjeetkr2017@gmail.com",
            subject:`Contact form email`,
            text:`Email recieved from contact form \n Sender name:${name} \n Sender email:${email} \n Sender message:${message}`,
            html:`
                <h4>Email recienved from contact form:</h4>
                <p>Name: ${name}</p>
                <p>Email: ${email}</p>
                <p>Message : ${message}</p>
                <hr />
                <p>This email may contain sensetive information</p>
                <p>https://manjeet.com</p>
            `
        };

        await sgMail.send(emailData).then(sent =>{
            return res.json({
                success:true,
                status:true
            })
        })
        
    }catch(err){
        console.log(err)
        return res.status(500).json({
            status:false,
            msg:err.response
        })
    }
}
