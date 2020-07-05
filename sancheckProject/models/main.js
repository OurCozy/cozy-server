const mongoose = require('mongoose');

// 스키마 생성, 데이터는 아래 3종류(userName, content, completed)
// (timestamps, collection) => options
// timestamps: 자동으로 생성 날짜와 업데이트 날짜 표시
// collection: 특정 collection에 데이터 입력

/**
 * bookstroreIdx   bookstore   latitude   longitude   
 * location   sectionIdx   hashtag   call   instagram   
 * facebook   blog   homepage   time   
 * dayoff   changeable   acticity   shortIntro
 */
const bookstoreSchema = new mongoose.Schema({
    bookstoreIdx: {type: Number, required: true},
    bookstoreName: {type: String, required: true},
    latitude: {type: Number, required: true},
    longitude: {type: Number, required: true},
    location: {type: String, required: true},
    sectionIdx: {type: Number, required: true},
    hashtag: {type: String},
    call: {type: Number, match: /^\d{2,3}-\d{3,4}-\d{4}$/},
    instagram: {type: String},
    facebook: {type: String},
    blog: {type: String},
    homepage: {type: String},
    time: {type: String, required: true},
    dayoff: {type: String},
    changeable: {type: String, default: '시간 변동 가능'},
    activity: {type: String},
    shortIntro: {type: String},
    description: {type: String, required: true},
    // default 값 설정 가능
    image: {type: String, default: ''},
    bookmark: {type: Number, default: 0}
},
{
    // timestamps: true, // UTC 기준 
    timestamps: {currentTime: () => Date.now() + 3600000 * 9}, // 한국 시간대
    collection: 'bookstores'
}, );

bookstoreSchema.statics.create = function (payload) {
    const bookstore = new this(payload);
    return bookstore.save();
};

bookstoreSchema.statics.showReccommendation = function () {
    return this.find({},{"bookstoreIdx": true, "bookstoreName": true, "location": true});
};

// bookstoreSchema.statics.findOneByTodoid = function (todoId) {
//     // CastError 처리
//     if (mongoose.Types.ObjectId.isValid(todoId))  
//         return this.findOne({"_id":todoId}, {"_id":true, "userName":true, "content":true, "completed":true});
//     else
//         return null;
// };

// bookstoreSchema.statics.findManyByUsername = function (userName) {
//     return this.find({"userName":userName}, {"_id":true, "userName":true, "content":true, "completed":true});
// } 

// bookstoreSchema.statics.updateByTodoid = function (todoid, payload) {
//     return this.findOneAndUpdate({"_id":todoid}, payload, {new: true});
// };

// bookstoreSchema.statics.updateImage = function (todoid, image) {
//     return this.findOneAndUpdate({"_id":todoid}, {"image":image}, {new: true});
// };

// bookstoreSchema.statics.deleteByTodoid = function (todoid) {
//     return this.deleteOne({"_id":todoid});
// };

module.exports = mongoose.model('Todo', bookstoreSchema);
