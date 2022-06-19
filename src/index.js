const express = require("express");

const { v4: uuid, validate } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function verifyValidUUIDParams(request, response, next) {
  const { id } = request.params;

  const receivedIdIsUUId = validate(id)

  if(!receivedIdIsUUId) {
    return response.status(404).json({ error: "Param is not UUID" });
  }

  return next()
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository)

  return response.json(repository);
});

app.put("/repositories/:id", verifyValidUUIDParams, (request, response) => {
  const { id } = request.params;

  const updatedRepository = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (!repositoryIndex) {
    return response.status(404).json({ error: "Repository not found" });
  }

  const repository = {
    ...repositories[repositoryIndex],
    ...updatedRepository,
    likes: repositories[repositoryIndex].likes
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", verifyValidUUIDParams, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (!repositoryIndex) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", verifyValidUUIDParams, (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id === id);

  if (!repository) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repository.likes += 1

  return response.json(repository);
});

module.exports = app;
