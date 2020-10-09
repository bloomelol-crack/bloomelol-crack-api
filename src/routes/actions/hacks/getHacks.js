import { HACKS } from './constants';

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res */
export const getHacks = async (req, res) => {
  res.status(200).json({ hacks: HACKS });
};
