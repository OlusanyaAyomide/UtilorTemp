import { IgoogleResponse } from "../interfaces/response-interfaces";
import axios from "axios"

export const getUserCredentials = async ({googleToken}:{googleToken:string})=>{
    try{
        const userData = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${googleToken}`,
            {
               headers: {
                    Authorization: `Bearer ${googleToken}`,
                    Accept: 'application/json'
                } 
            }
            ) 
            if(userData.status === 200){
                return userData.data as IgoogleResponse
            }else{
                console.log(userData)
                return null
        }
        }catch(err){
            return null
        }

}