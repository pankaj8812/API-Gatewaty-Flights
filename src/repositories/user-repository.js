const CrudRepository = require("./crud-repository");
const { User } = require('../models');

class UserRespository extends CrudRepository{
    constructor(){
        super(User);
    }
    
}

module.exports = UserRespository;