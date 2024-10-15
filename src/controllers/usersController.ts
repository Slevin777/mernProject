import User from '@/models/User';
import Note from '@/models/Note';
import { User as IUser } from '@interfaces/usersInterface';
import bcrypt from 'bcrypt';
import expressAsyncHandler from 'express-async-handler';
import { Request, Response } from 'express';

// @desc Get all users
// @route GET /users
// @access Private

const getAllUsers = expressAsyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const users: IUser[] = await User.find().select('-password').lean();
  if (!users.length) {
    res.status(400).json({ message: 'No users found' });
  } else {
    res.json(users);
  }
});

// @desc Create new user
// @route POST /users
// @access Private

const createNewUser = expressAsyncHandler(async (req, res): Promise<void> => {
  const { username, password, roles } = req.body;

  //Confirm data
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    res.status(400).json({ message: 'All fields are required' });
    return;
  }

  // Check for duplicates
  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate) {
    res.status(409).json({ message: 'Duplicate username' });
    return;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const userObject = {
    username,
    password: hashedPassword,
    roles,
  };

  //Create and store new user
  const user = await User.create(userObject);

  if (user) {
    res.status(201).json({ message: `New user ${username} created` });
  } else {
    res.status(400).json({ message: 'Invalid user data received' });
  }
});

// @desc Update a user
// @route PATCH /users
// @access Private

const updateUser = expressAsyncHandler(async (req, res): Promise<void> => {
  const { id, username, roles, active, password } = req.body;

  //Confirm data
  if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
    res.status(400).json({ message: 'All field are required' });
    return;
  }

  const user = await User.findById(id).exec();
  if (!user) {
    res.status(400).json({ message: 'User not found' });
    return;
  }

  //Check for duplicate
  const duplicateUser = await User.findOne({ username }).lean().exec();
  //Allow updates to the original user
  if (duplicateUser && duplicateUser._id.toString() !== id) {
    res.status(409).json({ message: 'Duplicate username' });
    return;
  }

  user.username = username;
  user.roles = roles;
  user.active = active;

  if (password) {
    // Hash password
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await user.save();

  res.json({ message: `${updatedUser.username} updated` });
});

// @desc Delete a user
// @route DELETE /users
// @access Private

const deleteUser = expressAsyncHandler(async (req, res): Promise<void> => {
  const { id } = req.body;

  if (!id) {
    res.status(400).json({ message: 'User ID is required' });
    return;
  }

  const note = await Note.findOne({ user: id }).lean().exec();

  if (note) {
    res.status(400).json({ message: 'User has assigned notes' });
    return;
  }

  const user = await User.findById(id).exec();

  if (!user) {
    res.status(400).json({ message: 'User not found' });
    return;
  }

  await User.deleteOne();

  const reply = `Username ${user?.username} with ID ${user?._id} has been deleted`;

  res.json(reply);
});

export default {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
