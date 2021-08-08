"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.CommentResolver = void 0;
const type_graphql_1 = require("type-graphql");
const FieldError_1 = require("./FieldError");
const auth_1 = require("../functions/auth");
const Member_1 = require("../entity/Member");
const Comment_1 = __importStar(require("../mongodb/models/Comment"));
const ScheduleDetails_1 = __importDefault(require("../mongodb/models/ScheduleDetails"));
let CommentRes = class CommentRes extends Comment_1.CommentResponse {
};
__decorate([
    type_graphql_1.Field(() => Member_1.Member),
    __metadata("design:type", Member_1.Member)
], CommentRes.prototype, "member", void 0);
CommentRes = __decorate([
    type_graphql_1.ObjectType()
], CommentRes);
let CommentResponseType = class CommentResponseType {
};
__decorate([
    type_graphql_1.Field(() => FieldError_1.FieldError, { nullable: true }),
    __metadata("design:type", FieldError_1.FieldError)
], CommentResponseType.prototype, "error", void 0);
__decorate([
    type_graphql_1.Field(() => Comment_1.CommentResponse, { nullable: true }),
    __metadata("design:type", Comment_1.CommentResponse)
], CommentResponseType.prototype, "comment", void 0);
__decorate([
    type_graphql_1.Field(() => [CommentRes], { nullable: true }),
    __metadata("design:type", Array)
], CommentResponseType.prototype, "comments", void 0);
CommentResponseType = __decorate([
    type_graphql_1.ObjectType()
], CommentResponseType);
let CommentResolver = class CommentResolver {
    createComment(mongo_id, description, { req, payload, error }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (error)
                return { error: { field: '', message: '' } };
            try {
                const comment = yield Comment_1.default.create({
                    schedule_mongo_id: mongo_id,
                    writer_id: payload.id,
                    description,
                    created_at: Number(new Date()),
                });
                // comment_count + 1 해줘야함.
                const check = yield ScheduleDetails_1.default.findOneAndUpdate({ _id: mongo_id }, { $inc: { comment_count: 1 } }).exec();
                // console.log(check);
                return { comment };
            }
            catch (err) {
                console.log(err);
                return { error: { field: '', message: '' } };
            }
        });
    }
    readComment(mongo_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const comments = yield Comment_1.default.find({ schedule_mongo_id: mongo_id }).sort('created_at').exec();
            const member_ids = comments.map((c) => ({ id: c.writer_id }));
            const members = yield Member_1.Member.find({ where: member_ids });
            const temp = comments.map((comment) => {
                const { _id, schedule_mongo_id, writer_id, description, created_at } = comment;
                const member = members.filter((m) => m.id === comment.writer_id);
                if (member.length === 0)
                    return null;
                return { _id, schedule_mongo_id, writer_id, description, created_at, member: member[0] };
            });
            const final = temp.filter((t) => t !== null);
            return { comments: final };
        });
    }
};
__decorate([
    type_graphql_1.Mutation(() => CommentResponseType),
    type_graphql_1.UseMiddleware(auth_1.hasAuth),
    __param(0, type_graphql_1.Arg(`mongo_id`)),
    __param(1, type_graphql_1.Arg(`description`)),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], CommentResolver.prototype, "createComment", null);
__decorate([
    type_graphql_1.Query(() => CommentResponseType),
    __param(0, type_graphql_1.Arg(`mongo_id`)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CommentResolver.prototype, "readComment", null);
CommentResolver = __decorate([
    type_graphql_1.Resolver()
], CommentResolver);
exports.CommentResolver = CommentResolver;
