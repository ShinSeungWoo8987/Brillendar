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
exports.CommentResponse = void 0;
const mongoose_1 = require("mongoose");
const type_graphql_1 = require("type-graphql");
let CommentResponse = class CommentResponse {
};
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], CommentResponse.prototype, "_id", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], CommentResponse.prototype, "schedule_mongo_id", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], CommentResponse.prototype, "writer_id", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], CommentResponse.prototype, "description", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Date)
], CommentResponse.prototype, "created_at", void 0);
CommentResponse = __decorate([
    type_graphql_1.ObjectType()
], CommentResponse);
exports.CommentResponse = CommentResponse;
const schema = new mongoose_1.Schema({
    schedule_mongo_id: { type: String, required: true },
    writer_id: { type: String, required: true },
    description: { type: String, required: true },
    created_at: { type: Date, required: true },
});
exports.default = mongoose_1.model('Comment', schema);
