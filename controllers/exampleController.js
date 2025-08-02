const Example = require('../models/example');

const getExamples = async (req, res) => {
  const data = await Example.find();
  res.json(data);
};

module.exports = { getExamples };
