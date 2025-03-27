const userRepository = require("../repository/user.repository");
const baseResponse = require("../utils/baseResponse.util");
const bcrypt = require("bcrypt");

const saltRounds = 10;
const emailRegex = /\S+@\S+\.\S+/;
const passwordRegex = /^(?=.*\d)(?=.*[\W_]).{8,}$/;

exports.userRegister = async (req, res) => {
  if (!emailRegex.test(req.query.email)) {
    return baseResponse(
      res,
      false,
      400,
      "Invalid email, please use a valid email!",
      null
    );
  }
  if (!passwordRegex.test(req.query.password)) {
    return baseResponse(
      res,
      false,
      400,
      "Invalid password, please use a valid password!",
      null
    );
  }
  const user = await userRepository.getUserByEmail(req.query.email);
  if (user) {
    return baseResponse(res, false, 400, "Email already exists", null);
  }

  if (!req.query.name || !req.query.email || !req.query.password) {
    return baseResponse(
      res,
      false,
      400,
      "Name, email, and password are required"
    );
  }

  try {
    const hashedPassword = await bcrypt.hash(req.query.password, saltRounds);
    req.query.password = hashedPassword;
    const user = await userRepository.userRegister(req.query);
    console.log(user);
    return baseResponse(res, true, 201, "User registered", user);
  } catch (error) {
    return baseResponse(res, false, 500, "Error registering user", error);
  }
};

exports.userLogin = async (req, res) => {
  if (!req.query.email || !req.query.password) {
    return baseResponse(res, false, 400, "Email and password are required");
  }

  try {
    const getUser = await userRepository.getUserByEmail(req.query.email);
    if (!getUser) {
      return baseResponse(res, false, 404, "Invalid email", null);
    }

    const isPasswordValid = await bcrypt.compare(
      req.query.password,
      getUser.password
    );

    if (!isPasswordValid) {
      return baseResponse(res, false, 404, "Invalid email or password", null);
    } else {
      req.query.password = getUser.password;
      const user = await userRepository.userLogin(req.query);
      return baseResponse(res, true, 200, "User logged in", user);
    }
  } catch (error) {
    return baseResponse(res, false, 500, "Error logging in", error);
  }
};

exports.getUserByEmail = async (req, res) => {
  if (!req.params.email) {
    return baseResponse(res, false, 400, "Email is required");
  }

  try {
    const user = await userRepository.getUserByEmail(req.params.email);
    if (!user) {
      return baseResponse(res, false, 404, "User not found", null);
    }
    return baseResponse(res, true, 200, "User found", user);
  } catch (error) {
    return baseResponse(res, false, 500, "Error getting user", error);
  }
};

exports.updateUser = async (req, res) => {
  if (!emailRegex.test(req.body.email)) {
    return baseResponse(
      res,
      false,
      400,
      "Invalid email, please use a valid email!",
      null
    );
  }
  if (!passwordRegex.test(req.body.password)) {
    return baseResponse(
      res,
      false,
      400,
      "Invalid password, please use a valid password!",
      null
    );
  }
  const user = await userRepository.getUserByEmail(req.body.email);
  if (!user) {
    return baseResponse(res, false, 400, "User not found!", null);
  }

  if (!req.body.id || !req.body.name || !req.body.email || !req.body.password) {
    return baseResponse(
      res,
      false,
      400,
      "Id, name, email, and password are required"
    );
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    req.body.password = hashedPassword;
    const user = await userRepository.updateUser(req.body.id, req.body);
    return baseResponse(res, true, 200, "User updated", user);
  } catch (error) {
    return baseResponse(res, false, 500, "Error updating user", error);
  }
};

exports.deleteUser = async (req, res) => {
  if (!req.params.id) {
    return baseResponse(res, false, 400, "Id is required");
  }

  try {
    const user = await userRepository.deleteUser(req.params.id);

    if (!user) {
      return baseResponse(res, false, 404, "User not found", null);
    }

    return baseResponse(res, true, 200, "User deleted", user);
  } catch (error) {
    return baseResponse(res, false, 500, "Error deleting user", error);
  }
};

exports.userTopUp = async (req, res) => {
  if (req.query.amount <= 0) {
    return baseResponse(res, false, 400, "Amount must be greater than 0", null);
  }
  try {
    const topUp = await userRepository.userTopUp(
      req.query.id,
      req.query.amount
    );
    return baseResponse(res, true, 200, "Topup successfully", topUp);
  } catch (error) {
    return baseResponse(res, false, 500, "Error topping up balance", error);
  }
};
