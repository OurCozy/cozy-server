const express = require('express');
const router = express.Router();
const upload = require('../modules/multer');

const mainController = require('../controllers/main');
const AuthMiddleware = require('../middlewares/auth');

/**
 * 📌 추천 탭
 * 메인 뷰, 상세 뷰
 */
router.get('/recommendation', AuthMiddleware.checkToken, mainController.showRecommendation);
router.get('/detail/:bookstoreIdx', AuthMiddleware.checkToken, mainController.showDetail);


/**
 * 📌 지도 탭
 * 지역별 조회, 상세 뷰 
 */
router.get('/map/:sectionIdx', AuthMiddleware.checkToken, mainController.showLocation);

/**
 * 📌 관심 탭
 * 관심 책방 조회, 북마크 업데이트
 */
router.get('/interest', AuthMiddleware.checkToken, mainController.showInterest);
router.put('/interest/:bookstoreIdx', AuthMiddleware.checkToken, mainController.updateBookmark);

/**
 * 📌 내 정보 탭
 * 내 정보 조회, 내가 쓴 후기 조회, 작성, 최근 본 책방 조회
 */
router.get('/mypage', AuthMiddleware.checkToken, mainController.showMypage);
router.get('/mypage/review', AuthMiddleware.checkToken, mainController.showMyReview);
router.post('/detail/review', AuthMiddleware.checkToken, mainController.writeReview);
router.get('/recent', AuthMiddleware.checkToken, mainController.showRecent);

/** 
 * 📌 검색 기능
 */
router.get('/search/:keyword', AuthMiddleware.checkToken, mainController.search);

// update bookstore profile image
router.post('/profile/:bookstoreIdx', AuthMiddleware.checkToken, upload.single('profile'), mainController.updateProfile);
module.exports = router;