const express = require("express");
const cors = require("cors");
const { v4, validate } = require('uuid');

const { findIndex } = require('./utils');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateId(req, res, next) {
  const { id } = req.params

  if (!validate(id)) {
      return res.status(400).json({ error: "Invalid Id" })
  }

  return next();
};

app.use("/repositories/:id", validateId)
app.use("/repositories/:id/like", validateId)

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = { id: v4(), title, url, techs, likes: 0 };

  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repositoryIndex = findIndex(repositories, id);

  if (repositoryIndex.error) {
    return response.status(400).json({ error: repositoryIndex.error });
  }
  
  const newRepository = {
    id,
    title,
    url,
    techs
  }

  newRepository.likes = repositories[repositoryIndex.index].likes;
  repositories[repositoryIndex.index] = newRepository;

  return response.json(newRepository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = findIndex(repositories, id)

  if (repositoryIndex.error) {
    return response.status(400).json({ error: repositoryIndex.error });
  }
  
  repositories.splice(repositoryIndex.index);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = findIndex(repositories, id);

  if (repositoryIndex.error) {
    return response.status(400).json({ error: repositoryIndex.error });
  }
  
  const newRepository = repositories[repositoryIndex.index];
  newRepository.likes++;

  repositories[repositoryIndex.index] = newRepository;

  return response.json(newRepository);
});

module.exports = app;
