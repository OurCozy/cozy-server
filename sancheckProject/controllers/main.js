const MainModel = require('../models/main'); // 스키마 불러오기 
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/resMessage');
const util = require('../modules/util');


const main = {
    showRecommendation : async (req, res) => {
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
        const bookstoreIdx = req.params.bookstoreIdx;
        const bookstore = await MainModel.showDetail(bookstoreIdx);
        console.log(bookstore);
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
        const userIdx=req.params.userIdx;
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
        
        const interest = await MainModel.showInterest();
        try{
            if(interest.length===0){
                return res.status(OK).send({err: 'No Interesting Bookstore'});
            }else{
                return res.status(OK).send(interest);
            }
        }catch(err){
            res.status(DB_ERROR).send(err);
        }

    },
    showMypage : async (req, res) => {
        const userIdx = req.params.userIdx;
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

    },
    recent : async (req, res) => {

    },
}

module.exports = main;