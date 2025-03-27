const transactionRepository = require("../repository/transaction.repository");
const itemRepository = require("../repository/item.repository");
const userRepository = require("../repository/user.repository");
const baseResponse = require("../utils/baseResponse.util");

exports.createTransaction = async (req, res) => {
  if (req.body.quantity <= 0) {
    return baseResponse(
      res,
      false,
      400,
      "Quantity must be larger than 0",
      null
    );
  }

  try {
    const item = await itemRepository.getItemById(req.body.item_id);
    if (!item) {
      return baseResponse(res, false, 404, "Item not found", null);
    }
    const transaction = await transactionRepository.createTransaction({
      user_id: req.body.user_id,
      item_id: req.body.item_id,
      quantity: req.body.quantity,
      total: item.price * req.body.quantity,
    });
    return baseResponse(res, true, 201, "Transaction created", transaction);
  } catch (error) {
    console.log(error);
    return baseResponse(res, false, 500, "Error creating transaction", error);
  }
};

exports.payTransaction = async (req, res) => {
  const transaction = await transactionRepository.getTransactionById(
    req.params.id
  );

  if (!transaction) {
    return baseResponse(res, false, 404, "Transaction not found", null);
  }
  const item = await itemRepository.getItemById(transaction.item_id);
  const user = await userRepository.getUserById(transaction.user_id);

  if (!user) {
    return baseResponse(res, false, 404, "User not found", null);
  }
  if (!item) {
    return baseResponse(res, false, 404, "Item not found", null);
  }

  if (transaction.status === "paid") {
    return baseResponse(res, false, 400, "Transaction already paid", null);
  } else if (user.balance < item.price * req.body.quantity) {
    return baseResponse(res, false, 400, "Not enough balance", null);
  } else if (item.stock < req.body.quantity) {
    return baseResponse(res, false, 400, "Not enough stock", null);
  }

  try {
    const transaction = await transactionRepository.payTransaction(
      req.params.id
    );
    if (!transaction) {
      return baseResponse(res, false, 404, "Transaction not found", null);
    }
    const updatedUser = await userRepository.updateUser(
      transaction.user_id,
      user.balance - item.price * transaction.quantity
    );
    if (!updatedUser) {
      return baseResponse(res, false, 404, "User not found", null);
    }
    const updatedItem = await itemRepository.updateItem(
      transaction.item_id,
      item.stock - transaction.quantity
    );
    if (!updatedItem) {
      return baseResponse(res, false, 404, "Item not found", null);
    }
    return baseResponse(res, true, 200, "Payment Successfull", transaction);
  } catch (error) {
    console.log(error);
    return baseResponse(res, false, 500, "Failed to pay", error);
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await transactionRepository.deleteTransaction(
      req.params.id
    );
    if (!transaction) {
      return baseResponse(res, false, 404, "Transaction not found", null);
    }
    return baseResponse(res, true, 200, "Transaction deleted", transaction);
  } catch (error) {
    console.log(error);
    return baseResponse(res, false, 500, "Error deleting transaction", error);
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await transactionRepository.getTransactionById(
      req.params.id
    );
    if (!transaction) {
      return baseResponse(res, false, 404, "Transaction not found", null);
    }
    return baseResponse(res, true, 200, "Transaction found", transaction);
  } catch (error) {
    console.log(error);
    return baseResponse(res, false, 500, "Error getting transaction", error);
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await transactionRepository.getAllTransactions();

    const formattedTransactions = transactions.map((transaction) => {
      return {
        id: transaction.transaction_id,
        user_id: transaction.user_id,
        item_id: transaction.item_id,
        quantity: transaction.quantity,
        total: transaction.total,
        status: transaction.status,
        created_at: transaction.transaction_created_at,
        user: {
          id: transaction.user_id,
          name: transaction.user_name,
          email: transaction.user_email,
          password: transaction.user_password,
          balance: transaction.user_balance,
          created_at: transaction.user_created_at,
        },
        item: {
          id: transaction.item_id,
          name: transaction.item_name,
          price: transaction.item_price,
          store_id: transaction.item_store_id,
          image_url: transaction.item_image_url,
          stock: transaction.item_stock,
          created_at: transaction.item_created_at,
        },
      };
    });

    return baseResponse(
      res,
      true,
      200,
      "Transactions found",
      formattedTransactions
    );
  } catch (error) {
    console.log(error);
    return baseResponse(res, false, 500, "Error getting transactions", error);
  }
};
