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
exports.LikeResolver = void 0;
const type_graphql_1 = require("type-graphql");
const FieldError_1 = require("./FieldError");
const auth_1 = require("../functions/auth");
const Like_1 = require("../entity/Like");
let LikeResponse = class LikeResponse {
};
__decorate([
    type_graphql_1.Field(() => FieldError_1.FieldError, { nullable: true }),
    __metadata("design:type", FieldError_1.FieldError)
], LikeResponse.prototype, "error", void 0);
__decorate([
    type_graphql_1.Field(() => [Like_1.Like], { nullable: true }),
    __metadata("design:type", Array)
], LikeResponse.prototype, "likes", void 0);
LikeResponse = __decorate([
    type_graphql_1.ObjectType()
], LikeResponse);
/* ----------------------------------------------------------------------- */
let LikeResolver = class LikeResolver {
    // 스케줄 id로 좋아요한 회원목록 가져오기
    getLikeMembers(schedule_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const likes = yield Like_1.Like.find({
                    join: {
                        alias: 'like',
                        leftJoinAndSelect: {
                            member: 'like.member',
                        },
                    },
                    where: { schedule_id },
                });
                return { likes };
            }
            catch (err) {
                return { error: { field: '', message: '' } };
            }
        });
    }
    getLikeSchedules({ req, payload, error }) {
        return __awaiter(this, void 0, void 0, function* () {
            // 사용자 id로 해당 사용자가 좋아요 누른 게시물 가져오기
            if (error)
                return '';
            // 조인해서 스케줄 가져오기.
            const schedules = yield Like_1.Like.find({
                join: {
                    alias: 'like',
                    leftJoinAndSelect: {
                        schedule: 'like.schedule',
                    },
                },
                where: { member_id: payload.id },
            });
            return 'test2';
        });
    }
    // 좋아요
    likeSchedule(schedule_id, { req, payload, error }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (error)
                return false;
            try {
                const member_id = payload.id;
                yield Like_1.Like.create({ member_id, schedule_id }).save();
                return true;
            }
            catch (err) {
                console.log(err);
                return false;
            }
        });
    }
    // 좋아요 취소
    unLikeSchedule(schedule_id, { req, payload, error }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (error)
                return false;
            try {
                const member_id = payload.id;
                yield Like_1.Like.delete({ member_id, schedule_id });
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
    type_graphql_1.Query(() => LikeResponse),
    __param(0, type_graphql_1.Arg(`schedule_id`)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LikeResolver.prototype, "getLikeMembers", null);
__decorate([
    type_graphql_1.Query(() => String),
    type_graphql_1.UseMiddleware(auth_1.hasAuth),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LikeResolver.prototype, "getLikeSchedules", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.UseMiddleware(auth_1.hasAuth),
    __param(0, type_graphql_1.Arg(`schedule_id`)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LikeResolver.prototype, "likeSchedule", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.UseMiddleware(auth_1.hasAuth),
    __param(0, type_graphql_1.Arg(`schedule_id`)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LikeResolver.prototype, "unLikeSchedule", null);
LikeResolver = __decorate([
    type_graphql_1.Resolver()
], LikeResolver);
exports.LikeResolver = LikeResolver;
