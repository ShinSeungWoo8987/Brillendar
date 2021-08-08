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
exports.ScheduleResolver = void 0;
const type_graphql_1 = require("type-graphql");
const auth_1 = require("../functions/auth");
const FieldError_1 = require("./FieldError");
const uuid_1 = require("uuid");
const Schedule_1 = require("../entity/Schedule");
const Tag_1 = require("../entity/Tag");
const ScheduleDetails_1 = __importStar(require("../mongodb/models/ScheduleDetails"));
const typeorm_1 = require("typeorm");
const Member_1 = require("../entity/Member");
const Follow_1 = require("../entity/Follow");
const Like_1 = require("../entity/Like");
const Comment_1 = __importDefault(require("../mongodb/models/Comment"));
let ScheduleInput = class ScheduleInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], ScheduleInput.prototype, "title", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], ScheduleInput.prototype, "description", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], ScheduleInput.prototype, "start_at", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], ScheduleInput.prototype, "finish_at", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Boolean)
], ScheduleInput.prototype, "open", void 0);
ScheduleInput = __decorate([
    type_graphql_1.InputType()
], ScheduleInput);
let FeedInput = class FeedInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], FeedInput.prototype, "day_start", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], FeedInput.prototype, "day_end", void 0);
FeedInput = __decorate([
    type_graphql_1.InputType()
], FeedInput);
let ScheduleRequest = class ScheduleRequest {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], ScheduleRequest.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], ScheduleRequest.prototype, "month_start", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], ScheduleRequest.prototype, "month_end", void 0);
ScheduleRequest = __decorate([
    type_graphql_1.InputType()
], ScheduleRequest);
let ScheduleAndIsLike = class ScheduleAndIsLike extends Schedule_1.Schedule {
};
__decorate([
    type_graphql_1.Field(() => Boolean),
    __metadata("design:type", Boolean)
], ScheduleAndIsLike.prototype, "isLike", void 0);
ScheduleAndIsLike = __decorate([
    type_graphql_1.ObjectType()
], ScheduleAndIsLike);
//  ScheduleAndIsLike & ScheduleDetailsResponse
let CombinedSchedule = class CombinedSchedule extends ScheduleAndIsLike {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], CombinedSchedule.prototype, "title", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], CombinedSchedule.prototype, "description", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], CombinedSchedule.prototype, "comment_count", void 0);
__decorate([
    type_graphql_1.Field(() => [ScheduleDetails_1.ScheduleImg]),
    __metadata("design:type", Array)
], CombinedSchedule.prototype, "result_img", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], CombinedSchedule.prototype, "result_description", void 0);
CombinedSchedule = __decorate([
    type_graphql_1.ObjectType()
], CombinedSchedule);
let FeedMember = class FeedMember {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], FeedMember.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], FeedMember.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], FeedMember.prototype, "profile_img", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], FeedMember.prototype, "follower_count", void 0);
FeedMember = __decorate([
    type_graphql_1.ObjectType()
], FeedMember);
let ScheduleResponse = class ScheduleResponse {
};
__decorate([
    type_graphql_1.Field(() => FieldError_1.FieldError, { nullable: true }),
    __metadata("design:type", FieldError_1.FieldError)
], ScheduleResponse.prototype, "error", void 0);
__decorate([
    type_graphql_1.Field(() => Schedule_1.Schedule, { nullable: true }),
    __metadata("design:type", Schedule_1.Schedule)
], ScheduleResponse.prototype, "Schedule", void 0);
__decorate([
    type_graphql_1.Field(() => [CombinedSchedule], { nullable: true }),
    __metadata("design:type", Array)
], ScheduleResponse.prototype, "Schedules", void 0);
__decorate([
    type_graphql_1.Field(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], ScheduleResponse.prototype, "readable", void 0);
ScheduleResponse = __decorate([
    type_graphql_1.ObjectType()
], ScheduleResponse);
let Feed = class Feed {
};
__decorate([
    type_graphql_1.Field(() => FeedMember),
    __metadata("design:type", FeedMember)
], Feed.prototype, "member", void 0);
__decorate([
    type_graphql_1.Field(() => [CombinedSchedule]),
    __metadata("design:type", Array)
], Feed.prototype, "schedules", void 0);
Feed = __decorate([
    type_graphql_1.ObjectType()
], Feed);
let FeedResponse = class FeedResponse {
};
__decorate([
    type_graphql_1.Field(() => FieldError_1.FieldError, { nullable: true }),
    __metadata("design:type", FieldError_1.FieldError)
], FeedResponse.prototype, "error", void 0);
__decorate([
    type_graphql_1.Field(() => [Feed], { nullable: true }),
    __metadata("design:type", Array)
], FeedResponse.prototype, "feed", void 0);
FeedResponse = __decorate([
    type_graphql_1.ObjectType()
], FeedResponse);
// ////////////////////////////
let ScheduleResolver = class ScheduleResolver {
    createSchedule({ req, payload, error }, { open, title, description, start_at, finish_at }, tags) {
        return __awaiter(this, void 0, void 0, function* () {
            const start = new Date(start_at);
            const finish = new Date(finish_at);
            if (error)
                return { error };
            try {
                // 몽고db에 넣기 이후 uid받아오기
                const scheduleDetails = yield ScheduleDetails_1.default.create({ title, description });
                const mongo_id = String(scheduleDetails._id);
                const schedule_id = uuid_1.v4();
                const newSchedule = yield Schedule_1.Schedule.create({
                    id: schedule_id,
                    open,
                    writer_id: payload.id,
                    start_at: start,
                    finish_at: finish,
                    mongo_id,
                }).save();
                const newTags = tags.map((tagStr, idx) => {
                    const tag = new Tag_1.Tag();
                    tag.schedule_id = schedule_id;
                    tag.tag = tagStr;
                    tag.idx = idx;
                    return tag;
                });
                yield Tag_1.Tag.save(newTags);
                return { Schedule: newSchedule };
            }
            catch (err) {
                return { error: { field: 'createSchedule', message: 'Cannot create schedule' } };
            }
        });
    }
    // 한달치 스케줄 가져오기
    readMonthSchedule({ req, payload, error }, { id, month_start, month_end }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (error)
                return { error };
            try {
                const request_id = payload.id;
                const target_id = id;
                if (request_id !== target_id) {
                    // 나와의 관계 조회
                    const follow = yield Follow_1.Follow.findOne({ member_id: request_id, target_id, relation: 2 });
                    if (!follow) {
                        // 팔로잉중이 아니므로 해당 계정이 private인지 조회
                        const target = yield Member_1.Member.findOne({ id: target_id });
                        if (!target) {
                            // 조회가 안되면 에러
                            return { error: { field: '', message: '' } };
                        }
                        if (target && target.private) {
                            // 조회가 되었지만, 프라이빗 계정이면 조회 불가능.
                            return { readable: false };
                        }
                    }
                }
                // 여기까지 걸리는게 없으면 스케줄 조회 가능
                const rawSchedules = yield typeorm_1.getRepository(Schedule_1.Schedule)
                    .createQueryBuilder('s')
                    .leftJoin(Tag_1.Tag, 't', 's.id = t.schedule_id')
                    // .leftJoin(Like, 'l', 's.id = l.schedule_id')
                    .leftJoinAndMapMany('s.likes', (qb) => {
                    return qb.select('*').from(Like_1.Like, 'like').where('like.member_id = :request_id', { request_id });
                }, 'l', 's.id = l.schedule_id')
                    .select('*')
                    .where('s.writer_id = :target_id', { target_id })
                    .andWhere(request_id !== target_id ? 's.open = true' : 'true')
                    .andWhere('UNIX_TIMESTAMP(start_at) >= :start', { start: month_start / 1000 })
                    .andWhere('UNIX_TIMESTAMP(start_at) < :finish', { finish: month_end / 1000 })
                    .orderBy('s.start_at', 'ASC')
                    .addOrderBy('t.idx', 'ASC')
                    .getRawMany();
                // 그룹화으로 묶고, 좋아요 눌렀는지 아닌지 true/false로 나누기.
                let temp_ids = rawSchedules.map((t) => t.id);
                // 중복제거
                const schedule_ids = [...new Set(temp_ids)];
                let schedules = [];
                schedule_ids.forEach((selectedId) => {
                    const selectedSchedules = rawSchedules.filter((t) => t.id === selectedId);
                    let tags = [];
                    selectedSchedules.forEach((s) => {
                        if (s.idx !== null && s.tag !== null)
                            tags.push({ idx: s.idx, tag: s.tag });
                    });
                    // 같은 코드
                    // const tempTags: Tag[] = selectedSchedules.map((s) => ({ idx: s.idx, tag: s.tag } as Tag));
                    // const tags = tempTags.filter((t) => t.idx !== null && t.tag !== null);
                    const { id, writer_id, mongo_id, open, start_at, finish_at, like_count, schedule_id, member_id } = selectedSchedules[0];
                    let isLike = schedule_id && member_id ? true : false;
                    const temp = {
                        id,
                        writer_id,
                        mongo_id,
                        open,
                        start_at,
                        finish_at,
                        like_count,
                        isLike,
                        tags,
                    };
                    schedules.push(temp);
                });
                //////////////////////
                const mongo_ids = schedules.map((schedule) => schedule.mongo_id);
                const scheduleDetails = yield ScheduleDetails_1.default.find({ _id: { $in: mongo_ids } }).exec();
                const temp = schedules.map((schedule) => {
                    const find = scheduleDetails.filter((sd) => String(sd._id) === schedule.mongo_id)[0];
                    const { title, description, comment_count, result_description, result_img } = find;
                    if (find) {
                        return Object.assign(Object.assign({}, schedule), { title,
                            description,
                            comment_count, result_description: result_description ? result_description : '', result_img });
                    }
                    else {
                        return null;
                    }
                });
                const final = temp.filter((t) => t !== null);
                return { readable: true, Schedules: final };
            }
            catch (err) {
                console.log(err);
                return { error: { field: '', message: '' } };
            }
        });
    }
    // 결과 삭제
    deleteScheduleResult({ req, payload, error }, mongo_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const writer = yield Schedule_1.Schedule.findOne({ mongo_id, writer_id: payload.id });
            if (!writer)
                return false;
            yield ScheduleDetails_1.default.findOneAndUpdate({ _id: mongo_id }, { result_description: '', result_img: [] }).exec();
            return true;
        });
    }
    // 스케줄 삭제
    deleteSchedule({ req, payload, error }, mongo_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const writer = yield Schedule_1.Schedule.delete({ mongo_id, writer_id: payload.id });
                if (writer.affected !== 0) {
                    const scheduleDetails = yield ScheduleDetails_1.default.deleteOne({ _id: mongo_id });
                    if (scheduleDetails.ok !== 1)
                        throw new Error();
                    const comments = yield Comment_1.default.deleteMany({ schedule_mongo_id: mongo_id });
                    if (comments.ok !== 1)
                        throw new Error();
                }
                else {
                    return false;
                }
                return true;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    // 피드 받아오기
    readFeedSchedule({ req, payload, error }, { day_start, day_end }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (error)
                return { error };
            try {
                const member_id = payload.id;
                const rawFeed = yield typeorm_1.getRepository(Follow_1.Follow)
                    .createQueryBuilder('f')
                    .leftJoin(Member_1.Member, 'm', 'f.target_id = m.id')
                    .leftJoin(Schedule_1.Schedule, 's', 'f.target_id = s.writer_id')
                    .leftJoin(Tag_1.Tag, 't', 's.id = t.schedule_id')
                    // .leftJoin(Like, 'l', 's.id = l.schedule_id')
                    .leftJoinAndMapMany('s.likes', (qb) => {
                    return qb.select('*').from(Like_1.Like, 'like').where('like.member_id = :member_id', { member_id });
                }, 'l', 's.id = l.schedule_id')
                    // .select('*')
                    .select(`
          s.id,s.writer_id,s.mongo_id,s.open,s.like_count,s.start_at,s.finish_at,
          t.tag,t.idx,
          l.member_id,l.schedule_id,
          m.username,m.profile_img,m.follower_count
          `
                // m.id는 s.writer_id와 같아서 생략함.
                // [
                //   's.id',
                //   's.writer_id',
                //   's.mongo_id',
                //   's.open',
                //   's.like_count',
                //   's.start_at',
                //   's.finish_at',
                //   't.tag',
                //   't.idx',
                //   'l.member_id',
                //   'l.schedule_id',
                //   'm.id',
                //   'm.username',
                //   'm.profile_img',
                //   'm.follower_count',
                // ]
                )
                    .where('f.member_id = :member_id', { member_id })
                    .andWhere('s.open = true')
                    .andWhere('f.relation = 2')
                    .andWhere('UNIX_TIMESTAMP(start_at) >= :start', { start: day_start / 1000 })
                    .andWhere('UNIX_TIMESTAMP(start_at) < :finish', { finish: day_end / 1000 })
                    .orderBy('s.start_at', 'ASC')
                    .addOrderBy('t.idx', 'ASC')
                    .getRawMany();
                //   .innerJoinAndMapMany(
                //     'm.schedules',
                //     (qb) => {
                //       return qb
                //         .select('*')
                //         .from(Schedule, 's')
                //         .where('UNIX_TIMESTAMP(s.start_at) >= :start', { start: day_start / 1000 })
                //         .andWhere('UNIX_TIMESTAMP(s.start_at) < :finish', { finish: day_end / 1000 });
                //     },
                //     's',
                //     'f.target_id = s.writer_id'
                //   )
                // /////////////////////////////////////////////////////////////////////////
                // 스케줄 id별로 묶고, 좋아요 눌렀는지 아닌지 true/false로 나누기.
                let temp_ids = rawFeed.map((t) => t.id);
                // 중복제거
                const schedule_ids = [...new Set(temp_ids)];
                let schedules = [];
                schedule_ids.forEach((selectedId) => {
                    const selectedSchedules = rawFeed.filter((t) => t.id === selectedId);
                    let tags = [];
                    selectedSchedules.forEach((s) => {
                        if (s.idx !== null && s.tag !== null)
                            tags.push({ idx: s.idx, tag: s.tag });
                    });
                    const { id, writer_id, mongo_id, open, like_count, start_at, finish_at, member_id, schedule_id, username, profile_img, follower_count, } = selectedSchedules[0];
                    let isLike = schedule_id && member_id ? true : false;
                    const tempSchedule = {
                        id,
                        mongo_id,
                        open,
                        like_count,
                        start_at,
                        finish_at,
                        writer_id,
                        username,
                        profile_img,
                        follower_count,
                        tags,
                        isLike,
                    };
                    schedules.push(tempSchedule);
                });
                // /////////////////////////////////////////////////////////////////////////
                const mongo_ids = schedules.map((schedule) => schedule.mongo_id);
                const scheduleDetails = yield ScheduleDetails_1.default.find({ _id: { $in: mongo_ids } }).exec();
                const temp = schedules.map((schedule) => {
                    const find = scheduleDetails.filter((sd) => String(sd._id) === schedule.mongo_id)[0];
                    const { title, description, comment_count, result_description, result_img } = find;
                    if (find) {
                        return Object.assign(Object.assign({}, schedule), { title,
                            description,
                            comment_count, result_description: result_description ? result_description : '', result_img });
                    }
                    else {
                        return null;
                    }
                });
                const schedulesGroupByScheduleId = temp.filter((t) => t !== null);
                // /////////////////////////
                const temp_writer_ids = schedulesGroupByScheduleId.map((data) => data.writer_id);
                // 중복제거
                const writer_ids = [...new Set(temp_writer_ids)];
                let finalFeed = writer_ids.map((writerId) => {
                    const filteredSchedules = schedulesGroupByScheduleId.filter((data) => data.writer_id === writerId);
                    const schedules = filteredSchedules.map(({ id, mongo_id, open, like_count, start_at, finish_at, tags, isLike, title, description, comment_count, result_img, result_description, writer_id, }) => ({
                        id,
                        mongo_id,
                        open,
                        like_count,
                        start_at,
                        finish_at,
                        tags,
                        isLike,
                        title,
                        description,
                        comment_count,
                        result_img,
                        result_description,
                        writer_id,
                    }));
                    const member = {
                        id: filteredSchedules[0].writer_id,
                        username: filteredSchedules[0].username,
                        profile_img: filteredSchedules[0].profile_img,
                        follower_count: filteredSchedules[0].follower_count,
                    };
                    return { member, schedules };
                });
                return { feed: finalFeed };
            }
            catch (err) {
                console.log(err);
                return { error: { field: '', message: '' } };
            }
        });
    }
};
__decorate([
    type_graphql_1.Mutation(() => ScheduleResponse),
    type_graphql_1.UseMiddleware(auth_1.hasAuth),
    __param(0, type_graphql_1.Ctx()),
    __param(1, type_graphql_1.Arg('schedule')),
    __param(2, type_graphql_1.Arg('tags', () => [String])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ScheduleInput, Array]),
    __metadata("design:returntype", Promise)
], ScheduleResolver.prototype, "createSchedule", null);
__decorate([
    type_graphql_1.Query(() => ScheduleResponse),
    type_graphql_1.UseMiddleware(auth_1.hasAuth),
    __param(0, type_graphql_1.Ctx()),
    __param(1, type_graphql_1.Arg('scheduleRequest')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ScheduleRequest]),
    __metadata("design:returntype", Promise)
], ScheduleResolver.prototype, "readMonthSchedule", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.UseMiddleware(auth_1.hasAuth),
    __param(0, type_graphql_1.Ctx()),
    __param(1, type_graphql_1.Arg('mongo_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ScheduleResolver.prototype, "deleteScheduleResult", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.UseMiddleware(auth_1.hasAuth),
    __param(0, type_graphql_1.Ctx()),
    __param(1, type_graphql_1.Arg('mongo_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ScheduleResolver.prototype, "deleteSchedule", null);
__decorate([
    type_graphql_1.Query(() => FeedResponse),
    type_graphql_1.UseMiddleware(auth_1.hasAuth),
    __param(0, type_graphql_1.Ctx()),
    __param(1, type_graphql_1.Arg('feedInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, FeedInput]),
    __metadata("design:returntype", Promise)
], ScheduleResolver.prototype, "readFeedSchedule", null);
ScheduleResolver = __decorate([
    type_graphql_1.Resolver()
], ScheduleResolver);
exports.ScheduleResolver = ScheduleResolver;
