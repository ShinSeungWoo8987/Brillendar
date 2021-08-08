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
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const typeorm_1 = require("typeorm");
const mongoConnection_1 = __importDefault(require("./mongoConnection"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const hello_1 = require("./resolver/hello");
const member_1 = require("./resolver/member");
const schedule_1 = require("./resolver/schedule");
const follow_1 = require("./resolver/follow");
const like_1 = require("./resolver/like");
const comment_1 = require("./resolver/comment");
const register_1 = require("./resolver/register");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const index_1 = __importDefault(require("./routes/index"));
const register_2 = __importDefault(require("./routes/register"));
dotenv_1.default.config();
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield typeorm_1.createConnection().catch((error) => console.error(error));
    yield mongoConnection_1.default().catch((error) => console.error(error));
    const app = express_1.default();
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(express_1.default.json());
    app.use(compression_1.default());
    app.use(cookie_parser_1.default());
    app.use(cors_1.default({ origin: '*', credentials: true })); // origin: ['http://59.14.116.202:19006', 'http://localhost:19006']
    app.use('/', index_1.default);
    app.use('/', register_2.default);
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield type_graphql_1.buildSchema({
            resolvers: [
                hello_1.HelloResolver,
                member_1.MemberResolver,
                schedule_1.ScheduleResolver,
                follow_1.FollowResolver,
                like_1.LikeResolver,
                comment_1.CommentResolver,
                register_1.RegisterResolver,
            ],
            validate: false,
        }),
        context: ({ req, res }) => ({ req, res }),
    });
    // 최신버전에서는 이거 안쓰면 에러뜸 // "apollo-server-express": "^2.25.0" 로 다운그레이드했음
    yield apolloServer.start();
    apolloServer.applyMiddleware({ app, cors: false }); // '*'
    const port = process.env.PORT;
    app.listen(port, () => {
        console.log(`server running on http://localhost:${port}`);
    });
});
main().catch((err) => console.log(err));
