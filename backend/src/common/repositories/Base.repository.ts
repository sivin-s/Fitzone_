//  only "changeable" file for db while switching dbs..

import {injectable} from 'inversify'
import type {
    Model,
    Document,
    QueryFilter,
    UpdateQuery,
    QueryOptions
}  from 'mongoose';

import type {IBaseRepository, PaginatedResult} from '../interfaces/IBaseRepository.interface.ts'
import { string } from 'zod';

// @injectable() -  the abstract class is the KEY (token) that Inversify uses to bind and resolve dependencies.
@injectable()
export abstract class MongoBaseRepository<T extends Document> implements IBaseRepository<T>{
   constructor(protected readonly model: Model<T>){}
   
  async findById(id:string, selectFields?: string):Promise<T | null>{
    const query = this.model.findById(id);
    if(selectFields){
        query.select(selectFields);
    }
    return await query;
  }

  async findOne(
    filter: QueryFilter<T>,
    selectFields?: string
  ): Promise<T | null>{
    const query = this.model.findOne(filter);
    if(selectFields){
        query.select(selectFields);
    }
    return await query;
  }

  async find(
    filter: QueryFilter<T>,
    selectFields?: string,
    options?: QueryOptions
  ):Promise<T[]>{
    const query = this.model.find(filter, null, options);
    if(selectFields){
        query.select(selectFields);
    }
    return await query;
  }

  async countDocuments(filter: QueryFilter<T>): Promise<number>{
    return  this.model.countDocuments(filter).exec();
  }

async findPaginated(
        filter: QueryFilter<T>,
        page: number,
        limit: number,
        selectFields?: string,
        options?: QueryOptions
     ):Promise<PaginatedResult<T>>{

      const MAX_LIMIT = 100;
        if(
            !Number.isSafeInteger(page) ||
            page < 1 ||
            !Number.isSafeInteger(limit) ||
            limit < 1 ||
            limit > MAX_LIMIT
        ){
            throw new RangeError("Page and limit must be positive integers")
        }

        const total = await this.countDocuments(filter)
        const totalPages = Math.ceil(total/limit);
        const currentPages = Math.min(page, Math.max(1,totalPages));

        const items = await this.find(filter,selectFields,{
            ...options,
            skip: (currentPages - 1) * limit,
            limit
        });
        return{
            items,total, page:currentPages, limit, totalPages
        }
     }

     
 
     async create(doc: Partial<T>):Promise<T>{
        return await this.model.create(doc);
     }

     async update(id:string, updateData: UpdateQuery<T>):Promise<T | null>{
        return await this.model.findByIdAndUpdate(id, updateData,{
            new: true,
            runValidators: true
        })
     }
   

     async delete(id: string): Promise<boolean>{
        const result  = await this.model.findByIdAndDelete(id);
        return !!result;
     }




}



