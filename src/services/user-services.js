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


async function isAuthenicated(token){
    try {
        if(!token){
            throw new AppError('Missing JWT token', StatusCodes.BAD_REQUEST);
        }

        const response = Auth.verifyToken(token);
        const user = await userRespository.get(response.id);
       
        if(!user) {
            throw new AppError('No user found', StatusCodes.NOT_FOUND);
        }
        return user.id;
    } catch (error) {
        if(error instanceof AppError) throw error;
        if(error.name == 'JsonWebTokenError') {
            throw new AppError('Invalid JWT token', StatusCodes.BAD_REQUEST);
        }
        if(error.name == 'TokenExpiredError') {
            throw new AppError('JWT token expired', StatusCodes.BAD_REQUEST);
        }
        console.log(error);
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}



module.exports = {
    createUser,
    signin,
    isAuthenicated,
}
