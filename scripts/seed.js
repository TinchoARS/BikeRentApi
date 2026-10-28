const fs = require('node:fs/promises');
const path = require('node:path');
const store = require('../db/categoriesStore');
const validateCategory = require('../validators/category');

const DATA_FILE = path.join(__dirname, '..', 'data', 'categories.json');

// 1) Leer el archivo: es asíncrono, así que se espera con await
async function readCategories() {
  const text = await fs.readFile(DATA_FILE, 'utf8');
  return JSON.parse(text);
}

// 2) Separar las válidas de las inválidas con Joi
function splitValid(items) {
  const valid = [];
  const invalid = [];
  for (const item of items) {
    const { error, value } = validateCategory(item);
    if (error) invalid.push({ item, reason: error.details[0].message });
    else valid.push(value);
  }
  return { valid, invalid };
}

// 3a) Secuencial: una por vez, espera cada una antes de la siguiente
async function seedSequential(categories) {
  const created = [];
  for (const c of categories) {
    created.push(await store.addCategory(c.name));
  }
  return created;
}

// 3b) En paralelo: lanza todas a la vez y espera a que terminen todas
async function seedParallel(categories) {
  return Promise.all(categories.map(c => store.addCategory(c.name)));
}

async function main() {
  const items = await readCategories();
  const { valid, invalid } = splitValid(items);

  console.log(`Leídas: ${items.length} | válidas: ${valid.length} | inválidas: ${invalid.length}`);
  invalid.forEach(i => console.log(`  - rechazada ${JSON.stringify(i.item)}: ${i.reason}`));

  console.time('secuencial');
  await seedSequential(valid);
  console.timeEnd('secuencial');

  console.time('paralelo');
  await seedParallel(valid);
  console.timeEnd('paralelo');

  const all = await store.getAllCategories();
  console.log(`Total en el store: ${all.length}`);
}

main().catch(err => {
  console.error('Falló el seed:', err.message);
  process.exitCode = 1;
});