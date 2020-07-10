const MainModel = require('../models/main'); // 스키마 불러오기 
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/resMessage');
const util = require('../modules/util');

var count = 0;
var obj = [];

const main = {
    showRecommendation : async (req, res) => {
        const userIdx = req.decoded.userIdx;
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
        const bookstore = await MainModel.showDetail(bookstoreIdx);
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
        console.log(sectionIdx);
        try {
            const bookstoreBySection = await MainModel.showLocation(sectionIdx);
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
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_DATA));
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
        console.log(userIdx);
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

    },
    writeReview : async (req, res) => {

    },
    search : async (req, res) => {
        const userIdx = req.decoded.userIdx;
        const keyword = req.params.keyword;

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
    setRecent: async (req, res) => {

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

        const userIdx = req.decoded.userIdx;
        const bookstoreIdx = req.params.bookstoreIdx;
        var bookstores = req.cookies.bookstores;

        // 쿠키 확인
        if (req.cookies.bookstores) { // 이미 쿠키값이 있다면
            bookstores = req.cookies.bookstores; // 배열 형식으로?
        } else { // 최초 실행 시
            bookstores = {};
        }
        
        // parseInt(bookstoreIdx): integer 타입으로 형변환
        const result = await MainModel.selectProfile(bookstoreIdx);
        // console.log("result: ", result[0]);
        if (result[0] !== undefined) {
            bookstores[count++] = result;
            res.cookie('bookstores', bookstores, {
                maxAge: 100000
            });
        }

        // console.log(bookstores[count-1][0]);

        // for (var i in bookstores) {
        //     // console.log(bookstores[i][0]);
        //     // console.log("true/false? ", bookstores[i].indexOf(bookstores[count-1][0]));
        //     // -1 이면 존재 x
        //     if (bookstores[i].indexOf(bookstores[count-1][0]) === -1) {
                
        //     }
        // }
        
        // console.log("true/false?", bookstores.indexOf(bookstores[count-1]));
        // if (obj.indexOf(bookstores[count]) === -1) {
        //     // key: bookstores, value: bookstores
        //     res.cookie('bookstores', bookstores, {
        //         maxAge: 10000
        //     });
        // }
        
        res.redirect(`/main/detail/${bookstoreIdx}`); // 위치 지정해서 detail 뷰로 가능

        // res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.COOKIE_SUCCESS, obj.reverse()));
    },
    showRecent : async (req, res) => {
        const userIdx = req.decoded.userIdx;
        var bookstores = req.cookies.bookstores;

        if (!req.cookies.bookstores) {
            return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_RECENT_BOOKSTORES));
        }

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
}

module.exports = main;