const UserModel = require('../models/user');
const encrypt = require('../modules/crypto');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/resMessage');
const util = require('../modules/util');
const jwt = require('../modules/jwt');

const user = {
    signup : async (req, res) => {
        const {
            nickname,
            password,
            email
        } = req.body;
        if (!nickname || !password || !email) {
            return res.status(statusCode.NULL_VALUE)
                .send(util.fail(statusCode.NULL_VALUE, resMessage.NULL_VALUE));
        }
        // 사용중인 아이디가 있는지 확인
        let result = await UserModel.checkUserByName(nickname);
        if (result.length > 0) {
            return res.status(statusCode.ALREADY_EXSIT)
                .send(util.fail(statusCode.ALREADY_EXSIT, resMessage.ALREADY_ID));
        }

        // 사용중인 이메일이 있는지 확인
        result = await UserModel.checkUserByEmail(email);
        if (result.length > 0) {
            return res.status(statusCode.ALREADY_EXSIT)
            .send(util.fail(statusCode.ALREADY_EXSIT, resMessage.ALREADY_EMAIL));
        }

        const {
            salt,
            hashed
        } = await encrypt.encrypt(password);
        const idx = await UserModel.signup(nickname, hashed, salt, email);
        if (idx === -1) {
            return res.status(statusCode.DB_ERROR)
                .send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
        console.log(hashed);
        res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.CREATED_USER, {
                userIdx: idx
            }));
    },
    signin : async (req, res) => {
        const {
            nickname,
            password
        } = req.body;
        if (!nickname || !password) {
            res.status(statusCode.NULL_VALUE)
                .send(util.fail(statusCode.NULL_VALUE, resMessage.NULL_VALUE));
            return;
        }
    
        // User의 아이디가 있는지 확인 - 없다면 NO_USER 반납
        const user = await UserModel.checkUserByName(nickname);
        console.log(user);
        if (user[0] === undefined) {
            return res.status(statusCode.NO_CONTENT)
            .send(util.fail(statusCode.NO_CONTENT, resMessage.NO_USER));
        }
        // req의 Password 확인 - 틀렸다면 MISS_MATCH_PW 반납
        // encrypt 모듈 만들어놓은 거 잘 활용하기!
        const hashed = await encrypt.encryptWithSalt(password, user[0].salt);
        // console.log(hashed);
        // console.log(user[0].password);
        if (hashed !== user[0].hashed) {
            return res.status(statusCode.MISS_MATCH)
            .send(util.fail(statusCode.MISS_MATCH, resMessage.MISS_MATCH_PW));
        }
    
        // console.log(user[0]);
        // 로그인 성공적으로 마쳤다면 - LOGIN_SUCCESS 전달 
        const {token, _} = await jwt.sign(user[0]);
        
        res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.LOGIN_SUCCESS, {accessToken: token}));
    }
}
module.exports = user;