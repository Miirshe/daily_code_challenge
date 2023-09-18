import express from 'express';
import { delete_user, get_user, get_users, login_user, register_user, update_user } from '../controllers/user_controller.js';
export const user_routes = express.Router()
user_routes.post('/user', register_user)
user_routes.post('/user/login', login_user)
user_routes.get('/users', get_users)
user_routes.get('/user/:id', get_user)
user_routes.delete('/user/:id', delete_user)
user_routes.put('/user/:id', update_user)