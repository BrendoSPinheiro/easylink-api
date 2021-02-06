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

    const newUserData = {
      name,
      email,
      password: await bcrypt.hash(password, 8),
    };

    const user = await UserRepository.create(newUserData);

    response.json(user);
  }

  async update(request, response) {
    const { userId } = request;
    const { id } = request.params;
    const { name, email } = request.body;

    const userExists = await UserRepository.findById(id);
    if (!userExists) {
      return response.status(404).json({ error: 'User not found' });
    }

    if (userExists.id !== userId) {
      return response.status(400).json({
        error: 'you are not authorized to update this user',
      });
    }

    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required(),
    });

    if (!await schema.isValid({ name, email })) {
      return response.status(400).json({ error: 'Validation fails' });
    }

    const userByEmail = await UserRepository.findByEmail(email);
    if (userByEmail && userByEmail.id !== id) {
      return response.status(400).json({ error: 'This email already in use' });
    }

    const user = await UserRepository.update(id, { name, email });

    response.json(user);
  }
}

module.exports = new UserController();
