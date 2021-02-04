const yup = require('yup');

const CategoryRepository = require('../repositories/CategoryRepository');

class CategoryController {
  async index(request, response) {
    const { userId } = request;

    const categories = await CategoryRepository.findAllByUserId(userId);

    response.json(categories);
  }

  async show(request, response) {
    const { id } = request.params;

    const category = await CategoryRepository.findById(id);
    if (!category) {
      return response.status(404).json({ error: 'Category not found' });
    }

    response.json(category);
  }

  async store(request, response) {
    const { userId } = request;
    const { name } = request.body;

    const schema = yup.object().shape({
      name: yup.string().required(),
    });

    if (!await schema.isValid({ name })) {
      return response.status(400).json({ error: 'Validation fails' });
    }

    const categoryExists = await CategoryRepository.findByNameAndUserId(
      name, userId,
    );
    if (categoryExists) {
      return response.status(400).json({ error: 'This name already in use' });
    }

    const newCategoryData = {
      name,
      userId,
    };

    const category = await CategoryRepository.create(newCategoryData);

    response.json(category);
  }

  async update(request, response) {
    const { id } = request.params;
    const { name } = request.body;
    const { userId } = request;

    const categoryExists = await CategoryRepository.findById(id);
    if (!categoryExists) {
      return response.status(404).json({ error: 'Category not found' });
    }

    const schema = yup.object().shape({
      name: yup.string().required(),
    });

    if (!await schema.isValid({ name })) {
      return response.status(400).json({ error: 'Validation fails' });
    }

    const categoryByName = await CategoryRepository.findByNameAndUserId(
      name, userId,
    );
    if (categoryByName) {
      return response.status(400).json({ error: 'This name already in use' });
    }

    const category = await CategoryRepository.update(id, { name });

    response.json(category);
  }
}

module.exports = new CategoryController();
