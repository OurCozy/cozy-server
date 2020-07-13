const MainModel = require('../models/main'); // 스키마 불러오기 
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/resMessage');
const util = require('../modules/util');

var count = 0;
var obj = [];
var reviewPhoto = "NULL";

const main = {
    showRecommendation : async (req, res) => {
        // const userIdx = req.decoded.userIdx;
        var autoLogin = req.cookies.autoLogin;
        console.log(autoLogin);
        const bookstore = await MainModel.showRecommendation();
        try {
            if (!bookstore.length) {
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_DATA));
            }
            else return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_DATA_SUCCESS, bookstore));
        } catch (err) {
            res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    showDetail : async (req, res) => {
        const userIdx = req.decoded.userIdx;
        const bookstoreIdx = req.params.bookstoreIdx;

        /**
         * 🔥 cookie 🔥
         * 현재 사용자가 가지고 있는 쿠키 확인: req.cookies.[cookie_name]
         * 쿠기 저장: res.cookie('cookie_name', 'cookie_value', option)
         * [option] 👇
         * maxAge: 쿠키의 만료 시간을 밀리초 단위로 설정
         * expires: 쿠키의 만료 시간을 표준 시간 으로 설정
         * path: 쿠키의 경로 (default: /)
         * domain: 쿠키의 도메인 이름 (default: loaded)
         * secure: HTTPS 프로토콜만 쿠키 사용 가능
         * httpOnly: HTTP 프로토콜만 쿠키 사용 가능
         * signed: 쿠키의 서명 여부를 결정
         *  */ 
        var bookstores = req.cookies.bookstores;

        // 쿠키 확인
        if (req.cookies.bookstores) { // 이미 쿠키값이 있다면
            bookstores = req.cookies.bookstores; // 배열 형식으로?
        } else { // 최초 실행 시
            bookstores = {};
        }
        
        // parseInt(bookstoreIdx): integer 타입으로 형변환
        const result = await MainModel.selectProfile(bookstoreIdx);
        console.log("result: ", result[0]);

        console.log('bb: ', bookstores);
        console.log('result[0].bookstoreIdx: ', result[0].bookstoreIdx);
        // console.log('bookstores[i][0].bookstoreIdx: ',bookstores[count][0].bookstoreIdx);

        // 서점 리스트가 없을 경우
        if (result[0] !== undefined) {
            var flag = 0;
            bookstores[count++] = result;
            // 쿠키가 비어있지 않고
            // if (bookstores !== {}) {
            //     for (var i in bookstores) {
            //         if (result[0].bookstoreIdx !== bookstores[i][0].bookstoreIdx) {
            //             // console.log('bbb:', bookstores[i][0].bookstoreIdx);
            //             flag = 0;
            //             console.log('success!', flag);
            //             break;
            //         } else {
            //             flag = 1;
            //             console.log('fail!', flag);
            //         }
            //     }
            // }
            // if (flag === 1)
            //     bookstores[count++] = result;
        }

        res.cookie('bookstores', bookstores, {
            // maxAge: 60*60*1000*12 // 12h
            // 최대로 저장할 수 있는 쿠키 개수가 정해져 있나?
            maxAge: 100000
        });

        // console.log(bookstores);

        // res.redirect(`/main/detail/${bookstoreIdx}`); // 위치 지정해서 detail 뷰로 가능

        const bookstore = await MainModel.showDetail(userIdx, bookstoreIdx);
        // console.log(bookstore);
        try {
            if (bookstore.length === 0) {
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_DATA));
            }
            else return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_DATA_SUCCESS, bookstore));
        } catch (err) {
            res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    showLocation : async (req, res) => {
        const sectionIdx = req.params.sectionIdx;
        const userIdx = req.decoded.userIdx;
        console.log('sectionIdx: ',sectionIdx);
        try {
            const bookstoreBySection = await MainModel.showLocation(userIdx, sectionIdx);
            if (!bookstoreBySection.length) {
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_DATA));
            }
            else return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_DATA_SUCCESS, bookstoreBySection));
        } catch (err) {
            res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    showInterest : async (req, res) => {
        const userIdx = req.decoded.userIdx;
        try{
            const interest = await MainModel.showInterest(userIdx);
            if(interest.length===0){
                const nickname = await MainModel.selectNickname(userIdx);
                return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.NO_DATA, {
                    bookstoreIdx: 0,
                    bookstoreName: "NULL",
                    profile: "NULL",
                    hashtag1: "NULL",
                    hashtag2: "NULL",
                    hashtag3: "NULL",
                    nickname: nickname[0].nickname
                }));
            }else{
                return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_DATA_SUCCESS, interest));
            }
        }catch(err){
            res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    updateBookmark: async (req, res) => {
        const bookstoreIdx = req.params.bookstoreIdx;
        const userIdx = req.decoded.userIdx;
        // console.log(userIdx);
        try {
            const result = await MainModel.updateBookmark(userIdx, bookstoreIdx);
            // if (!result.length) {
            //     return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.))
            // }
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.BOOKMARK_SUCCESS, {checked: result}));
        } catch (err) {
            res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }

    },
    showMypage : async (req, res) => {
        const userIdx = req.decoded.userIdx;
        try {
            const result = await MainModel.showMypage(userIdx);
            if (!result.length) {
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.READ_PROFILE_FAIL));
            }
            else return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_PROFILE_SUCCESS, result));
        } catch (err) {
            res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    showMyReview : async (req, res) => {
        const userIdx = req.decoded.userIdx;
        try{
            const result = await MainModel.showMyReview(userIdx);
            if(result.length === 0){
                res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_REVIEW));
            }
            res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SELECT_REVIEW, result));

        }catch(err){
            res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    writeReview : async (req, res) => {
        const userIdx = req.decoded.userIdx;
        let {bookstoreIdx, content, stars} = req.body;
        try{
            console.log('reviewPhoto: ', reviewPhoto);
            if (!bookstoreIdx || !content || !stars) {
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NULL_VALUE));
            }
            const result = await MainModel.writeReview(userIdx, bookstoreIdx, content, reviewPhoto, stars);
            if(result === undefined){
                res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.ERROR_IN_INSERT_REVIEW));
            }else{
                res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.INSERT_REVIEW_SUCCESS, 
                    {
                        reviewIdx: result, 
                        userIdx: userIdx,
                        bookstoreIdx: bookstoreIdx,
                        stars: stars, 
                        content: content,
                        photo: reviewPhoto
                    }));
            }
        }catch(err){
            res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    showAllReview: async(req, res)=>{
        const userIdx = req.decoded.userIdx;
        const bookstoreIdx = req.params.bookstoreIdx;
        try{
            const result = await MainModel.showAllReview(bookstoreIdx);
            if(result.length === 0){
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_REVIEW));
            }else{
                return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SELECT_REVIEW, result));
            }
        }catch(err){
            res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    showTwoReviews: async(req, res) => {
        const userIdx = req.decoded.userIdx;
        const bookstoreIdx = req.params.bookstoreIdx;
        try {
            const result = await MainModel.showAllReview(bookstoreIdx);
            console.log(result);
            if (result.length === 0) {
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_REVIEW));
            } else{
                return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SELECT_REVIEW, result.slice(0,2)));
            }
        }catch(err){
            res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    deleteReview: async(req, res)=>{
        const reviewIdx = req.params.reviewIdx;
        try{
            const result = await MainModel.deleteReview(reviewIdx);
            if(result === 1){
                res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.DELETE_REVIEW, {reviewIdx:reviewIdx}));
            }else{
                res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.ERROR_IN_DELETE_REVIEW));
            }
        }catch(err){
            res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    updateReview: async(req, res)=>{
        const reviewIdx = req.params.reviewIdx;
        let {stars, content, photo}= req.body;
        try{
            if(photo === undefined){
                photo = null;
            }
            const result = await MainModel.updateReview(reviewIdx, stars, content, photo);
            if(result === 1){
                res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.UPDATE_REVIEW,{reviewIdx: reviewIdx}));
            }else{
                res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.ERROR_IN_UPDATE_REVIEW))
            }
        }catch(err){
            res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    search : async (req, res) => {
        const userIdx = req.decoded.userIdx;
        const keyword = req.params.keyword;

        // if (keyword === null) {
        //     return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_KEYWORD));
        // }

        try {
            const result = await MainModel.searchByKeyword(keyword);
            if (!result.length) {
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_SEARCH_DATA));
            }
            else return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SUCCESS_SEARCH, result));
        } catch (err) {
            res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    showRecent : async (req, res) => {
        const userIdx = req.decoded.userIdx;
        var bookstores = req.cookies.bookstores;

        if (!req.cookies.bookstores) {
            return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_RECENT_BOOKSTORES));
        }

        console.log(bookstores);

        // json 객체 담을 배열
        for (var i in bookstores) {
            // console.log("bookstores[i]", bookstores[i]); // [ RowDataPacket { bookstoreIdx: 18, profile: 'NULL' } ]
            // console.log("bookstores[i][0]: ", bookstores[i][0]); // RowDataPacket { bookstoreIdx: 18, profile: 'NULL' }
            // console.log("bookstores[i][0][0]: ", bookstores[i][0]['bookstoreIdx']);

            /* 중복 제거 */
            // console.log("true/false? ", obj.includes(bookstores[i][0]));
            // console.log(obj.indexOf(bookstores[i][0]));
            // if (obj.indexOf(bookstores[i][0]) > -1) {
            //     continue;
            // }

            obj[i] = bookstores[i][0];

            
            // var idx;
            // if (idx = obj.indexOf(obj[i]) > -1) {
            //     obj.splice(idx, 1);
            // }
        }
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.COOKIE_SUCCESS, obj.reverse().slice(0,10)));
    },
    updateProfile: async (req, res) => {
        // 데이터 받아오기
        const userIdx = req.decoded.userIdx;
        const bookstoreIdx = req.params.bookstoreIdx;
        const profile = req.file.location;

        // data check - undefined
        if (profile === undefined || !bookstoreIdx) {
            return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NULL_VALUE));
        }
        // image type check
        const type = req.file.mimetype.split('/')[1];
        if (type !== 'jpeg' && type !== 'jpg' && type !== 'png') {
            return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.UNSUPPORTED_TYPE));
        }
        // call model - database
        // 결과값은 프로필에 대한 이미지 전달
        const result = await MainModel.updateProfile(bookstoreIdx, profile);
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.UPDATE_PROFILE_SUCCESS, result));
    },
    updateReviewPhoto: async (req, res) => {
        const bookstoreIdx = req.params.bookstoreIdx;
        if(req.file === undefined) {
            res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.FAIL_UPDATE_REVIEW_PHOTO, {reveiwPhoto: reviewPhoto}));
        }
        console.log('req.file: ', req.file);
        reviewPhoto = req.file.location;

        // data check - undefined
        if (reviewPhoto === undefined || !bookstoreIdx) {
            return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NULL_VALUE));
        }
        // image type check
        const type = req.file.mimetype.split('/')[1];
        if (type !== 'jpeg' && type !== 'jpg' && type !== 'png') {
            return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.UNSUPPORTED_TYPE));
        }
        // call model - database
        // 결과값은 프로필에 대한 이미지 전달
        // const result = await MainModel.updateReviewPhoto(bookstoreIdx, reviewPhoto);
        
        // res.redirect(`/main/detail/${bookstoreIdx}`); // 위치 지정해서 detail 뷰로 가능
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SUCCESS_UPDATE_REVIEW_PHOTO, {reviewPhoto: reviewPhoto}));

    }
}

module.exports = main;