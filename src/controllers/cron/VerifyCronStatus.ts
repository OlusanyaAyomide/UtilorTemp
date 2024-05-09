import catchDefaultAsync from "../../utils/catch-async"

export const verifyCronJobStatus = catchDefaultAsync(async (req ,res , next)=>{
    //verify cron jobs  credentials here
    return next()
})