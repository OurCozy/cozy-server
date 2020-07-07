const MainModel = require('../models/main'); // 스키마 불러오기 
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/resMessage');
const util = require('../modules/util');


const main = {
    showRecommendation : async (req, res) => {
        const bookstore = await MainModel.showRecommendation();
        // console.log(bookstore);
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
        
    },
    updateBookmark: async (req, res) => {
        const bookstoreIdx = req.params.bookstoreIdx;
        
    },
    showMypage : async (req, res) => {

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