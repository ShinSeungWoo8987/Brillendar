"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmailVerifyToken = exports.createEmailVerifyToken = exports.randomVersion = exports.logout = exports.sendRefreshToken = exports.createAccessToken = exports.hasAuth = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const redisClient_1 = require("./redisClient");
// 미들웨어로 쓰일 function
const hasAuth = ({ context }, next) => {
    const authorization = context.req.headers['authorization'];
    if (!authorization)
        throw new Error('Invalid');
    try {
        const token = authorization === null || authorization === void 0 ? void 0 : authorization.split(' ')[1];
        const payload = jsonwebtoken_1.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // 토큰 정보를 담아서 전달
        context.payload = payload;
    }
    catch (error) {
        // throw new Error('Expired');
        context.error = { field: 'hasAuth', message: 'Invalid token' };
    }
    return next();
};
exports.hasAuth = hasAuth;
const createAccessToken = (member) => jsonwebtoken_1.sign({ id: member.id, username: member.username, version: member.token_version }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '3d',
});
exports.createAccessToken = createAccessToken;
const sendRefreshToken = (res, token) => {
    res.cookie('jid', token, {
        httpOnly: true,
    });
};
exports.sendRefreshToken = sendRefreshToken;
const logout = (res) => {
    res.cookie('jid', '', {
        httpOnly: true,
        expires: new Date('1970.01.01'),
    });
};
exports.logout = logout;
const randomVersion = () => Math.floor(Math.random() * 1000);
exports.randomVersion = randomVersion;
////////////////////////////////////////////////////////////////////////
const createEmailVerifyToken = (payload) => jsonwebtoken_1.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: redisClient_1.EMAIL_EXPIRATION,
});
exports.createEmailVerifyToken = createEmailVerifyToken;
const getEmailVerifyToken = (token) => jsonwebtoken_1.verify(token, process.env.ACCESS_TOKEN_SECRET);
exports.getEmailVerifyToken = getEmailVerifyToken;
