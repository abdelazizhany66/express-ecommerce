class ApiFeature {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  pagination(countDocuments) {
    // Pagination setup
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 5;
    const skip = (page - 1) * limit;
    const endIndx = page * limit;

    const pagination = {};
    pagination.currnetPage = page;
    pagination.limit = limit;
    pagination.numberOfPages = Math.ceil(countDocuments / limit);

    if (endIndx < countDocuments) {
      pagination.nextPage = page + 1;
    }

    if (skip > 0) {
      pagination.prePage = page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.paginationResult = pagination;
    return this;
  }

  filter() {
    // Filtering
    const queryStringObj = { ...this.queryString };
    const excludeFields = ['page', 'limit', 'fields', 'sort'];
    excludeFields.forEach((field) => {
      delete queryStringObj[field];
    });

    //convert from query form price[gte]=50&price[lte]=100 to price[$gte]=50&price[$lte]=100 becuase query success
    //convert to str becuase is come a obj
    const filters = {};

    Object.keys(queryStringObj).forEach((key) => {
      if (key.includes('[')) {
        // extract field and operator
        const [field, operator] = key.replace(']', '').split('[');
        if (!filters[field]) filters[field] = {};
        filters[field][`$${operator}`] = Number(queryStringObj[key]);
      } else {
        filters[key] = queryStringObj[key];
      }
    });
    return this;
  }

  sorting() {
    //sorting
    if (this.queryString.sort) {
      const soryBy = this.queryString.sort.split(',').join(' ');
      this.mongooseQuery = this.mongooseQuery.sort(soryBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort('-createdAt'); // default
    }
    return this;
  }

  fieldsLimit() {
    if (this.queryString.fields) {
      const fieldsBy = this.queryString.fields.split(',').join(' ');
      this.mongooseQuery = this.mongooseQuery.select(fieldsBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.select('-__v');
    }
    return this;
  }

  search(modelName) {
    //search
    if (this.queryString.keyword) {
      let query = {};
      if (modelName === 'Product') {
        query.$or = [
          { title: { $regex: this.queryString.keyword, $options: 'i' } },
          { description: { $regex: this.queryString.keyword, $options: 'i' } },
        ];
      } else {
        query = { name: { $regex: this.queryString.keyword, $options: 'i' } };
      }
      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }
}

module.exports = ApiFeature;
