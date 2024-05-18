import { Request } from "express"
import DeviceDetector from "node-device-detector";
import crypto from "crypto"

export const generateDeviceId = (req:Request)=> {
    const userAgent =  req.header("user-agent") || req.headers["user-agent"] || ""
    //gets device objects
    const detector = new DeviceDetector({
        clientIndexes: true,
        deviceIndexes: true,
        deviceAliasCode: false,
        deviceTrusted: false,
        deviceInfo: false,
        maxUserAgentSize: 500,
      });
    const device = detector.detect(userAgent)
      
    console.log(device)
    //device object is used to generate a crypto Id
    const deviceString = JSON.stringify(device)
    const hash = crypto.createHash('sha256').update(deviceString).digest("hex")
    console.log(hash)
    return hash
    
}
