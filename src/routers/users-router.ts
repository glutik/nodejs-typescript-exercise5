import express from 'express';
import store from '../store';
import { User } from '../models';

const router = express.Router();

router.get('/', (req, res) => res.send(store.users));

router.get('/:id(\\d+)', (req, res) => {
  const id = +req.params.id;
  const user = store.users.find(o => o.id === id);
  if (!user) {
    res.sendStatus(404);
    return;
  }
  res.send(user);
});

router.post('/', (req, res) => {
  const user = req.body as User;
  user.id = store.users.length + 1;
  store.users.push(user);
  res.status(201).send(user);
});

router.put('/:id', (req, res) => {
  const id = +req.params.id;
  const user = req.body as User;
  user.id = id;

  const existing = store.users.find(o => o.id === id);
  if (!existing) {
    res.sendStatus(404);
    return;
  }

  Object.assign(existing, user);
  res.send(existing);
});

router.delete('/:id', (req, res) => {
  const id = +req.params.id;
  const existingIndex = store.users.findIndex(o => o.id === id);
  if (existingIndex < 0) {
    res.sendStatus(404);
    return;
  }
  store.users.splice(existingIndex, 1);
  res.sendStatus(204);
});

export default router;
