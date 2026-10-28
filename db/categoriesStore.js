const categories = [
  { id: 1, name: 'Mountain' },
  { id: 2, name: 'Route' },
  { id: 3, name: 'City' },
];

const LATENCY_MS = 100;

// 1) Versión con callback
function getCategoryCb(id, callback) {
  setTimeout(() => {
    callback(null, categories.find(c => c.id === id));
  }, LATENCY_MS);
}

// 2) Versión con promesa, envolviendo la de callback
function getCategory(id) {
  return new Promise((resolve, reject) => {
    getCategoryCb(id, (err, category) => {
      if (err) return reject(err);
      resolve(category);
    });
  });
}

// 3) Lista, directamente con promesa
function getAllCategories() {
  return new Promise(resolve => {
    setTimeout(() => resolve([...categories]), LATENCY_MS);
  });
}
   let nextCategoryId = Math.max(...categories.map(c => c.id)) + 1;

   function addCategory(name) {
     return new Promise(resolve => {
       setTimeout(() => {
         const category = { id: nextCategoryId++, name };
         categories.push(category);
         resolve(category);
       }, LATENCY_MS);
     });
   }
function updateCategory(id, name) {
  return new Promise(resolve => {
    setTimeout(() => {
      const category = categories.find(c => c.id === id);

      if (!category) return resolve(null);

      category.name = name;
      resolve(category);
    }, LATENCY_MS);
  });
}

function deleteCategory(id) {
  return new Promise(resolve => {
    setTimeout(() => {
      const index = categories.findIndex(c => c.id === id);
      if (index === -1) return resolve(null);

      resolve(categories.splice(index, 1)[0]);
    }, LATENCY_MS);
  });
}

module.exports = {
  getCategoryCb,
  getCategory,
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory
};