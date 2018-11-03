const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const Survey = require('../models/application');
const Question = require('../models/job');
const { classPartialUpdate } = require('../helpers/partialUpdate');
const { ensureLoggedIn, ensureCorrectUser } = require('../middleware/auth');

//Get a list of users
router.get('/', async function (req, res, next) {
  try {
    const users = await User.getUsers();
    return res.json({ users });
  } catch (error) {
    return next(error);
  }
});

//Create a new user
router.post('/', async function (req, res, next) {
  try {
    await User.createUser(req.body);
    const token = await User.authenticate(req.body);
    return res.json({ token });
  } catch (error) {
    return next(error);
  }
});

//Get a user by username
router.get('/:username', async function (req, res, next) {
  try {
    const user = await User.getUser(req.params.username);
    return res.json({ user });
  } catch (error) {
    return next(error);
  }
});

//Update a user
router.patch('/:username', ensureCorrectUser, async function (req, res, next) {
  try {
    let user = await User.getUser(req.params.username);
    user.updateFromValues(req.body);
    await user.save();
    return res.json({ user });
  } catch (error) {
    return next(error);
  }
}
);

//Delete a user
router.delete('/:username', ensureCorrectUser, async function (req, res, next) {
  try {
    const user = await User.getUser(req.params.username);
    const message = await user.deleteUser();
    return res.json({ message });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
