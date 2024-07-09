import axios from "axios"

export const mailChipConfig = async({email}:{email:string})=>{
    const mcData = {
        members:[
            {
                email_address:email,status:"subscribed"
            }
        ]
    }

    const audienceList = process.env.AUDIENCE_ID
    const mailChipKey = process.env.MAIL_CHIP_KEY
    const mailChipUrl = `https://us13.api.mailchimp.com/3.0/lists/${audienceList}`
    try{
        const response = await axios.post(mailChipUrl,mcData,{
            headers:{
                Authorization:`Bearer ${mailChipKey}`
            }
        })
       if(response.status === 200){
        return true
       }
       else{
        return false
       }
    }
    catch(err){
        return  false
    }
}