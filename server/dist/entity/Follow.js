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
exports.Follow = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Member_1 = require("./Member");
let Follow = class Follow extends typeorm_1.BaseEntity {
};
__decorate([
    type_graphql_1.Field(),
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], Follow.prototype, "member_id", void 0);
__decorate([
    type_graphql_1.Field(() => Member_1.Member),
    typeorm_1.ManyToOne(() => Member_1.Member, (member) => member.id, { onDelete: 'CASCADE' }),
    typeorm_1.JoinColumn({ name: 'member_id' }),
    __metadata("design:type", Member_1.Member)
], Follow.prototype, "member", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], Follow.prototype, "target_id", void 0);
__decorate([
    type_graphql_1.Field(() => Member_1.Member),
    typeorm_1.ManyToOne(() => Member_1.Member, (member) => member.id, { onDelete: 'CASCADE' }),
    typeorm_1.JoinColumn({ name: 'target_id' }),
    __metadata("design:type", Member_1.Member)
], Follow.prototype, "target", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Follow.prototype, "relation", void 0);
Follow = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity()
], Follow);
exports.Follow = Follow;
