import catchDefaultAsync from "../../utils/catch-async";

//this middlewar verify the hooks is valid and from fluterwave
export const verifyHook = catchDefaultAsync(async(req,res,next)=>{
    console.log(req.headers)
    return next()
})