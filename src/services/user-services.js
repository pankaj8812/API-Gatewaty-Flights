const { StatusCodes } = require('http-status-codes');

const { UserRespository } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const {Auth} = require("../utils/common")
const userRespository = new UserRespository();

async function createUser(data){
    try{
        const user = await userRespository.create(data);
        return user;
    }catch(error){
        console.log(error);
        if(error.name == 'SequelizeValidationError' || error.name == 'SequelizeUniqueConstraintError'){
            let explanation = [];
            error.errors.forEach( (err) => {
                explanation.push(err.message);
            });
            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot create a new User object', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

// async function getCities(){
//     try {
//         const cities = await cityRespository.getAll();
//         return cities;
//     } catch (error) {
//         throw new AppError('Cannot fetch data of all the cities', StatusCodes.INTERNAL_SERVER_ERROR);
//     }
// }

async function signin(data){
    try {
        const user = await userRespository.getUserByEmail(data.email);
        console.log("USer :",user)
        if(!user) {
            throw new AppError('No user found for the given email', StatusCodes.NOT_FOUND);
        }

        const passwordMatch = Auth.checkPassword(data.password, user.password);

        if(!passwordMatch){
            throw new AppError('Invalid password', StatusCodes.BAD_REQUEST);
        }

        const jwt = Auth.createToken({id: user.id, email: user.email});
        return jwt;
    } catch (error) {
        if(error instanceof AppError) throw error;
        console.log(error);
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

// async function destroyCity(id){
//     try {
//         const response = await cityRespository.destroy(id);
//         return response;
//     } catch (error) {
//         console.log(error);
//         if(error.statusCode == StatusCodes.NOT_FOUND) {
//             throw new AppError('The city you requested to delete is not present', error.statusCode);
//         }
//         throw new AppError('Cannot fetch data of  the city', StatusCodes.INTERNAL_SERVER_ERROR);
//     }
// }

// async function updateCity(id, data){
//     try {
//         const city = await cityRespository.update(id, data);
//         return city;
//     } catch (error) {
//         if(error.statusCode == StatusCodes.NOT_FOUND) {
//             throw new AppError('The city you requested to update is not present', error.statusCode);
//         }
//         if(error.name == 'SequelizeValidationError' || error.name == 'SequelizeUniqueConstraintError'){
//             let explanation = [];
//             error.errors.forEach( (err) => {
//                 explanation.push(err.message);
//             });
//             throw new AppError(explanation, StatusCodes.BAD_REQUEST);
//         }
//         throw new AppError('Cannot update the data of the city', StatusCodes.INTERNAL_SERVER_ERROR);
//     }
// }


module.exports = {
    createUser,
    signin,
    // getCities,
    // getCity,
    // destroyCity,
    // updateCity
}
