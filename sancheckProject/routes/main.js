const express = require('express');
const router = express.Router();

const mainController = require('../controllers/main');
const AuthMiddleware = require('../middlewares/auth');

// 북마크순으로 상위 8개 조회
router.get('/recommendation', mainController.showRecommendation);
// 자세히보기
router.get('/detail/:bookstoreIdx', mainController.showDetail);
// 지역별 조회
router.get('/map/:sectionIdx', mainController.showLocation);
// 관심 책방 조회
router.get('/interest', AuthMiddleware.checkToken, mainController.showInterest);
// 북마크 업데이트 
router.put('/interest/:bookstoreIdx', AuthMiddleware.checkToken, mainController.updateBookmark);
// 내 정보 조회
router.get('/mypage', AuthMiddleware.checkToken, mainController.showMypage);
// 후기 조회, 작성 
router.get('/mypage/review', mainController.showMyReview);
router.post('/detail/review', mainController.writeReview);
// 검색
router.get('/search', mainController.search);
// 최근 본 책방 조회
// 메인 뷰에서 책방 사진 누르면 setRecent 처리 -> res.redirect로 showDetail로 돌아감(?)
router.get('/recent/:bookstoreIdx', mainController.setRecent);
router.get('/recent', mainController.showRecent);

module.exports = router;