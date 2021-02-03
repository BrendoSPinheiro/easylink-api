const yup = require('yup');

const CategoryRepository = require('../repositories/CategoryRepository');

class CategoryController {
  async index(request, response) {
    const categories = await CategoryRepository.findAll();

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

    const categoryExists = await CategoryRepository.findByName(name);
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
}

module.exports = new CategoryController();
