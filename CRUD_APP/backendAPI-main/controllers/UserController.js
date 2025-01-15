import { mongoHelper } from "../helpers/MongoHelper.js";
import { ObjectId } from 'mongodb';
import { error_response, custom_response, create_response } from "../helpers/Response.js";
import { createJwtToken } from "../utils/Token.js";
import bcrypt from "bcryptjs"; // Usando bcryptjs
import fs from "fs";

// Función para validar email (asumiendo que tienes esta función)
const email_format = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? true : "Invalid email format";
};

// user sign up function
export const sign_up = async (req, res) => {
    const { full_name, email, password } = req.body;
    if (!full_name || !email || !password) return error_response(`All fields are required!`, res);
    
    let s_validEmail = email_format(email);
    if (s_validEmail !== true) return error_response(s_validEmail, res);

    try {
        // Verificar si el email ya existe
        const existEmail = await mongoHelper.findOne('users', { email: email });
        if (existEmail) return error_response('Email already exist', res);

        const passwd = bcrypt.hashSync(password, 8);
        const userData = await mongoHelper.insertOne('users', {
            full_name,
            email,
            password: passwd,
            membership: 'None',
            profile_image: 'default_profile_image.jpg',
            banner_image:  'default_banner_image.png'
        });

        let sendData = {
            id: userData.insertedId,
            email: email,
            full_name: full_name,
            membership: 'None',
            profile_image: 'default_profile_image.jpg',
            banner_image:  'default_banner_image.png'
        };
        return custom_response(sendData, 'SignUp Successfully', res);
    } catch (error) {
        console.log(error);
        return error_response(error?.message, res);
    }
};

// user sign in function
export const sign_in = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return error_response(`All fields are required!`, res);

    let s_validEmail = email_format(email);
    if (s_validEmail !== true) return error_response(s_validEmail, res);

    try {
        const userData = await mongoHelper.findOne('users', {
            email: { $regex: new RegExp(`^${email}$`, 'i') }
        });

        if (!userData) return error_response('user not found', res);

        const result = bcrypt.compareSync(password.trim(), userData.password);
        if (!result) return error_response("Password not Matched!", res);

        let sendData = {
            id: userData._id,
            email: email,
            full_name: userData.full_name,
            membership: userData.membership,
            profile_image: userData.profile_image ? `${process.env.HTTPURL}uploads/profile_image/${userData.profile_image}` : null,
            banner_image: userData.banner_image ? `${process.env.HTTPURL}uploads/banner_image/${userData.banner_image}` : null
        };
        return custom_response(sendData, 'Login successfully!', res);
    } catch (error) {
        console.log(error);
        return error_response(error?.message, res);
    }
};
