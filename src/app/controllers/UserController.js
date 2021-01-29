const bcrypt = require('bcryptjs');
const yup = require('yup');

const UserRepository = require('../repositories/UserRepository');

class UserController {
  async store(request, response) {
    const { name, email, password } = request.body;

    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required(),
      password: yup.string().required().min(6),
    });

    if (!await schema.isValid({ name, email, password })) {
      return response.status(400).json({ error: 'Validation fails' });
    }

    const userExists = await UserRepository.findByEmail(email);
    if (userExists) {
      return response.status(400).json({ error: 'This email already in use' });
    }

    const data = {
      name,
      email,
      password: await bcrypt.hash(password, 8),
    };

    const user = await UserRepository.create(data);

    response.json(user);
  }
}

module.exports = new UserController();
