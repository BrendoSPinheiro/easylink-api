const LinkRepository = require('../repositories/LinkRepository');

class LinkController {
  async store(request, response) {
    response.send('Estou no link controller');
  }
}

module.exports = new LinkController();
