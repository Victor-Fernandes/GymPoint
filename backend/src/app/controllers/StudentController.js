import * as Yup from 'yup';

import Students from '../models/Students';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number()
        .positive()
        .required(),
      weight: Yup.number()
        .positive()
        .required(),
      height: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fail' });
    }

    const userExist = await Students.findOne({
      where: { email: req.body.email },
    });

    if (userExist) {
      return res.status(401).json({ error: 'User alredy exist.' });
    }

    const { name, email, age, weight, height } = await Students.create(
      req.body
    );

    return res.json({
      name,
      email,
      age,
      weight,
      height,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      age: Yup.number().positive(),
      weight: Yup.number().positive(),
      height: Yup.number().positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fail' });
    }

    const { id, email } = req.body;

    const student = await Students.findByPk(id);

    if (email !== student.email) {
      const userExist = await Students.findOne({ where: { email } });

      if (userExist) {
        return res.status(401).json({ error: 'Student alredy exist' });
      }
    }

    await student.update(req.body);

    return res.json({
      student,
    });
  }
}

export default new StudentController();
