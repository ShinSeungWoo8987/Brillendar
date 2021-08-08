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
exports.verifyToken = void 0;
const express_1 = __importDefault(require("express"));
const awsS3_1 = require("../functions/awsS3");
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = require("jsonwebtoken");
const auth_1 = require("../functions/auth");
const Member_1 = require("../entity/Member");
const ScheduleDetails_1 = __importDefault(require("../mongodb/models/ScheduleDetails"));
dotenv_1.default.config();
const router = express_1.default.Router();
// jwt check middleware
const verifyToken = (req, res, next) => {
    const authorization = req.headers['authorization'];
    if (!authorization)
        return res.sendStatus(403);
    try {
        const token = authorization === null || authorization === void 0 ? void 0 : authorization.split(' ')[1];
        const payload = jsonwebtoken_1.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err)
                throw err;
            req.body.user = user;
            next();
        });
    }
    catch (err) {
        const error = err;
        res.send({ error: { field: error.name, message: error.message } });
    }
};
exports.verifyToken = verifyToken;
///////////////
router.get('/refresh_token', exports.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body.user.id);
    const member = yield Member_1.Member.findOne({ id: req.body.user.id });
    if (!member) {
        res.send({ error: { field: 'token', message: 'Invalid' } });
    }
    // 버전을 바꾸면 accessToken이 만료된 뒤 refreshToken을 발급받지 못하도록 (버전이 바뀌어도 accessToken 만료 전에는 해당 토큰 사용가능)
    else if (member.token_version !== req.body.user.version) {
        res.send({ error: { field: 'token', message: 'Expired' } });
    }
    else {
        res.send({ refreshToken: auth_1.createAccessToken(member) });
    }
}));
router.put('/schedule_result', exports.verifyToken, awsS3_1.upload(`brillendar`).array('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    const { mongo_id, result_description } = req.body;
    let newScheduleResult = { result_description, result_img: [] };
    if (files) {
        newScheduleResult.result_img = files.map((file, idx) => ({ idx, url: file.location }));
    }
    try {
        const check = yield ScheduleDetails_1.default.findOneAndUpdate({ _id: mongo_id }, Object.assign({}, newScheduleResult), {
        // new: true,
        // overwrite: true,
        }).exec();
        console.log();
        res.send({ scheduleResult: newScheduleResult });
    }
    catch (err) {
        console.log(err);
        res.send({ error: { field: 'Insert Schedule Result', message: 'Cannot insert schedule result.' } });
    }
}));
// //////////////////
router.post('/profile_img', exports.verifyToken, awsS3_1.upload(`brillendar`).single('file'), (req, res) => {
    // multipart-formdata에서는 verifyToken에서 body로 유저의 정보를 넘겨줄 수 없다.
    const file = req.file;
    res.send(file.location);
});
/*
res.sendStatus(201);

201 Created
요청이 성공적이었으며 그 결과로 새로운 리소스가 생성되었습니다. 이 응답은 일반적으로 POST 요청 또는 일부 PUT 요청 이후에 따라옵니다.

202 Accepted
요청을 수신하였지만 그에 응하여 행동할 수 없습니다. 이 응답은 요청 처리에 대한 결과를 이후에 HTTP로 비동기 응답을 보내는 것에 대해서 명확하게 명시하지 않습니다. 이것은 다른 프로세스에서 처리 또는 서버가 요청을 다루고 있거나 배치 프로세스를 하고 있는 경우를 위해 만들어졌습니다.
*/
///////////////
router.delete('/image', exports.verifyToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body.url.forEach((s3filekey) => __awaiter(void 0, void 0, void 0, function* () {
            const _temp = s3filekey.split('/');
            awsS3_1.deleteImage(_temp[_temp.length - 1]);
        }));
    }
    catch (error) {
        res.sendStatus(400);
    }
    res.sendStatus(200);
}));
exports.default = router;
/*

// 파일 하나만 업로드 할 때. ex) { img: File }
app.post('/uploadOne', upload(filePath).single('img'), (req, res) => {
  console.log(req.file);
});

// 파일 여러개를 배열로 업로드 할 때. ex) { img: [File,File,File,...] }
app.post('/uploadArray', upload(filePath).array('img'), (req, res) => {
  console.log(req.files);
});

// 파일을 여러개의 객체로 업로드 할 때.
app.post(
  '/uploadFields',
  upload(filePath).fields([{ name: 'img1' }, { name: 'img2' }, { name: 'img3' }]),
  (req, res) => {
    console.log(req.files);
  }
);

*/
/////////////////////////////////////////
// router.post('/uploadOne', verifyToken, upload(`brillendar`).single('file'), (req, res) => {
//   const file = req.file as any;
//   res.send(file.location);
// });
// router.post('/uploadArray', verifyToken, upload(`brillendar`).array('file'), (req, res) => {
//   const files = req.files! as any;
//   const paths = files.map((file: any) => file.location);
//   res.send(paths);
// });
