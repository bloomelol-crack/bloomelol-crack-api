type DeleteParameters = [object];
type DeleteResponse =
  | ({ ok?: number | undefined; n?: number | undefined } & {
      deletedCount?: number | undefined;
    })
  | null;

type SaveResponse = true | null;
type SaveParameters = [Doc];

type UpdateResponse = number | null;

type InsertOrUpdateResponse = true | null;
type DatabaseMethods<model> = {
  save: (obj: model) => Promise<SaveResponse>;
  get: (where: import('mongoose').MongooseFilterQuery<model>, sort?: {}, projection?: {}) => Promise<model[]>;
  delete: (...args: DeleteParameters) => Promise<DeleteResponse>;
  update: (
    where: import('mongoose').MongooseFilterQuery<model>,
    obj: import('mongoose').MongooseUpdateQuery<model>
  ) => Promise<UpdateResponse>;
  insertOrUpdate: (where: object, obj: model) => Promise<InsertOrUpdateResponse>;
};
