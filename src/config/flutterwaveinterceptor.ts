import axios,{InternalAxiosRequestConfig,AxiosResponse, AxiosError, AxiosRequestConfig, AxiosInstance} from "axios"


// Intercepting all axios request and adding secret key to headers if it exists
const onRequest=(config:InternalAxiosRequestConfig):InternalAxiosRequestConfig=>{
    const {method,url} = config


    config.headers["Authorization"] = process.env.FLW_SECRET
    
    return config
}
const onResponse = (response:AxiosResponse):AxiosResponse=>{

  return response
}

const onErrorResponse = (error:AxiosError|Error):Promise<AxiosError>=>{
  if (axios.isAxiosError(error)){
    const {status} = error.response as AxiosResponse ?? {}
  }
  return Promise.reject(error)
}


const baseURL ="https://api.flutterwave.com/v3"
const request = axios.create({
  baseURL,

  headers:{
    "Content-Type":"application/json"
  }
})
request.interceptors.request.use(onRequest,onErrorResponse)
request.interceptors.response.use(onResponse,onErrorResponse)


export default request 
