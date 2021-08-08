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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowResolver = void 0;
const type_graphql_1 = require("type-graphql");
const FieldError_1 = require("./FieldError");
const auth_1 = require("../functions/auth");
const Follow_1 = require("../entity/Follow");
const Member_1 = require("../entity/Member");
let FollowerResponse = class FollowerResponse {
};
__decorate([
    type_graphql_1.Field(() => FieldError_1.FieldError, { nullable: true }),
    __metadata("design:type", FieldError_1.FieldError)
], FollowerResponse.prototype, "error", void 0);
__decorate([
    type_graphql_1.Field(() => [Follow_1.Follow], { nullable: true }),
    __metadata("design:type", Array)
], FollowerResponse.prototype, "request", void 0);
FollowerResponse = __decorate([
    type_graphql_1.ObjectType()
], FollowerResponse);
let FollowerCntResponse = class FollowerCntResponse {
};
__decorate([
    type_graphql_1.Field(() => FieldError_1.FieldError, { nullable: true }),
    __metadata("design:type", FieldError_1.FieldError)
], FollowerCntResponse.prototype, "error", void 0);
__decorate([
    type_graphql_1.Field(() => Number, { nullable: true }),
    __metadata("design:type", Number)
], FollowerCntResponse.prototype, "count", void 0);
FollowerCntResponse = __decorate([
    type_graphql_1.ObjectType()
], FollowerCntResponse);
let FollowResolver = class FollowResolver {
    // 팔로우 요청
    requestFollow(id, { req, payload, error }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (error)
                return -1;
            try {
                const member_id = payload.id;
                const target_id = id;
                const member = yield Member_1.Member.findOne({ id: target_id });
                if (!member)
                    return -1;
                // 상대가 private계정이면, relation: 1
                // 상대가 open계정이면, relation: 2
                const relation = member.private ? 1 : 2;
                const follow = yield Follow_1.Follow.create({ member_id, target_id, relation }).save();
                return relation;
            }
            catch (err) {
                console.log(err);
                return -1;
            }
        });
    }
    // 팔로우 요청 취소
    requestUnFollow(id, { req, payload, error }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (error)
                return false;
            try {
                const member_id = payload.id;
                const target_id = id;
                const follow = yield Follow_1.Follow.delete({ member_id, target_id });
                // console.log(follow);
                return true;
            }
            catch (err) {
                console.log(err);
                return false;
            }
        });
    }
    // 팔로우 승인
    acceptFollow(id, { req, payload, error }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (error)
                return false;
            try {
                const member_id = id;
                const target_id = payload.id;
                const follow = yield Follow_1.Follow.update({ member_id, target_id }, { relation: 2 });
                return true;
            }
            catch (err) {
                console.log(err);
                return false;
            }
        });
    }
    // 팔로우 거절
    rejectFollow(id, { req, payload, error }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (error)
                return false;
            try {
                const member_id = id;
                const target_id = payload.id;
                const follow = yield Follow_1.Follow.update({ member_id, target_id }, { relation: 0 });
                return true;
            }
            catch (err) {
                console.log(err);
                return false;
            }
        });
    }
};
__decorate([
    type_graphql_1.Mutation(() => Number),
    type_graphql_1.UseMiddleware(auth_1.hasAuth),
    __param(0, type_graphql_1.Arg(`id`)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FollowResolver.prototype, "requestFollow", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.UseMiddleware(auth_1.hasAuth),
    __param(0, type_graphql_1.Arg(`id`)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FollowResolver.prototype, "requestUnFollow", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.UseMiddleware(auth_1.hasAuth),
    __param(0, type_graphql_1.Arg(`id`)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FollowResolver.prototype, "acceptFollow", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.UseMiddleware(auth_1.hasAuth),
    __param(0, type_graphql_1.Arg(`id`)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FollowResolver.prototype, "rejectFollow", null);
FollowResolver = __decorate([
    type_graphql_1.Resolver()
], FollowResolver);
exports.FollowResolver = FollowResolver;
/*
  // // SELECT * FROM follow as f LEFT JOIN member as m on f.target_id = m.id where f.target_id = 'bf285af7-c6e6-4d92-b220-2141c82bdf54' and f.relation = 1;

      const followRequest = await getRepository(Follow)
        .createQueryBuilder('f')
        .leftJoin(Member, 'm', 'f.target_id = m.id')
        .select('*')
        .where('f.target_id = :target_id', { target_id: payload!.id })
        .andWhere(`f.relation = 1`)
        .getRawMany();
  */
