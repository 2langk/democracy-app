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
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require("nodemailer");
const ejs = require("ejs");
class Email {
    constructor(user) {
        this.to = user.email;
        this.name = user.name;
        this.school = user.school;
        this.from = `Democra;SEE-관리자`;
    }
    // eslint-disable-next-line class-methods-use-this
    transporter() {
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_ID,
                pass: process.env.GMAIL_PASSWORD // gmail 계정의 비밀번호를 입력
            }
        });
    }
    sendWelcome() {
        return __awaiter(this, void 0, void 0, function* () {
            const html = yield ejs.renderFile('./email/welcome.ejs', {
                school: this.name
            });
            const mailOptions = {
                from: this.from,
                to: this.to,
                subject: '<Democra; SEE> 회원가입 신청이 승인 되었습니다',
                text: 'Hello',
                html
            };
            yield this.transporter().sendMail(mailOptions);
        });
    }
}
exports.default = Email;
