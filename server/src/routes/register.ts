import dotenv from 'dotenv';
import express from 'express';
import { getEmailVerifyToken } from '../functions/auth';
import { changeEmailStatus } from '../functions/redisClient';

dotenv.config();

const router = express.Router();

// @ts-ignore
router.get(`/verify_email/:emailVerifyToken`, async (req, res) => {
  // @ts-ignore
  const emailVerifyToken = req.params.emailVerifyToken;

  let message: string;

  try {
    const { email, uuid } = getEmailVerifyToken(emailVerifyToken);
    await changeEmailStatus(email, uuid);

    message = '인증에 성공하였습니다.';
  } catch (e) {
    message = '인증실패. 회원가입을 다시 시도해주세요.';
  }

  res.send(`<script type="text/javascript">alert("${message}");window.close();</script>`);
});

export default router;
