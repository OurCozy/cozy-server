const UserModel = require('../models/user');
const encrypt = require('../modules/crypto');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/resMessage');
const util = require('../modules/util');
const jwt = require('../modules/jwt');
const mailer = require('../modules/mailer');

const user = {
    signup : async (req, res) => {
        const {
            nickname,
            email,
            password,
            passwordConfirm
        } = req.body;
        if (!nickname || !password || !email || !passwordConfirm) {
            return res.status(statusCode.OK)
                .send(util.fail(statusCode.OK, resMessage.NULL_VALUE));
        }
        // 사용중인 아이디가 있는지 확인
        let result = await UserModel.checkUserByName(nickname);
        if (result.length > 0) {
            return res.status(statusCode.OK)
                .send(util.fail(statusCode.OK, resMessage.ALREADY_ID));
        }

        // 사용중인 이메일이 있는지 확인
        result = await UserModel.checkUserByEmail(email);
        if (result.length > 0) {
            return res.status(statusCode.OK)
                .send(util.fail(statusCode.OK, resMessage.ALREADY_EMAIL));
        }

        if(password !== passwordConfirm){
            return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.DIFFERENT_PW));
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
            email,
            password,
            autoLogin
        } = req.body;

        if (!email || !password || !autoLogin) {
            res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NULL_VALUE));
            return;
        }
    
        // User의 email이 있는지 확인 - 없다면 NO_USER 반납
        const user = await UserModel.checkUserByEmail(email);

        // statusCode: 204 => 요청에는 성공했으나 클라가 현재 페이지에서 벗어나지 않아도 된다.~~
        // 페이지는 바뀌지 않는데 리소스는 업데이트될 때 사용
        if (!user[0]) {
            return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_USER));
        }

        // req의 Password 확인 - 틀렸다면 MISS_MATCH_PW 반납
        // encrypt 모듈 만들어놓은 거 잘 활용하기!
        const hashed = await encrypt.encryptWithSalt(password, user[0].salt);
        // console.log(hashed);
        // console.log(user[0].password);
        if (hashed !== user[0].hashed) {
            return res.status(statusCode.OK)
            .send(util.fail(statusCode.OK, resMessage.MISS_MATCH_PW));
        }

        var expireDate = new Date( Date.now() + 60 * 60 * 1000 * 24 * 7); // 24 hour 7일

        if (req.body.autoLogin === 'checked') {
                console.log("자동로그인 체크!");
            }

            res.cookie('autoLogin', {email: req.body.email, hashed: user[0].hashed}, {
                expires: expireDate
            });    
        // console.log(user[0]);
        // 로그인 성공적으로 마쳤다면 - LOGIN_SUCCESS 전달 


        const {token, _} = await jwt.sign(user[0]);

        user[0].accessToken = token;
        
        res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.LOGIN_SUCCESS, {
                userIdx: user[0].userIdx,
                nickname: user[0].nickname,
                email: user[0].email,
                profile: user[0].profile,
                accessToken: user[0].accessToken
            }));
    },
    updateImages: async(req, res)=>{
        const bookstoreIdx=req.params.bookstoreIdx;
        let imageLocations=[];
        for(var i=0;i<3;i++){
            imageLocations[i]=req.files[i].location;
        }
        const result=await UserModel.updateImages(bookstoreIdx, imageLocations);
        res.status(statusCode.OK)
        .send(util.success(statusCode.OK, resMessage.UPDATE_IMAGE_SUCCESS, result));
    },
    updateProfile: async (req, res) => {
        // 데이터 받아오기
        const userIdx = req.decoded.userIdx;
        console.log(userIdx);
        // jwt 토큰을 가져와서 디코드 시켜줌
        // 체크토큰은 decoded된 정보를 담아줌
        console.log(req.file);
        const profile = req.file.location;
        console.log(profile);
        // s3는 path를 location으로 
        // 최종 업로드되는 파일의 이름이 path에 저장됨
        // 이름이 저장될 때 중복되면 안되므로 multer가 알아서 키값을 어렵고 복잡하게 만들어서 저장?
        // +) ms 단위의 시간으로 파일이름 저장해줘도 좋음!

        // data check - undefined
        if (profile === undefined || !userIdx) {
            return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NULL_VALUE));
        }
        // image type check
        const type = req.file.mimetype.split('/')[1];
        if (type !== 'jpeg' && type !== 'jpg' && type !== 'png') {
            return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.UNSUPPORTED_TYPE));
        }
        // call model - database
        // 결과값은 프로필에 대한 이미지 전달
        const result = await UserModel.updateProfile(userIdx, profile);
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.UPDATE_PROFILE_SUCCESS, result));
    },
    findPassword: async(req, res)=>{
        const userEmail=req.body.email;
        console.log('email:', userEmail);
        //데이터 누락
        if(!userEmail){
            return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NULL_VALUE));
        }
        //해당 이메일이 db에 없을 때
        const result = await UserModel.checkUserByEmail(userEmail);
        if(result.length===0){
            return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_USER));
        }
        //임시 비밀번호를 해당 이메일로 발송
        try{
            const newPW = Math.random().toString(36).slice(2);
            let emailParam = {
                toEmail : userEmail,
                subject : 'New Email From COZY',
                text : `New Password : ${newPW}`
            };
            const {
                salt,
                hashed
            } = await encrypt.encrypt(newPW);
            await UserModel.updateNewPW(userEmail, hashed, salt);
            mailer.sendGmail(emailParam);
            res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SEND_EMAIL_SUCCESS, emailParam))
        }catch(err){
            console.log('find PW by email mailer ERR : ',err);
            throw err;
        }
    }
}
module.exports = user;