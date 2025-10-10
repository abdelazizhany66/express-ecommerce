const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const ApiFeature = require('../utils/apiFeature');

exports.deleteDocument = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete({ _id: id });
    if (!document) {
      next(new ApiError(`No document for this id:${id}`));
    }
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
    res.status(200).json({ data: document });
  });

exports.createDocument = (Model) =>
  asyncHandler(async (req, res) => {
    const newDoc = await Model.create(req.body);
    res.status(200).json({ date: newDoc });
  });

exports.getOneDocument = (Model) =>
  asyncHandler(async (req, res, next) => {
    const subCategory = await Model.findById(req.params.id);
    if (!subCategory) {
      next(new ApiError(`no category for this id:${req.params.id}`, 404));
    }
    res.status(200).json({ date: subCategory });
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
