const util = require('../modules/util');
const CODE = require('../modules/statusCode');
const MSG = require('../modules/resMessage');
const ImageModel = require('../models/user');

module.exports={
    updateImages: async(req, res)=>{
        const bookstoreIdx=req.params.bookstoreIdx;
        let imageLocations=[];
        for(var i=0;i<3;i++){
            imageLocations[i]=req.files[i].location;
        }
        const result=await ImageModel.updateProfile(bookstoreIdx, imageLocations);
        res.status(CODE.OK)
        .send(util.success(CODE.OK, MSG.UPDATE_PROFILE_SUCCESS, result));
    }
};