import * as Yup from 'yup';

import User from '../models/Users';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
      password: Yup.string()
        .required()
        .min(6),
      confirm_password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fail' });
    }

    const userExist = await User.findOne({ where: {email: req.body.email }});

    if (userExist) {
      return res.status(400).json({ error: 'user alredy exist' });
    }

    if (req.body.password !== req.body.confirm_password) {
      return res
        .status(401)
        .json({ error: 'password and confirm password are not the same' });
    }

    const { name, email, password } = await User.create(req.body);

    return res.json({
      name,
      email,
    });
  }
}

export default new UserController();
