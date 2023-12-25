"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailSender = void 0;
// import axios from "axios";
// const transporter = nodemailer.createTransport({
//     service: "gmail", 
//     host: "smtp.gmail.com",
//     port:587,
//     secure: false,
//     auth:{
//         user:"johnwellaca@gmail.com",
//         pass:process.env.TEST_EMAILKEY
//     }
// })
// try{
//     const mailsender = await transporter.sendMail({
//         from:process.env.TEST_EMAIL,
//         to:[to],
//         subject,
//         html:`<h1>${body}</h1>`
//     })
//     console.log(mailsender.messageId,"mail sent")
// }
// catch(err){
//     console.log(err)
// }
var mailSender = function (_a) {
    var to = _a.to, body = _a.body, subject = _a.subject, name = _a.name;
    return __awaiter(void 0, void 0, void 0, function () {
        var url, requestBody, headers, res, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("mail triggered");
                    url = "https://api.brevo.com/v3/smtp/email";
                    requestBody = {
                        sender: {
                            "name": "Utilor Support",
                            "email": "gracesegzy@gmail.com"
                        },
                        to: [
                            {
                                "email": to,
                                "name": name
                            }
                        ],
                        subject: subject,
                        htmlContent: "<div>\n            <h3>Hi ".concat(name, " Welocome to utilor</h3>\n            <h1>").concat(body, "</h1>\n            <h4>Use the code below to continue your sign up</h4>\n        </div> ")
                    };
                    headers = {
                        'api-key': process.env.BREVO_KEY,
                        'Content-type': 'application/json',
                    };
                    console.log(process.env.BREVO_KEY);
                    return [4 /*yield*/, fetch(url, {
                            method: 'POST',
                            headers: headers,
                            body: JSON.stringify(requestBody),
                        })];
                case 1:
                    res = _b.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    result = _b.sent();
                    console.log(result);
                    return [2 /*return*/, result
                        // const res = await axios.post(url,requestBody,{headers})
                        // console.log(res.status)
                        // console.log(process.env.S_EMAIL_USER,process.env.S_EMAIL_PASS,process.env.S_EMAIL_HOST)
                        // const transporter = nodemailer.createTransport({ 
                        // host: process.env.S_EMAIL_HOST as string,
                        // port:587,
                        // secure: false,
                        // auth:{
                        //     user:process.env.S_EMAIL_USER,
                        //     pass:process.env.S_EMAIL_PASS
                        // },
                        // })
                        // const mailOptions = {
                        //     from: "ayomideflex72@gmail.com",
                        //     to,
                        //     subject,
                        //     html: `<div>
                        //                 <h3>Hi ${name} Welocome to utilor</h3>
                        //                 <br/>
                        //                 <br/>
                        //                 <h1>${body}</h1>
                        //                 <h4>Use the code below to continue your sign up</h4>
                        //             </div> `,
                        // };
                        // try {
                        //     const val =await transporter.sendMail(mailOptions);
                        //     console.log(val.response)
                        //     return;
                        // } catch (error) {
                        //     console.log(error);
                        // }
                    ];
            }
        });
    });
};
exports.mailSender = mailSender;
//S_EMAIL_USER = lekandar11@gmail.com
//S_EMAIL_PASS = VzHcI0JDGx1RTKSq
