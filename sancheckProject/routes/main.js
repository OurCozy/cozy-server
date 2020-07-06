const express = require('express');
const router = express.Router();

const mainController = require('../controllers/main');

router.get('/recommendation', mainController.showRecommendation);

router.get('/detail/:bookstoreIdx', mainController.showDetail);
router.get('/map/:sectionIdx', mainController.showLocation);
router.get('/interest', mainController.showInterest);
router.get('/mypage', mainController.showMypage);
router.get('/mypage/review', mainController.showMyReview);
router.post('/detail/review', mainController.writeReview);
router.get('/search', mainController.search);
router.get('/recent', mainController.recent);

module.exports = router;