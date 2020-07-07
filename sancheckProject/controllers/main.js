const MainModel = require('../models/main'); // 스키마 불러오기 
const { DB_ERROR, OK } = require('../modules/statusCode');


const main = {
    showRecommendation : async (req, res) => {
        const bookstore = await MainModel.showRecommendation();
        console.log(bookstore);
        // console.log(mongoose.connection.readyState);
        try {
            if (bookstore.length === 0) {
                return res.status(OK).send({err: 'Bookstore list not found'});
            }
            else return res.status(OK).send(bookstore);
        } catch (err) {
            res.status(DB_ERROR).send(err);
        }
    },
    showDetail : async (req, res) => {
        const bookstoreIdx = req.params.bookstoreIdx;
        const bookstore = await MainModel.showDetail(bookstoreIdx);
        console.log(bookstore);
        try {
            if (bookstore.length === 0) {
                return res.status(OK).send({err: 'Bookstore list not found'});
            }
            else return res.status(OK).send(bookstore);
        } catch (err) {
            res.status(DB_ERROR).send(err);
        }

    },
    showLocation : async (req, res) => {

    },
    showInterest : async (req, res) => {

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