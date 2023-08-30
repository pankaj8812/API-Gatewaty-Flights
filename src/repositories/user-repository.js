const CrudRepository = require("./crud-repository");
const { User } = require('../models');

class UserRespository extends CrudRepository{
    constructor(){
        super(User);
    }
    
    async getUserByEmail(email){
        const user = await User.findOne( { where: { email: email } } );
        return user;
    }
}

module.exports = UserRespository;