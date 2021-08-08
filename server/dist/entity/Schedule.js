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
exports.Schedule = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Like_1 = require("./Like");
const Member_1 = require("./Member");
const Tag_1 = require("./Tag");
let Schedule = class Schedule extends typeorm_1.BaseEntity {
};
__decorate([
    type_graphql_1.Field(),
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Schedule.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Schedule.prototype, "writer_id", void 0);
__decorate([
    type_graphql_1.Field(() => Member_1.Member),
    typeorm_1.ManyToOne(() => Member_1.Member, (member) => member.id, { onDelete: 'CASCADE' }),
    typeorm_1.JoinColumn({ name: 'writer_id' }),
    __metadata("design:type", Member_1.Member)
], Schedule.prototype, "writer", void 0);
__decorate([
    type_graphql_1.Field(() => [Tag_1.Tag]),
    typeorm_1.OneToMany(() => Tag_1.Tag, (tag) => tag.schedule, { cascade: true }),
    __metadata("design:type", Array)
], Schedule.prototype, "tags", void 0);
__decorate([
    type_graphql_1.Field(() => [Like_1.Like]),
    typeorm_1.OneToMany(() => Like_1.Like, (like) => like.schedule, { cascade: true }),
    __metadata("design:type", Array)
], Schedule.prototype, "likes", void 0);
__decorate([
    typeorm_1.Column(),
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Schedule.prototype, "mongo_id", void 0);
__decorate([
    typeorm_1.Column(),
    type_graphql_1.Field(),
    __metadata("design:type", Boolean)
], Schedule.prototype, "open", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], Schedule.prototype, "like_count", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Schedule.prototype, "start_at", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Schedule.prototype, "finish_at", void 0);
Schedule = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity()
], Schedule);
exports.Schedule = Schedule;
