import catchDefaultAsync from "../../utils/catch-async"

export const verifyAdminStatus = catchDefaultAsync(async (req ,res , next)=>{
    //verify admin credentials 
    return next()
})