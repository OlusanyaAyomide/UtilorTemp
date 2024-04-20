import catchDefaultAsync from "../../utils/catch-async";

//this middlewar verify the hooks is valid and from fluterwave
export const verifyHook = catchDefaultAsync(async(req,res,next)=>{
    
// Verify webhook payload comes from Flutterwave using the secret hash set in the Flutterwave Settings, if not return
    console.log(req.headers);
    if (req.headers['verif-hash'] !== process.env.FLW_HASH) {
        console.log("Hash Didn't match")
        return
    }

    return next()
})