"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mode = process.env.MODE;
exports.default = mode === 'DEVELOPMENT' ? process.env.DEVELOPMENT_URL : process.env.PRODUCTION_URL;
