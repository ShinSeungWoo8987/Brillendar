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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const auth_1 = require("../functions/auth");
const redisClient_1 = require("../functions/redisClient");
dotenv_1.default.config();
const router = express_1.default.Router();
// @ts-ignore
router.get(`/verify_email/:emailVerifyToken`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const emailVerifyToken = req.params.emailVerifyToken;
    let message;
    try {
        const { email, uuid } = auth_1.getEmailVerifyToken(emailVerifyToken);
        yield redisClient_1.changeEmailStatus(email, uuid);
        message = '인증에 성공하였습니다.';
    }
    catch (e) {
        message = '인증실패. 회원가입을 다시 시도해주세요.';
    }
    res.send(`<script type="text/javascript">alert("${message}");window.close();</script>`);
}));
exports.default = router;
