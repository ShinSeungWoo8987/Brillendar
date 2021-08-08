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
exports.ScheduleDetailsResponse = exports.ScheduleImg = void 0;
const mongoose_1 = require("mongoose");
const type_graphql_1 = require("type-graphql");
let ScheduleImg = class ScheduleImg {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], ScheduleImg.prototype, "idx", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], ScheduleImg.prototype, "url", void 0);
ScheduleImg = __decorate([
    type_graphql_1.ObjectType()
], ScheduleImg);
exports.ScheduleImg = ScheduleImg;
let ScheduleDetailsResponse = class ScheduleDetailsResponse {
};
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], ScheduleDetailsResponse.prototype, "_id", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], ScheduleDetailsResponse.prototype, "title", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], ScheduleDetailsResponse.prototype, "description", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], ScheduleDetailsResponse.prototype, "comment_count", void 0);
__decorate([
    type_graphql_1.Field(() => [ScheduleImg]),
    __metadata("design:type", Array)
], ScheduleDetailsResponse.prototype, "result_img", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], ScheduleDetailsResponse.prototype, "result_description", void 0);
ScheduleDetailsResponse = __decorate([
    type_graphql_1.ObjectType()
], ScheduleDetailsResponse);
exports.ScheduleDetailsResponse = ScheduleDetailsResponse;
const scheduleImg = new mongoose_1.Schema({
    idx: Number,
    url: String,
});
const schema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    comment_count: { type: Number, default: 0 },
    result_img: { type: [scheduleImg] },
    result_description: String,
});
exports.default = mongoose_1.model('ScheduleDetails', schema);
