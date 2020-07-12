const express = require('express');
const router = express.Router();

const mainController = require('../controllers/main');

// 북마크순으로 상위 8개 조회!
router.get('/recommendation', mainController.showRecommendation);
// 자세히보기
router.get('/detail/:bookstoreIdx', mainController.showDetail);
router.get('/map/:sectionIdx', mainController.showLocation);
router.get('/interest', mainController.showInterest);
router.get('/mypage', mainController.showMypage);
router.get('/mypage/review', mainController.showMyReview);
router.post('/detail/review', mainController.writeReview);
router.get('/search', mainController.search);
router.get('/recent', mainController.recent);



module.exports = router;