import nodemailer from "nodemailer"
import fs from "fs"
import handlebars from "handlebars"

// import axios from "axios";


// export const mailSender = async ({to,body,subject,name}:{to:string,body:string,subject:string,name:string})=>{
//     console.log("mail triggered")
//     const url = "https://api.brevo.com/v3/smtp/email"
//     const requestBody = {
//         sender:{
//             "name":"Utilor Support",
//             "email":"gracesegzy@gmail.com"
//         },
//         to:[
//            {
//                "email":to,
//                "name":name
//            } 
//         ],
//         subject:subject,
//         htmlContent:`<div>
//             <h3>Hi ${name} Welocome to utilor</h3>
//             <h1>${body}</h1>
//             <h4>Use the code below to continue your sign up</h4>
//         </div> `
//     }
//     const headers = {
//           'api-key': process.env.BREVO_KEY as string,
//           'Content-type': 'application/json',
          
//     };
//     console.log(process.env.BREVO_KEY)
//     const res = await fetch(url, {
//           method: 'POST',
//           headers: headers,
//           body: JSON.stringify(requestBody),
//          })
//     const result = await res.json()
//     console.log(result)
//     return result

    
// }

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
        const source = fs.readFileSync("src/templates/index.html","utf-8").toString()
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

