const secret_key = '2a13c2fe6da4bfe7789e90709195722f1d21bff8243dc9fef7a5437a952d2ce40d90af5d8e65632a141dab6061f3c7aed086053fe4859caefbce0651dff1f0c0'
import jwt from "jsonwebtoken";
import { userModel } from "../model/user_model.js";
import bcrypt from 'bcrypt';
export const register_user = async(req, res) => {
    try {
        const { username, email, password } = req.body;
        const user_exists = await userModel.findOne({
                $or: [
                    { username },
                    { email }
                ]
            })
            // ({ $or: [{ username }, { email }] })
        if (user_exists) {
            return res.status(400).json({
                status: false,
                message: 'email Or username already exists'
            })
        }
        const hasspassword = await bcrypt.hash(password, 10);
        const user = await new userModel({
            username: username,
            email: email,
            password: hasspassword
        });

        await user.save().then(() => {
            res.send('sucessfuly registered')
        }).catch((err) => {
            res.json(err.message)
        })

    } catch (error) {
        console.log('error message :', error.message);
        res.status(500).json({
            status: false,
            message: 'Internal Server Error'
        })
    }
}

export const get_users = async(req, res) => {
    try {

        const user = await userModel.find();
        if (!user) {
            return res.status(404).json({
                status: false,
                message: 'Users Not Found '
            })
        }
        res.status(200).json(user)

    } catch (error) {
        console.log('error', error.message);
        return res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

export const login_user = async(req, res) => {
    try {

        const { email, password } = req.body;
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(404).json({
                status: false,
                message: 'Invalid username or password',
            });
        }

        const comparepassword = await bcrypt.compare(password, user.password);

        if (!comparepassword) {
            return res.status(404).json({
                status: false,
                message: 'Invalid username or password',
            });
        }


        jwt.sign({ _id: user._id }, secret_key, (error, token) => {
            if (error) {
                return res.status(400).json({
                    status: false,
                    message: error.message
                })
            }

            res.cookie('user_token', token, {
                httpOnly: true,
                secure: false,
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
            res.json({
                token,
                user,
            });
        })

    } catch (error) {
        console.log('error', error.message);
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

export const delete_user = async(req, res) => {
    try {
        const user = await userModel.deleteOne({ _id: req.params.id });

        if (!user) {
            return res.status(404).json({
                status: false,
                message: 'User Not Found ',
            });
        }
        res.send('successfully deleted');

    } catch (error) {
        console.log('error', error.message);
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}
export const get_user = async(req, res) => {
    try {
        const { id } = req.params
        const user = await userModel.findById(id);

        if (!user) {
            return res.status(404).json({
                status: false,
                message: 'User Not Found ',
            });
        }
        res.send(user);

    } catch (error) {
        console.log('error', error.message);
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

export const update_user = async(req, res) => {
    try {

        const { username, email, password } = req.body

        const user = await userModel.updateOne({ _id: req.params.id }, {
            $set: { email: email, password: password, username: username }
        })

        if (!user) {
            res.status(404).json({
                status: false,
                message: 'User Not Updated'
            })
        }

        res.status(200).json({
            status: true,
            message: 'successfully updated'
        })

    } catch (error) {
        console.log('error', error.message);
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}