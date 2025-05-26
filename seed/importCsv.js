const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const db = require("../models");
const Compound = db.compound;

async function importData() {
  await db.sequelize.sync({ force: true }); // Drops and recreates tables

  const results = [];

  fs.createReadStream(path.join(__dirname, "../data/compound.csv"))
    .pipe(csv())
    .on("data", (data) => {
      results.push({
        name: data.name,
        image: data.image,
        description: data.description
      });
    })
    .on("end", async () => {
      try {
        await Compound.bulkCreate(results);
        console.log("CSV data imported successfully.");
        process.exit(0);
      } catch (err) {
        console.error("Import failed:", err);
        process.exit(1);
      }
    });
}

importData();
