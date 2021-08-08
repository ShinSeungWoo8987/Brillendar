import express, { Request, Response, NextFunction } from 'express';
import { upload, s3, deleteImage } from '../functions/awsS3';
import dotenv from 'dotenv';
import { verify, VerifyErrors } from 'jsonwebtoken';
import { createAccessToken } from '../functions/auth';
import { Member } from '../entity/Member';
import ScheduleDetails, { ScheduleImg } from '../mongodb/models/ScheduleDetails';

dotenv.config();

const router = express.Router();

// jwt check middleware
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers['authorization'];

  if (!authorization) return res.sendStatus(403);

  try {
    const token = authorization?.split(' ')[1];
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, user) => {
      if (err) throw err;

      req.body.user = user;
      next();
    });
  } catch (err) {
    const error: VerifyErrors = err as VerifyErrors;
    res.send({ error: { field: error.name, message: error.message } });
  }
};

///////////////
router.get('/refresh_token', verifyToken, async (req, res) => {
  console.log(req.body.user.id);
  const member = await Member.findOne({ id: req.body.user.id });
  if (!member) {
    res.send({ error: { field: 'token', message: 'Invalid' } });
  }
  // 버전을 바꾸면 accessToken이 만료된 뒤 refreshToken을 발급받지 못하도록 (버전이 바뀌어도 accessToken 만료 전에는 해당 토큰 사용가능)
  else if (member.token_version !== req.body.user.version) {
    res.send({ error: { field: 'token', message: 'Expired' } });
  } else {
    res.send({ refreshToken: createAccessToken(member) });
  }
});

///////////////

type ScheduleResultInput = {
  result_description: string;
  result_img: ScheduleImg[];
};

router.put('/schedule_result', verifyToken, upload(`brillendar`).array('file'), async (req, res) => {
  const files = req.files! as any;
  const { mongo_id, result_description } = req.body;

  let newScheduleResult: ScheduleResultInput = { result_description, result_img: [] };

  if (files) {
    newScheduleResult.result_img = files.map((file: any, idx: number) => ({ idx, url: file.location }));
  }

  try {
    const check = await ScheduleDetails.findOneAndUpdate(
      { _id: mongo_id },
      { ...newScheduleResult },
      {
        // new: true,
        // overwrite: true,
      }
    ).exec();

    console.log();

    res.send({ scheduleResult: newScheduleResult });
  } catch (err) {
    console.log(err);
    res.send({ error: { field: 'Insert Schedule Result', message: 'Cannot insert schedule result.' } });
  }
});

// //////////////////

router.post('/profile_img', verifyToken, upload(`brillendar`).single('file'), (req, res) => {
  // multipart-formdata에서는 verifyToken에서 body로 유저의 정보를 넘겨줄 수 없다.
  const file = req.file as any;

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

router.delete('/image', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body.url.forEach(async (s3filekey: string) => {
      const _temp = s3filekey.split('/');
      deleteImage(_temp[_temp.length - 1]);
    });
  } catch (error) {
    res.sendStatus(400);
  }
  res.sendStatus(200);
});

export default router;

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
