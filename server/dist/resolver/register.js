"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.RegisterResolver = void 0;
const type_graphql_1 = require("type-graphql");
const argon2_1 = __importDefault(require("argon2"));
const uuid_1 = require("uuid");
const joi_1 = __importDefault(require("@hapi/joi"));
const FieldError_1 = require("./FieldError");
const request_ip_1 = __importDefault(require("request-ip"));
const auth_1 = require("../functions/auth");
const Member_1 = require("../entity/Member");
const redisClient_1 = require("../functions/redisClient");
const nodemailer_1 = __importDefault(require("../functions/nodemailer"));
const ncpSMS_1 = require("../functions/ncpSMS");
let RegisterInput = class RegisterInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], RegisterInput.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], RegisterInput.prototype, "password", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], RegisterInput.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], RegisterInput.prototype, "phone", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], RegisterInput.prototype, "code", void 0);
RegisterInput = __decorate([
    type_graphql_1.InputType()
], RegisterInput);
let RegisterResponse = class RegisterResponse {
};
__decorate([
    type_graphql_1.Field(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], RegisterResponse.prototype, "ok", void 0);
__decorate([
    type_graphql_1.Field(() => FieldError_1.FieldError, { nullable: true }),
    __metadata("design:type", FieldError_1.FieldError)
], RegisterResponse.prototype, "error", void 0);
RegisterResponse = __decorate([
    type_graphql_1.ObjectType()
], RegisterResponse);
/* ----------------------------------------------------------------------- */
let RegisterResolver = class RegisterResolver {
    emailValidation(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const member = yield Member_1.Member.find({ email });
            if (member.length !== 0)
                return { ok: false, error: { field: 'Send Email', message: 'Email already exist.' } };
            // 이메일 검증
            const emailSchema = joi_1.default.string().email({ minDomainSegments: 2 });
            const checkEmail = emailSchema.validate(email);
            if (checkEmail.error || checkEmail.errors) {
                return { ok: false, error: { field: 'Send Email', message: 'Invalid email.' } };
            }
            else {
                try {
                    const uuid = uuid_1.v4();
                    yield redisClient_1.setNewEmailStatus(email, uuid);
                    yield nodemailer_1.default(email, uuid);
                    return { ok: true };
                }
                catch (err) {
                    console.error(err);
                    yield redisClient_1.deleteEmail(email);
                    return { ok: false, error: { field: 'Send Email', message: 'Cannot send email.' } };
                }
            }
        });
    }
    verifyEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (email) {
                try {
                    yield redisClient_1.checkVerifiedEmail(email);
                    return { ok: true };
                }
                catch (err) {
                    return { error: { field: 'Verify', message: 'unConfirmed email.' }, ok: false };
                }
            }
            else {
                return { error: { field: 'Verify', message: 'Invalid email.' }, ok: false };
            }
        });
    }
    ////////////////////////////////////
    phoneValidation(phone, { req, payload, error }) {
        return __awaiter(this, void 0, void 0, function* () {
            const member = yield Member_1.Member.find({ phone });
            if (member.length !== 0)
                return { ok: false, error: { field: 'Send message', message: 'Phone already exist.' } };
            const ip = request_ip_1.default.getClientIp(req);
            const sendResponse = ({ statudCode, errMessage }) => {
                if (statudCode === '202')
                    return { ok: true };
                else
                    return { ok: false, error: { field: `Send message ${statudCode}`, message: errMessage } };
            };
            if (ip && phone && phone.length === 11) {
                const phoneStatus = yield redisClient_1.setOrChangePhoneValidationStatus(ip);
                // 0: 메세지 보내기, 1: 시도 횟수 초과
                if (phoneStatus === 1) {
                    return { error: { field: 'Send message 429', message: 'Too Many Requests.' }, ok: false };
                }
                else {
                    const message = yield ncpSMS_1.sendMessage(phone);
                    return sendResponse(message);
                }
            }
            else {
                return { error: { field: 'Phone number', message: 'Invalid phone number.' }, ok: false };
            }
        });
    }
    ////////////////////////////////////
    verifyPhone(phone, code) {
        return __awaiter(this, void 0, void 0, function* () {
            if (code && phone) {
                try {
                    return yield redisClient_1.verifyPhoneCode(phone, code);
                }
                catch (err) {
                    return { error: { field: 'Verify', message: 'Server error' }, ok: false };
                }
            }
            else {
                return { error: { field: 'Verify', message: 'Invalid verify code.' }, ok: false };
            }
        });
    }
    // username 중복체크
    availableUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const member = yield Member_1.Member.find({ username });
            if (member.length !== 0)
                return { ok: false, error: { field: 'username', message: 'already exist.' } };
            else
                return { ok: true };
        });
    }
    // 회원가입
    createMember({ email, password, username, phone, code }) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(email, password, username, phone, code);
            const pattern = /[^a-z0-9_]/g;
            if (pattern.test(username))
                return { ok: false, error: { field: 'username', message: 'Wrong regular expression.' } };
            // 이메일 검증
            const emailSchema = joi_1.default.string().email({ minDomainSegments: 2 });
            const checkEmail = emailSchema.validate(email);
            if (checkEmail.error || checkEmail.errors)
                return { ok: false, error: { field: 'email', message: 'Invalid email.' } };
            if (email.length < 6)
                return { ok: false, error: { field: 'email', message: 'length' } };
            if (phone.length !== 11)
                return { ok: false, error: { field: 'phone', message: 'length' } };
            if (password.length < 8)
                return { ok: false, error: { field: 'password', message: 'length' } };
            const hashedPassword = yield argon2_1.default.hash(password);
            ////////////////////////////////////
            try {
                // 인증된 메일인지 확인
                yield redisClient_1.checkVerifiedEmail(email);
                // 폰이랑 인증번호 다시 확인
                const { ok } = yield redisClient_1.verifyPhoneCode(phone, code);
                // 비밀번호 형식 체크 추가하기
                if (ok === true) {
                    // db insert
                    try {
                        const member = new Member_1.Member();
                        member.email = email;
                        member.password = hashedPassword;
                        member.username = username;
                        member.phone = phone;
                        member.token_version = auth_1.randomVersion();
                        yield Member_1.Member.save(member);
                    }
                    catch (err) {
                        // 에러코드 찍어보면, 뭐가 중복된건지 더 정확히 알 수 있음.
                        // console.log(err.code, err.errno, err.sqlMessage, err.sqlState);
                        return { ok: false, error: { field: 'Register', message: 'already exist' } };
                    }
                    // redis에서 삭제하기
                    yield redisClient_1.deleteEmail(email);
                    yield redisClient_1.deletePhone(phone);
                    return { ok: true };
                }
                else {
                    return { error: { field: 'Server', message: 'Cannot insert Database.' }, ok: false };
                }
            }
            catch (err) {
                // console.log(err);
                return { error: { field: 'Verify', message: 'Unconfirmed phone or email.' }, ok: false };
            }
        });
    }
};
__decorate([
    type_graphql_1.Mutation(() => RegisterResponse),
    __param(0, type_graphql_1.Arg('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RegisterResolver.prototype, "emailValidation", null);
__decorate([
    type_graphql_1.Mutation(() => RegisterResponse),
    __param(0, type_graphql_1.Arg('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RegisterResolver.prototype, "verifyEmail", null);
__decorate([
    type_graphql_1.Mutation(() => RegisterResponse),
    __param(0, type_graphql_1.Arg('phone')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RegisterResolver.prototype, "phoneValidation", null);
__decorate([
    type_graphql_1.Mutation(() => RegisterResponse),
    __param(0, type_graphql_1.Arg('phone')),
    __param(1, type_graphql_1.Arg('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RegisterResolver.prototype, "verifyPhone", null);
__decorate([
    type_graphql_1.Query(() => RegisterResponse),
    __param(0, type_graphql_1.Arg('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RegisterResolver.prototype, "availableUsername", null);
__decorate([
    type_graphql_1.Mutation(() => RegisterResponse),
    __param(0, type_graphql_1.Arg('register')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterInput]),
    __metadata("design:returntype", Promise)
], RegisterResolver.prototype, "createMember", null);
RegisterResolver = __decorate([
    type_graphql_1.Resolver()
], RegisterResolver);
exports.RegisterResolver = RegisterResolver;
