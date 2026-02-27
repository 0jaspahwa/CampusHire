const pool = require('../../config/db')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


exports.register = async({ name, email, password, role}) =>{
    if(!name || !email || !password || !role){
        throw new Error('All fields are required');
    }

    const exisiting = await pool.query(
        'SELECT id FROM users WHERE email =$1',
        [email]
    )

    if(exisiting.rows.length > 0){
        throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const result = await pool.query(
        `INSERT INTO users (name, email, password_hash, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, role`,
        [name, email, hashedPassword, role]
    )

    return result.rows[0]
}

exports.login = async({email, password}) =>{
    if(!email || !password){
        throw new Error("Email and Password is required");
    }

    const result = await pool.query(
        'SELECT * from users WHERE email=$1',
        [email]
    )

    const user = result.rows[0];
    if(!user){
        throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if(!isMatch){
        throw new Error("Invalid password")
    }

    const token  = jwt.sign(
        {id: user.id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '1d'}
    )

    return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  }
}