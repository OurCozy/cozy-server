const pool = require('../modules/pool');
const table = 'user';

const user = {
    signup: async (nickname, password, salt, email) => {
        const fields = 'nickname, hashed, salt, email';
        const questions = `?, ?, ?, ?`;
        const values = [nickname, password, salt, email];
        const query = `INSERT INTO ${table}(${fields}) VALUES(${questions})`;
        try {
            const result = await pool.queryParamArr(query, values);
            const insertId = result.insertId;
            return insertId;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('signup ERROR : ', err.errno, err.code);
                throw err;
            }
            console.log('signup ERROR : ', err);
            throw err;
        }
    },
    checkUserByName: async (nickname) => {
        const query = `SELECT * FROM ${table} WHERE nickname = '${nickname}';`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('checkUser ERROR : ', err.errno, err.code);
                throw err;
            }
            console.log('checkUser ERROR : ', err);
            throw err;
        }
    },
    checkUserByEmail: async (email) => {
        const query = `SELECT * FROM ${table} WHERE email = '${email}';`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('checkUser ERROR : ', err.errno, err.code);
                throw err;
            }
            console.log('checkUser ERROR : ', err);
            throw err;
        }
    },
    // getUserByIdx: async (userIdx) => {
    //     const query = `SELECT * FROM ${table} WHERE userIdx = ${userIdx}`;
    //     // query문 작성
    //     // pool module로 전달해서 결과값 받기
    //     // return await pool.queryParamArr(query, [id]);
    //     // try - catch로 ERROR 받기
    //     try {
    //         return await pool.queryParam(query);
    //     } catch (err) {
    //         if (err.errno == 1062) {
    //             console.log('getUserByIdx ERROR : ', err.errno, err.code);
    //             throw err;
    //         }
    //         console.log('getUserByIdx ERROR : ', err);
    //         throw err;
    //     }
    // }
}

module.exports = user;