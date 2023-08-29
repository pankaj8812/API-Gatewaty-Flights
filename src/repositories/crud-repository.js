const { Logger } = require("../config");
const { error } = require("../utils/common/error-response");
const AppError = require('../utils/errors/app-error');
const {StatusCodes} = require('http-status-codes');

class CrudRepository{
    constructor(model){
        this.model = model;
        console.log("Model name :", this.model);
    }

    async create(data){    
        //console.log("inside Repo create folder");
        console.log(data);
        const response = await this.model.create(data);
        return response;
    }
  
    async destroy(data){
        const response = await this.model.destroy({
            where: {
              id: data
            }
        });
        return response;
    }

    async get(data){
        const response = await this.model.findByPk(data);
        if(!response) {
            throw new AppError('Not able to fund the resource', StatusCodes.NOT_FOUND);
        }
        return response;
    }

    async getAll(){
            const response = await this.model.findAll();
            return response;
    }

    async update(id, data){    // data -> {col: value, ....}
        const response = await this.model.update(data, {
            where: {
                id: id
            }
        });
        // console.log(response, typeof(response));
        if(response == 0) {
            throw new AppError('Not able to fund the resource', StatusCodes.NOT_FOUND);
        }
        return response;
    }

}

module.exports = CrudRepository;