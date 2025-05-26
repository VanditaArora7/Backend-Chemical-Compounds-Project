const db = require("../models");
const Compound = db.compound;
const { Op } = require("sequelize");

// GET: paginated compounds
exports.getAll = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  try {
    const data = await Compound.findAndCountAll({ limit, offset });
    res.json({
      totalItems: data.count,
      totalPages: Math.ceil(data.count / limit),
      currentPage: page,
      compounds: data.rows
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET: single compound by ID
exports.getOne = async (req, res) => {
  try {
    const compound = await Compound.findByPk(req.params.id);
    if (!compound) return res.status(404).json({ message: "Compound not found" });
    res.json(compound);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT: update compound
exports.update = async (req, res) => {
  const id = req.params.id;

  if (!req.body.name || !req.body.image || !req.body.description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const [updated] = await Compound.update(req.body, { where: { id } });
    if (updated) {
      const updatedCompound = await Compound.findByPk(id);
      res.json(updatedCompound);
    } else {
      res.status(404).json({ message: "Compound not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

};
exports.upload = async (req, res) => {
  const { name, image, description } = req.body;

  if (!name || !image || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newCompound = await Compound.create({ name, image, description });
    res.status(201).json(newCompound);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
