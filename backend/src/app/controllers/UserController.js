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
      confirmPassword: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fail' });
    }

    const userExist = await User.findOne({ where: { email: req.body.email } });

    if (userExist) {
      return res.status(400).json({ error: 'user alredy exist' });
    }

    if (req.body.password !== req.body.confirmPassword) {
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

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'validation fail' });
    }

    const { name, email, oldPassword, password } = req.body;

    const user = await User.findByPk(req.UserId);

    if(email !== user.email){
      const userExist = await User.findOne({ where: { email }})

      if(userExist) {
        return res.status(401).json({error: 'user alredy exist'});
      }
    }

    if(oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'password does not match' })
    }

    await user.update(req.body);

    return res.json({
      name,
      email,
    })
  }
}

export default new UserController();