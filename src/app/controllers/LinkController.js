const yup = require('yup');

const LinkRepository = require('../repositories/LinkRepository');

class LinkController {
  async index(request, response) {
    const { userId } = request;
    const { orderBy } = request.query;

    const links = await LinkRepository.findAllByUserId(userId, orderBy);

    response.json(links);
  }

  async show(request, response) {
    const { id } = request.params;

    const link = await LinkRepository.findById(id);
    if (!link) {
      return response.status(404).json({ error: 'Link not found' });
    }

    response.json(link);
  }

  async store(request, response) {
    const { userId } = request;
    let { title } = request.body;
    const { url, category_id } = request.body;

    const schema = yup.object().shape({
      title: yup.string(),
      url: yup.string().url().required(),
      category_id: yup.string().uuid(),
    });

    if (!await schema.isValid({ title, url, category_id })) {
      return response.status(400).json({ error: 'Validation fails' });
    }

    const linkExists = await LinkRepository.findByUrlAndUserId(url, userId);
    if (linkExists) {
      return response.status(400).json({
        error: 'there is already a link with this url',
      });
    }

    if (!title) {
      title = url;
    }

    const newLinkData = {
      title,
      url,
      category_id,
      userId,
    };

    const link = await LinkRepository.create(newLinkData);

    response.json(link);
  }

  async update(request, response) {
    const { userId } = request;
    const { id } = request.params;
    const { title, url, category_id } = request.body;

    const linkExists = await LinkRepository.findById(id);
    if (!linkExists) {
      return response.status(404).json({ error: 'Link not found' });
    }
    if (linkExists.user_id !== userId) {
      return response.status(400).json({
        error: 'This link belongs to another user',
      });
    }

    const schema = yup.object().shape({
      title: yup.string().required(),
      url: yup.string().url().required(),
      category_id: yup.string().uuid(),
    });

    if (!await schema.isValid({ title, url, category_id })) {
      return response.status(400).json({ error: 'Validation fails' });
    }

    const linkByUrl = await LinkRepository.findByUrlAndUserId(url, userId);
    if (linkByUrl && linkByUrl.id !== id) {
      return response.status(400).json({ error: 'This url already in use' });
    }

    const updatedLink = await LinkRepository.update(id, {
      title, url, category_id,
    });

    response.json(updatedLink);
  }

  async delete(request, response) {
    const { userId } = request;
    const { id } = request.params;

    const linkExists = await LinkRepository.findById(id);
    if (!linkExists) {
      return response.status(404).json({ error: 'Link not found' });
    }
    if (linkExists.user_id !== userId) {
      return response.status(400).json({
        error: 'This link belongs to another user',
      });
    }

    await LinkRepository.delete(id);

    response.sendStatus(204);
  }
}

module.exports = new LinkController();
