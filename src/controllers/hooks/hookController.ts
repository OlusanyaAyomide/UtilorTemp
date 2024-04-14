import catchDefaultAsync from "../../utils/catch-async";
import ResponseHandler from "../../utils/response-handler";

export const  createNewSaving=catchDefaultAsync(async(req,res,next)=>{
    console.log(req.body)
    
    return ResponseHandler.sendSuccessResponse({res})
})