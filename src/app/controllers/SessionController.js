const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const yup = require('yup');

const UserRepository = require('../repositories/UserRepository');

class SessionController {
  async authenticate(request, response) {
    const { email, password } = request.body;

    const schema = yup.object().shape({
      email: yup.string().email().required(),
      password: yup.string().required().min(6),
    });

    if (!await schema.isValid({ email, password })) {
      return response.status(400).json({ error: 'Validation fails' });
    }

    const user = await UserRepository.findByEmail(email);
    if (!user) {
      return response.status(401).json({ error: 'Invalid Email' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return response.status(401).json({ error: 'Invalid Password' });
    }

    const token = jwt.sign({
      id: user.id,
    }, process.env.JWT_SECRET, { expiresIn: '1d' });

    delete user.password;

    response.json({
      user,
      token,
    });
  }
}

module.exports = new SessionController();
