const { StatusCodes } = require('http-status-codes');

const { UserRespository } = require("../repositories");
const AppError = require("../utils/errors/app-error");

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

// async function getCity(id){
//     try {
//         const city = await cityRespository.get(id);
//         return city;
//     } catch (error) {
//         if(error.statusCode == StatusCodes.NOT_FOUND) {
//             throw new AppError('The city you requested is not present', error.statusCode);
//         }
//         throw new AppError('Cannot fetch data of the city', StatusCodes.INTERNAL_SERVER_ERROR);
//     }
// }

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
    // getCities,
    // getCity,
    // destroyCity,
    // updateCity
}
