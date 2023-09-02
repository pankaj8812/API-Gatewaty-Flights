const { StatusCodes } = require('http-status-codes');

const { UserRepository, RoleRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const {Auth, Enums} = require("../utils/common");

const userRepository = new UserRepository();
const roleRepository = new RoleRepository();

async function createUser(data){
    try{
        const user = await userRepository.create(data);
        const role = await roleRepository.getRoleByName(Enums.USER_ROLES_ENUMS.CUSTOMER);
        user.addRole(role);
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
        const user = await userRepository.getUserByEmail(data.email);
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
        const user = await userRepository.get(response.id);
       
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

async function addRoleToUser(data){
    try {
        const user = await userRepository.get(data.userId);
        if(!user){
            throw new AppError('No user found for the given id', StatusCodes.NOT_FOUND);
        }
        // console.log("User inside service: ",user);
        const adminRole = await roleRepository.getRoleByName(data.role);
        if(!adminRole) {
            throw new AppError('The given role doesnot match with database roles', StatusCodes.NOT_FOUND);
        }
        // console.log("User inside role: ",adminRole)
        user.addRole(adminRole);
        return user.getRole();
    } catch (error) {
        if(error instanceof AppError) throw error;
        console.log(error);
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


async function isAdmin(id){
    try {
        const user = await userRepository.get(id);
        // console.log("Response from isAdmin service :", user);
        if(!user){
            throw new AppError('No user found for the given id', StatusCodes.NOT_FOUND);
        }
        const adminRole = await roleRepository.getRoleByName('admin');
        // console.log("adminRole from isAdmin service:", adminRole);
        if(!adminRole) {
            throw new AppError('No user found for the given role', StatusCodes.NOT_FOUND);
        }

        return user.hasRole(adminRole);
    } catch (error) {
        if(error instanceof AppError) throw error;
        console.log(error);
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createUser,
    signin,
    isAuthenicated,
    isAdmin,
    addRoleToUser,
}
