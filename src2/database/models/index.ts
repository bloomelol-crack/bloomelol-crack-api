import mongoose, { Model } from 'mongoose';
import fs from 'fs';

import rollbar from 'utils/rollbar';
import 'database';

const db: ModelContainer = {};

const get = (Model: Model<mongoose.Document>) => (
  where: {},
  { sort, projection, skip = 0, limit = 0 }: { sort?: {}; projection?: {}; skip?: number; limit?: number }
) =>
  new Promise<any>(resolve => {
    Model.find(where, projection)
      .lean({ defaults: true })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .then(resolve)
      .catch(error => {
        rollbar.error(error);
        resolve(null);
      });
  });

const Delete = (Model: Model<mongoose.Document>) => (...[where]: DeleteParameters) =>
  new Promise<DeleteResponse>(resolve => {
    Model.deleteMany(where)
      .then(resolve)
      .catch(error => {
        rollbar.error(error);
        resolve(null);
      });
  });

const save = (Model: Model<mongoose.Document>) => (...[obj]: SaveParameters) =>
  new Promise<SaveResponse>(resolve => {
    const model = new Model(obj);
    model.save(saveError => {
      if (saveError) {
        console.error(saveError);
        return resolve(null);
      }
      resolve(true);
    });
  });

const update = (Model: Model<mongoose.Document>) => (where: {}, obj: {}) =>
  new Promise<UpdateResponse>(resolve => {
    Model.updateMany(where, obj, (error, data) => {
      if (error) {
        console.error(error);
        return resolve(null);
      }
      resolve(data.nModified);
    });
  });

const insertOrUpdate = (Model: Model<mongoose.Document>) => (where = {}, obj: {}) =>
  new Promise<InsertOrUpdateResponse>(resolve => {
    Model.updateMany(where, obj, { upsert: true, setDefaultsOnInsert: true }, error => {
      if (error) {
        console.error(error);
        return resolve(null);
      }
      resolve(true);
    });
  });

fs.readdirSync(__dirname)
  .filter(file => file !== 'index.js' && file.slice(-3) === '.js')
  .forEach(file => {
    file = file.substring(0, file.length - 3);
    const Model = require(`./${file}`);
    db[file] = {
      save: save(Model),
      get: get(Model),
      delete: Delete(Model),
      update: update(Model),
      insertOrUpdate: insertOrUpdate(Model)
    };
  });

export default db;
