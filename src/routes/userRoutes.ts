import usersController from '@/controllers/usersController';
import express from 'express';
const usersRoute = express.Router();

usersRoute
  .route('/')
  .get(usersController.getAllUsers)
  .post(usersController.createNewUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

export default usersRoute;
