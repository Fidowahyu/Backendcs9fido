const storeRepository = require("../repository/store.repository");
const baseResponse = require("../utils/baseResponse.util");

exports.getAllStores = async (req, res) => {
  try {
    const stores = await storeRepository.getAllStores();
    return baseResponse(
      res,
      true,
      200,
      "Stores retrieved successfully",
      stores
    );
  } catch (error) {
    return baseResponse(res, false, 500, "Error retrieving stores", error);
  }
};

exports.createStore = async (req, res) => {
  if (!req.body.name || !req.body.address) {
    return baseResponse(res, false, 400, "Name and address are required");
  }

  try {
    const store = await storeRepository.createStore(req.body);
    return baseResponse(res, true, 201, "Store created", store);
  } catch (error) {
    return baseResponse(res, false, 500, "Error creating store", error);
  }
};

exports.getStoreById = async (req, res) => {
  try {
    if (!req.params.id) {
      return baseResponse(res, false, 400, "Store ID is required");
    }
    console.log(req.params.id);
    const store = await storeRepository.getById(req.params.id);
    if (!store) {
      return baseResponse(res, false, 404, "Store not found", null);
    }
    return baseResponse(res, true, 200, "Store retrieved successfully", store);
  } catch (error) {
    return baseResponse(res, false, 500, "Error retrieving store", error);
  }
};

exports.updateStore = async (req, res) => {
  if (!req.body.id) {
    return baseResponse(res, false, 400, "Store ID is required");
  }
  try {
    const store = await storeRepository.getById(req.body.id);
    if (!store) {
      return baseResponse(res, false, 404, "Store not found", null);
    }
    await storeRepository.updateStore(req.body.id, req.body);
    return baseResponse(res, true, 200, "Store updated successfully", store);
  } catch (error) {
    return baseResponse(res, false, 500, "Error updating store", null);
  }
};

exports.deleteStore = async (req, res) => {
  if (!req.params.id) {
    return baseResponse(res, false, 400, "Store ID is required");
  }

  try {
    const store = await storeRepository.deleteById(req.params.id);

    if (!store) {
      return baseResponse(res, false, 404, "Store not found", null);
    }

    return baseResponse(res, true, 200, "Store deleted successfully", store);
  } catch (error) {
    return baseResponse(res, false, 500, "Error deleting store", error);
  }
};
