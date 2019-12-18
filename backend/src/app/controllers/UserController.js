import * as Yup from 'yup';

import User from '../models/Users';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
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

    const { name, email } = await User.create(req.body);

    return res.json({
      name,
      email,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string(),
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
      return res.status(400).json({ error: 'validations fails' });
    }

    //const { oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (req.body.email) {
      if (req.body.email !== user.email) {
        const userExist = await User.findOne({
          where: { email: req.body.email },
        });

        if (userExist) {
          return res.status(401).json({ error: 'User alredy exist.' });
        }
      }
    }

    if (req.body.oldPassword && !(await user.checkPassword(req.body.oldPassword))) {
      return res.status(401).json({ error: 'Password does not match.' });
    }
     //Verificar se oldPassword e o novo password são iguais, caso sejam
     //dar erro e forçar usuario a escolher uma nova senha.
    const { name, email } = await user.update(req.body);

    return res.json({
      name,
      email,
    });
  }
}

export default new UserController();
