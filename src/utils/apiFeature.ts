import { Model, Query ,Document} from "mongoose";
import { Pagination } from "../types/pagination.interface";
import { UrlQuery } from "../types/urlQuery.interface";

export class Api_Feature{
    mongooseQuery: Query<Document[] , Document ,Model<Document> >; 
    queryString: UrlQuery;
    filterQuery: Record<string , any>;
    paginateResult: Partial<Pagination>;

    constructor(mongooseQuery: any, queryString: any) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }

    filter(): this {
        const queryValues:any = { ...this.queryString };
        const expectedQuery:string[] = ["limit", "fields", "page", "keyword", "sort"];
        expectedQuery.forEach(val => delete queryValues[val]);

        let queryStr = JSON.stringify(queryValues);
        queryStr = queryStr.replace(/\b(gte|ge|eq|lt|lte)\b/g, match => `$${match}`)
        
        if (this.queryString.keyword) {
            this.filterQuery = JSON.parse(queryStr);
        } else {
            this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
        }
        return this;
    }
     
    sort(): this {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(",").join(" ");
            this.mongooseQuery = this.mongooseQuery.sort(sortBy);
        }else{
            this.mongooseQuery  = this.mongooseQuery.sort("-createdAt");
        }
        return this;
    }

    limitFields(): this {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(",").join(" ");
            this.mongooseQuery = this.mongooseQuery.select(fields);
        } else {
            this.mongooseQuery = this.mongooseQuery.select("-__v");
        }
        return this;
    }
    
    search(): this {
        if (this.queryString.keyword) {
            this.filterQuery.name = { $regex: this.queryString.keyword, $options: "i" };
            this.mongooseQuery = this.mongooseQuery.find(this.filterQuery);
        }

        return this;
    }

    pagination(documentCount:number): this {
        const page:number = parseInt(this.queryString.page) || 1;
        const limit:number = parseInt(this.queryString.limit) || 6;
        const skip:number = (page - 1) * limit;
        const endPageIndex:number = page * limit;

        const pagination:Partial<Pagination> = {};
        pagination.currentage = page;
        pagination.limit = limit;
        pagination.numberOfPages = Math.ceil(documentCount / limit);
        if (endPageIndex < documentCount) {
            pagination.next = page + 1;
        }

        if (skip > 0) {
            pagination.previous = page - 1;
        }

        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
        this.paginateResult = pagination;
        return this;
    }
}