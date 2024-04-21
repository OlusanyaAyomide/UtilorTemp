import nodemailer from "nodemailer"
import fs from "fs"
import handlebars from "handlebars"
import path from "path"



export const mailSender = async ({to,body,subject,name}:{to:string,body:string,subject:string,name:string})=>{
    const transporter = nodemailer.createTransport({ 
        host: process.env.EMAIL_HOST  as string,
        service:process.env.EMAIL_SERVICE as string,
        port:587,
        secure: true,
        auth:{
            user:process.env.EMAIL_USER ,
            pass:process.env.EMAIL_PASSWORD
        }
        })
        const sourcePath = path.join(__dirname,"..","templates","index.html")
        // console.log(sourcePath)
        const source = fs.readFileSync(sourcePath).toString()
        const template = handlebars.compile(source)
        const replacement = {
            name:`${name}`,
            body
        }
        const mailOptions = {
            from: "ayomideflex72@gmail.com",
            to,
            subject:subject,
            html: template(replacement),
        };
        try {
            const val = await transporter.sendMail(mailOptions);
            console.log(val.response)
            return  val.response
        } catch (error) {
            console.log(error);
            return null
        }
    
}

