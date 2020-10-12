const get = Model => (where = {}, { sort = {}, projection = {}, skip = 0, limit = 0 } = {}) =>
  new Promise(resolve => {
    Model.find(where, projection)
      .lean({ defaults: true })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .then(resolve)
      .catch(error => {
        logError(error);
        resolve(null);
      });
  });
const count = Model => (where = {}) =>
  new Promise(resolve => {
    Model.countDocuments(where)
      .then(resolve)
      .catch(error => {
        logError(error);
        resolve(null);
      });
  });
const aggregate = Model => aggregations =>
  new Promise(resolve => {
    Model.aggregate(aggregations)
      .then(resolve)
      .catch(error => {
        logError(error);
        resolve(null);
      });
  });
const Delete = Model => (where = {}) =>
  new Promise(resolve => {
    Model.deleteMany(where)
      .then(({ deletedCount }) => deletedCount)
      .catch(error => {
        logError(error);
        resolve(null);
      });
  });
const save = Model => obj =>
  new Promise(resolve => {
    const document = new Model(obj);
    document.save(saveError => {
      if (saveError) {
        logError(saveError);
        return resolve(null);
      }
      resolve(document);
    });
  });
const update = Model => (where, obj) =>
  new Promise(resolve => {
    Model.updateMany(where, obj, (error, data) => {
      if (error) {
        logError(error);
        return resolve(null);
      }
      resolve(data.nModified);
    });
  });
/**
 * Updates one array element in one document or pushes to it
 * @param {import('mongoose').Model} Model
 */
const updateOrPush = Model => (where, arrayWhere, obj) =>
  new Promise(async resolve => {
    const completeWhere = { ...where, ...arrayWhere };
    const foundDocs = await count(Model)(completeWhere);
    if (foundDocs === null) return resolve(null);
    if (foundDocs === 0) {
      obj = Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [key.substring(0, key.length - 2), value])
      );
      return Model.updateOne(where, { $addToSet: obj }, (error, data) => {
        if (error) {
          logError(error);
          return resolve(null);
        }
        resolve(data.nModified);
      });
    }
    Model.updateOne(completeWhere, { $set: obj }, (error, data) => {
      if (error) {
        logError(error);
        return resolve(null);
      }
      if (!data.n) return resolve(0);
      resolve(data.nModified);
    });
  });
const insertOrUpdate = Model => (where, obj) =>
  new Promise(resolve => {
    Model.updateMany(where, obj, { upsert: true, setDefaultsOnInsert: true }, error => {
      if (error) {
        logError(error);
        return resolve(null);
      }
      resolve(true);
    });
  });

export const getResolvers = Model => ({
  save: save(Model),
  get: get(Model),
  count: count(Model),
  aggregate: aggregate(Model),
  delete: Delete(Model),
  update: update(Model),
  updateOrPush: updateOrPush(Model),
  insertOrUpdate: insertOrUpdate(Model)
});
