import { IGetRedirectLink } from "../interfaces/interface"
import request from "./flutterwaveinterceptor"

export const generatePaymentLink = async (data:IGetRedirectLink)=>{
    const body = {
        tx_ref: data.tx_ref,
        amount:`${data.amount}`,
        currency:data.currency,
        redirect_url: "https://utilourapp-z36b.vercel.app/u-vest",
        meta: {
            product:data.product,
            productId:data.productId,
            userId:data
            },
            customer: {
                email:data.user.email,
                phonenumber: "",
                name: `${data.user.firstName} ${data.user.lastName}`
            },
            customizations: {
                title: "Pied Piper Payments",
                logo: "http://www.piedpiper.com/app/themes/joystick-v27/images/logo.png"
        }
        
    }
    try{
        const response = await request.post("/payments",body)
        if(response.data){
            return response.data
        }else{return null}
    }
    catch(err){return null}
   
 
}