"use strict";
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
exports.deleteImage = exports.upload = exports.s3 = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const multer_1 = __importDefault(require("multer"));
const dotenv_1 = __importDefault(require("dotenv"));
const uuid_1 = require("uuid");
dotenv_1.default.config();
exports.s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});
const upload = (filePath) => multer_1.default({
    storage: multer_s3_1.default({
        s3: exports.s3,
        bucket: process.env.BUCKET,
        key: (req, file, cb) => {
            cb(null, filePath + `/${uuid_1.v4()}.jpg`);
        },
        acl: 'public-read-write',
    }),
});
exports.upload = upload;
const deleteImage = (filePath) => __awaiter(void 0, void 0, void 0, function* () { return yield exports.s3.deleteObject({ Bucket: process.env.BUCKET, Key: 'portfolio/' + filePath }).promise(); });
exports.deleteImage = deleteImage;
