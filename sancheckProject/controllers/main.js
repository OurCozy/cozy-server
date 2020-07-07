const MainModel = require('../models/main'); // 스키마 불러오기 
const { DB_ERROR, OK } = require('../modules/statusCode');


const main = {
    showRecommendation : async (req, res) => {
        const bookstore = await MainModel.showRecommendation();
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
    showDetail : async (req, res) => {
        
    },
    showLocation : async (req, res) => {

    },
    showInterest : async (req, res) => {
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