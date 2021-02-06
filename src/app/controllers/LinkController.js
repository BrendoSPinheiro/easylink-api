const yup = require('yup');

const LinkRepository = require('../repositories/LinkRepository');

class LinkController {
  async index(request, response) {
    const { userId } = request;

    const links = await LinkRepository.findAllByUserId(userId);

    response.json(links);
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
}

module.exports = new LinkController();
