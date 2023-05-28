import bcrypt from 'bcrypt';
import express from 'express';
import userSchema from '../mongodb/models/user.js';
import jwt from 'jsonwebtoken';
// User registration route
const router = express.Router();

router.route('/register').post(async(req,res) =>{
    try {
        const { username, password,email,mobile } = req.body;
        const saltRounds = 10;
        await bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            userSchema.create({ username:username, password: hash,email: email,mobile:mobile});
            res.status(201).json({ message: 'User created successfully' });
        }
        });
    } catch (error) {       
        res.status(400).send({message: error})
    }
})

// User login route
router.route('/login').post(async(req, res) => {
    const { username, password } = req.body;
    const user = await userSchema.findOne({username:username});
    console.log(user);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
    } else {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
        //   console.error(user);
          res.status(500).json({ error: 'Internal Server Error' });
        } else if (!result) {
          res.status(401).json({ error: 'Authentication failed' });
        } else {
          const token = jwt.sign({ username }, 'secret_key');
          res.status(200).json({ token });
        }
      });
    }
  });

  export default router;