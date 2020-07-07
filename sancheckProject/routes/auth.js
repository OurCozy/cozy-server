const express = require('express');
const router = express.Router();
const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const jwt = require('../modules/jwt');
const resMessage = require('../modules/resMessage');
const TOKEN_EXPIRED = -3
const TOKEN_INVALID = -2

router.get('/local', async (req, res) => {
    // 헤더에 있는 token 값 가져오기
    var token = req.headers.token;
    if (!token) {
        return res.json(util.fail(statusCode.BAD_REQUEST, resMessage.EMPTY_TOKEN));
    }
    const user = await jwt.verify(token);
    if (user == TOKEN_EXPIRED) {
        return res.json(util.fail(statusCode.UNAUTHORIZED, resMessage.EXPIRED_TOKEN));
    }
    if (user == TOKEN_INVALID) {
        console.log(user);
        return res.json(util.fail(statusCode.UNAUTHORIZED, resMessage.INVALID_TOKEN));
    }
    if (user.userIdx == undefined) {
        console.log(user);
        return res.json(util.fail(statusCode.UNAUTHORIZED, resMessage.INVALID_TOKEN));
    }
    return res.json(util.success(statusCode.OK, resMessage.AUTH_SUCCESS, {userIdx: user.userIdx, nickname: user.nickname}));
});

module.exports = router;