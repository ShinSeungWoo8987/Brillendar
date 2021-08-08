import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export default () =>
  mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USERNAME!}:${process.env
      .MONGO_PASSWORD!}@portfolio.2ubwx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );
