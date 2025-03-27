const itemRepository = require("../repository/item.repository");
const storeRepository = require("../repository/store.repository");
const baseResponse = require("../utils/baseResponse.util");
const cloudinaryService = require("../utils/cloudinary.util");

exports.createItem = async (req, res) => {
  const store = await storeRepository.getById(req.body.store_id);
  if (!store) {
    return baseResponse(res, false, 404, "Store doesnt exist", null);
  }

  try {
    if (!req.file) {
      return baseResponse(res, false, 400, "No file uploaded", null);
    }

    const imageUrl = await cloudinaryService.uploadImage(
      req.file.buffer,
      `item/${req.file.originalname}`
    );

    const item = await itemRepository.createItem({
      name: req.body.name,
      price: req.body.price,
      store_id: req.body.store_id,
      stock: req.body.stock,
      image: imageUrl,
    });

    return baseResponse(res, true, 201, "Item created", item);
  } catch (error) {
    console.log(error);
    return baseResponse(res, false, 500, "Error uploading image", error);
  }
};

exports.getAllItems = async (req, res) => {
  try {
    const items = await itemRepository.getAllItems();
    return baseResponse(res, true, 200, "Items found", items);
  } catch (error) {
    console.log(error);
    return baseResponse(res, false, 500, "Error retrieving items", error);
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await itemRepository.getItemById(req.params.id);
    if (!item) {
      return baseResponse(res, false, 404, "Item not found", null);
    }
    return baseResponse(res, true, 200, "Item found", item);
  } catch (error) {
    console.log(error);
    return baseResponse(res, false, 500, "Error retrieving item", error);
  }
};

exports.getItemByStoreId = async (req, res) => {
  const store = await storeRepository.getById(req.params.store_id);
  if (!store) {
    return baseResponse(res, false, 404, "Store doesnt exist", null);
  }

  try {
    const items = await itemRepository.getItemByStoreId(req.params.store_id);
    if (!items) {
      return baseResponse(res, false, 404, "Items not found", null);
    }
    return baseResponse(res, true, 200, "Items found", items);
  } catch (error) {
    console.log(error);
    return baseResponse(res, false, 500, "Error retrieving items", error);
  }
};

exports.updateItem = async (req, res) => {
  try {
    const item = await itemRepository.getItemById(req.body.id);
    if (!item) {
      return baseResponse(res, false, 404, "Item not found", null);
    }

    const store = await storeRepository.getById(req.body.store_id);
    if (!store) {
      return baseResponse(res, false, 404, "Store doesnt exist", null);
    }

    if (req.file) {
      const imageUrl = await cloudinaryService.uploadImage(
        req.file.buffer,
        `item/${req.file.originalname}`
      );

      itemRepository
        .updateItem({
          name: req.body.name,
          price: req.body.price,
          store_id: req.body.store_id,
          stock: req.body.stock,
          image: imageUrl,
          id: req.body.id,
        })
        .then((item) => {
          return baseResponse(res, true, 201, "Item updated", item);
        })
        .catch((err) => {
          console.log(err);
          return baseResponse(res, false, 500, "Error updating item", err);
        });
    } else {
      itemRepository
        .updateItem({
          name: req.body.name,
          price: req.body.price,
          store_id: req.body.store_id,
          stock: req.body.stock,
          image: item.image,
          id: req.body.id,
        })
        .then((item) => {
          return baseResponse(res, true, 201, "Item updated", item);
        })
        .catch((err) => {
          console.log(err);
          return baseResponse(res, false, 500, "Error updating item", err);
        });
    }
  } catch (error) {
    console.log(error);
    return baseResponse(res, false, 500, "Error updating item", error);
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await itemRepository.getItemById(req.params.id);
    if (!item) {
      return baseResponse(res, false, 404, "Item not found", null);
    }

    const response = await itemRepository.deleteItem(req.params.id);
    return baseResponse(res, true, 200, "Item deleted", response);
  } catch (error) {
    console.log(error);
    return baseResponse(res, false, 500, "Error deleting item", error);
  }
};
