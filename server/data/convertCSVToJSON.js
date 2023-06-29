const fs = require('fs');
const csv = require('csv-parser');

function convertCSVToJSON(csvFilePath) {
  return new Promise((resolve, reject) => {
    const pokemonData = [];

    fs.createReadStream(csvFilePath)
      .pipe(csv({ headers: false }))
      .on('data', (row) => {
        const name = row[0].trim();
        const hp = parseInt(row[1]);
        const attack = parseInt(row[2]);
        const defense = parseInt(row[3]);
        const type = row[4].trim();

        pokemonData.push({
          name,
          hp,
          attack,
          defense,
          type
        });
      })
      .on('end', () => {
        resolve(pokemonData);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

module.exports = {
  convertCSVToJSON
};