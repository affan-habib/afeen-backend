import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../../Models/userModel.js';
//Registering a new User

export const registerUser = async (req, res) => {
  const { userName, password, firstName, lastName } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password, salt);

  const newUser = new UserModel({
    userName,
    password: hashedPass,
    firstName,
    lastName
  });
  try {
    const user = await newUser.save();

    const token = jwt.sign(
      {
        userName: user.userName,
        id: user._id
      },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { userName, password } = req.body;
  try {
    const user = await UserModel.findOne({ userName: userName });
    if (user) {
      const validity = await bcrypt.compare(password, user.password);

      if (!validity) {
        res.status(400).json('Wrong Password');
      } else {
            const token = jwt.sign(
              {
                userName: user.userName,
                id: user._id
              },
              process.env.JWT_KEY,
              { expiresIn: '1h' }
            );

            res.status(200).json({ user, token });
      }
    } else {
      res.status(404).json('user dose not exists');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
