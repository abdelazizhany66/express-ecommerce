const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const ApiFeature = require('../utils/apiFeature');

exports.deleteDocument = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);
    if (!document) {
      return next(new ApiError(`No document for this id:${req.params.id}`));
    }

    await document.deleteOne();
    res.status(200).json({ data: `it's document ${document.id} is Deleted` });
  });

exports.updateDocument = (Module) =>
  asyncHandler(async (req, res, next) => {
    const document = await Module.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) {
      next(new ApiError(`No document for this id:${req.params.id}`));
    }
    document.save();
    res.status(200).json({ data: document });
  });

exports.createDocument = (Model) =>
  asyncHandler(async (req, res) => {
    const newDoc = await Model.create(req.body);
    res.status(200).json({ date: newDoc });
  });

exports.getOneDocument = (Model, populateOptions) =>
  asyncHandler(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) {
      query = query.populate(populateOptions);
    }
    const document = await query;
    if (!document) {
      next(new ApiError(`no category for this id:${req.params.id}`, 404));
    }
    res.status(200).json({ date: document });
  });

exports.getAllDocs = (Model, modelName = '') =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    const documentCount = await Model.countDocuments();
    const apiFeature = new ApiFeature(Model.find(filter), req.query)
      .filter()
      .sorting()
      .pagination(documentCount)
      .search(modelName)
      .fieldsLimit();
    // Execute query
    const { mongooseQuery, paginationResult } = apiFeature;
    const documents = await mongooseQuery;

    res
      .status(200)
      .json({ result: documents.length, paginationResult, data: documents });
  });
