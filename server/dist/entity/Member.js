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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Member = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Follow_1 = require("./Follow");
const Schedule_1 = require("./Schedule");
let Member = class Member extends typeorm_1.BaseEntity {
};
__decorate([
    type_graphql_1.Field(),
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Member.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field({ defaultValue: false }),
    typeorm_1.Column('boolean', { default: false }),
    __metadata("design:type", Boolean)
], Member.prototype, "private", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], Member.prototype, "email", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Member.prototype, "password", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], Member.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], Member.prototype, "phone", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Member.prototype, "profile_img", void 0);
__decorate([
    typeorm_1.Column('int', { default: 0 }),
    __metadata("design:type", Number)
], Member.prototype, "token_version", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column('int', { default: 0 }),
    __metadata("design:type", Number)
], Member.prototype, "follower_count", void 0);
__decorate([
    type_graphql_1.Field(() => [Schedule_1.Schedule])
    // 팔로잉 : 내가 남을 => 남을 구해야함. 남 = member_id
    ,
    typeorm_1.OneToMany(() => Schedule_1.Schedule, (schedule) => schedule.writer, { cascade: true }),
    __metadata("design:type", Array)
], Member.prototype, "schedules", void 0);
__decorate([
    type_graphql_1.Field(() => [Follow_1.Follow])
    // 팔로잉 : 내가 남을 => 남을 구해야함. 남 = member_id
    ,
    typeorm_1.OneToMany(() => Follow_1.Follow, (follow) => follow.member, { cascade: true }),
    __metadata("design:type", Array)
], Member.prototype, "followings", void 0);
__decorate([
    type_graphql_1.Field(() => [Follow_1.Follow])
    // 팔로워 : 남이 나를 => 남을 구해야함. 남 = target_id
    ,
    typeorm_1.OneToMany(() => Follow_1.Follow, (follow) => follow.target, { cascade: true }),
    __metadata("design:type", Array)
], Member.prototype, "followers", void 0);
Member = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity()
], Member);
exports.Member = Member;
// -- --------------------------------------------------------------------------
// 팔로우 카운트 트리거
// DELIMITER //
// CREATE TRIGGER follow_after_insert_trigger
//     AFTER INSERT ON `follow`
//     FOR EACH ROW
// BEGIN
//     IF NEW.relation = 2 THEN
//         UPDATE `member` SET follower_count = follower_count+1 WHERE id=NEW.target_id;
// 	END IF;
// END; //
// DELIMITER ;
// DELIMITER //
// CREATE TRIGGER follow_after_update_trigger
//     AFTER UPDATE ON `follow`
//     FOR EACH ROW
// BEGIN
//     IF NEW.relation = 2 THEN
//         UPDATE `member` SET follower_count = follower_count+1 WHERE id=NEW.target_id;
// 	END IF;
// END; //
// DELIMITER ;
// CREATE TRIGGER follow_after_delete_trigger
//     AFTER DELETE ON `follow`
//     FOR EACH ROW
// UPDATE `member` SET follower_count = follower_count-1 WHERE id=OLD.target_id;
// SHOW TRIGGERS;
// DROP TRIGGER IF EXISTS test2_after_delete_trigger;
// -- --------------------------------------------------------------------------
