import nodemailer from "nodemailer"
// import axios from "axios";


// const transporter = nodemailer.createTransport({
//     service: "gmail", 
//     host: "smtp.gmail.com",
//     port:587,
//     secure: false,
//     auth:{
//         user:"johnwellaca@gmail.com",
//         pass:process.env.TEST_EMAILKEY
//     }
// })
    // try{
    //     const mailsender = await transporter.sendMail({
    //         from:process.env.TEST_EMAIL,
    //         to:[to],
    //         subject,
    //         html:`<h1>${body}</h1>`
    //     })
    //     console.log(mailsender.messageId,"mail sent")
    // }
    // catch(err){
    //     console.log(err)
    // }
export const mailSender = async ({to,body,subject,name}:{to:string,body:string,subject:string,name:string})=>{
    console.log("mail triggered")
    const url = "https://api.brevo.com/v3/smtp/email"
    const requestBody = {
        sender:{
            "name":"Utilor Support",
            "email":"gracesegzy@gmail.com"
        },
        to:[
           {
               "email":to,
               "name":name
           } 
        ],
        subject:subject,
        htmlContent:`<div>
            <h3>Hi ${name} Welocome to utilor</h3>
            <h1>${body}</h1>
            <h4>Use the code below to continue your sign up</h4>
        </div> `
    }
    const headers = {
          'api-key': process.env.BREVO_KEY as string,
          'Content-type': 'application/json',
          
    };
    console.log(process.env.BREVO_KEY)
    const res = await fetch(url, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(requestBody),
         })
    const result = await res.json()
    console.log(result)
    return result

    // const res = await axios.post(url,requestBody,{headers})
    // console.log(res.status)
    // console.log(process.env.S_EMAIL_USER,process.env.S_EMAIL_PASS,process.env.S_EMAIL_HOST)
    // const transporter = nodemailer.createTransport({ 
    // host: process.env.S_EMAIL_HOST as string,
    // port:587,
    // secure: false,
    // auth:{
    //     user:process.env.S_EMAIL_USER,
    //     pass:process.env.S_EMAIL_PASS
    // },

    // })

    // const mailOptions = {
    //     from: "ayomideflex72@gmail.com",
    //     to,
    //     subject,
    //     html: `<div>
    //                 <h3>Hi ${name} Welocome to utilor</h3>
    //                 <br/>
    //                 <br/>
    //                 <h1>${body}</h1>
    //                 <h4>Use the code below to continue your sign up</h4>
    //             </div> `,
    // };

    // try {
    //     const val =await transporter.sendMail(mailOptions);
    //     console.log(val.response)
    //     return;
    // } catch (error) {
    //     console.log(error);
    // }

    
}

//S_EMAIL_USER = lekandar11@gmail.com
//S_EMAIL_PASS = VzHcI0JDGx1RTKSq
