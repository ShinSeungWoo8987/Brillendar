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
exports.MemberResolver = void 0;
const type_graphql_1 = require("type-graphql");
const argon2_1 = __importDefault(require("argon2"));
const FieldError_1 = require("./FieldError");
const auth_1 = require("../functions/auth");
const typeorm_1 = require("typeorm");
const Member_1 = require("../entity/Member");
let MemberInput = class MemberInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], MemberInput.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], MemberInput.prototype, "password", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], MemberInput.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], MemberInput.prototype, "phone", void 0);
MemberInput = __decorate([
    type_graphql_1.InputType()
], MemberInput);
let LoginInput = class LoginInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], LoginInput.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], LoginInput.prototype, "password", void 0);
LoginInput = __decorate([
    type_graphql_1.InputType()
], LoginInput);
let MemberResponse = class MemberResponse {
};
__decorate([
    type_graphql_1.Field(() => FieldError_1.FieldError, { nullable: true }),
    __metadata("design:type", FieldError_1.FieldError)
], MemberResponse.prototype, "error", void 0);
__decorate([
    type_graphql_1.Field(() => Member_1.Member, { nullable: true }),
    __metadata("design:type", Member_1.Member)
], MemberResponse.prototype, "member", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], MemberResponse.prototype, "accessToken", void 0);
MemberResponse = __decorate([
    type_graphql_1.ObjectType()
], MemberResponse);
/* ----------------------------------------------------------------------- */
let MemberResolver = class MemberResolver {
    // 로그인
    login({ email, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const member = yield Member_1.Member.findOne({ email });
                // const member = await Member.findOne({ where: { email } });
                if (!member)
                    return { error: { field: 'login', message: 'Invalid' } };
                const valid = yield argon2_1.default.verify(member.password, password);
                if (!valid)
                    return { error: { field: 'login', message: 'Invalid' } };
                // access token
                return { accessToken: auth_1.createAccessToken(member), member };
            }
            catch (err) {
                console.log(err);
                return { error: { field: 'login', message: 'Invalid' } };
            }
        });
    }
    // 토큰으로 로그인사용자 데이터 조회
    getUserDataAndFollow({ req, payload, error }) {
        return __awaiter(this, void 0, void 0, function* () {
            // hasAuth에서 잘못된 토큰인 경우
            if (error)
                return { error };
            try {
                const member = yield Member_1.Member.findOne({ id: payload.id }, {
                    relations: ['followers', 'followers.member', 'followings', 'followings.target'],
                });
                if (!member)
                    return { error: { field: 'refreshToken', message: 'Invalid' } };
                if ((member === null || member === void 0 ? void 0 : member.token_version) !== payload.version)
                    return { error: { field: 'refreshToken', message: 'Token Version Error' } };
                return { member };
            }
            catch (err) {
                console.log(err);
                return { error: { field: 'refreshToken', message: 'Error Occurred' } };
            }
        });
    }
    // 검색
    searchMember(search) {
        return __awaiter(this, void 0, void 0, function* () {
            const member = yield Member_1.Member.find({ username: typeorm_1.Like(`%${search}%`) });
            return member;
        });
    }
    // Schedule Screen에서 데이터 가져오기
    getScheduleScreenData(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const member = yield Member_1.Member.findOne({ where: { id } });
            if (member)
                return { member };
            return { error: { field: 'getScheduleScreenData', message: 'User not found' } };
        });
    }
    // 계정상태 공개/비공개 전환
    changePrivateAccount(isPrivateAccount, { req, payload, error }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (error)
                return false;
            try {
                const member = yield Member_1.Member.update({ id: payload.id }, { private: isPrivateAccount });
                // console.log(member);
                return true;
            }
            catch (err) {
                console.log(err);
                return false;
            }
        });
    }
    // 팔로워 수
    getFollowerCount(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield typeorm_1.getRepository(Member_1.Member)
                    .createQueryBuilder('member')
                    .select('follower_count')
                    .where('member.id = :id', { id })
                    .getRawOne();
                // data.followerCnt가 0인경우에 client에서 apollo가 업데이트를 안함. 왜이러는거야?
                // 클라이언트에서 받아서 -1처리 해준뒤 사용함.
                return Number(data.follower_count) + 1;
            }
            catch (err) {
                return 0;
            }
        });
    }
    updateProfileImg(url, { req, payload, error }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (error)
                return false;
            try {
                const member = yield Member_1.Member.update({ id: payload.id }, { profile_img: url });
                return true;
            }
            catch (err) {
                console.log(err);
                return false;
            }
        });
    }
    // 회원탈퇴
    leaveMember(password, { req, payload, error }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (error)
                false;
            try {
                const id = payload.id;
                const member = yield Member_1.Member.findOne({ id });
                if (!member)
                    return false;
                const valid = yield argon2_1.default.verify(member.password, password);
                if (!valid)
                    return false;
                // delete from member where id === id
                const deleteMember = yield typeorm_1.getRepository(Member_1.Member)
                    .createQueryBuilder('member')
                    .delete()
                    .where('member.id = :id', { id })
                    .execute();
                // console.log(deleteMember.raw);
                // console.log(deleteMember.affected);
                return true;
            }
            catch (err) {
                // console.log(err);
                return false;
            }
        });
    }
};
__decorate([
    type_graphql_1.Mutation(() => MemberResponse),
    __param(0, type_graphql_1.Arg('login')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginInput]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "login", null);
__decorate([
    type_graphql_1.Query(() => MemberResponse),
    type_graphql_1.UseMiddleware(auth_1.hasAuth),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "getUserDataAndFollow", null);
__decorate([
    type_graphql_1.Query(() => [Member_1.Member]),
    __param(0, type_graphql_1.Arg('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "searchMember", null);
__decorate([
    type_graphql_1.Query(() => MemberResponse),
    __param(0, type_graphql_1.Arg('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "getScheduleScreenData", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.UseMiddleware(auth_1.hasAuth),
    __param(0, type_graphql_1.Arg('isPrivateAccount')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean, Object]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "changePrivateAccount", null);
__decorate([
    type_graphql_1.Query(() => Number),
    __param(0, type_graphql_1.Arg('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "getFollowerCount", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.UseMiddleware(auth_1.hasAuth),
    __param(0, type_graphql_1.Arg('url')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "updateProfileImg", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.UseMiddleware(auth_1.hasAuth),
    __param(0, type_graphql_1.Arg('password')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "leaveMember", null);
MemberResolver = __decorate([
    type_graphql_1.Resolver()
], MemberResolver);
exports.MemberResolver = MemberResolver;
