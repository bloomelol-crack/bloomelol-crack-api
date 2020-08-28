/* eslint-disable no-case-declarations */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import joi from '@hapi/joi';

import fs from 'fs';
import url from 'url';

import { router } from 'utils/middlewares';
import rollbar from 'utils/rollbar';
import projectDir from 'utils/projectDir';
import env from 'env.json';

import SCHEMA from 'routes/schemas/constants/schema';

const getSchemaError = (schema = joi.object(), objectToValidate = {}, options: any) => {
  options = options || { stripUnknown: false };
  const { error, value } = schema.validate(objectToValidate, options);
  const errors = (error && error.details.map(err => err.message)) || null;
  return { errors, value };
};

const getValidator = (schemaName: string, schema: any) => async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNext
) => {
  const { method } = req;
  const { path } = req.route;
  if (!schema) {
    console.warn(
      `Couldn't find validations for path "${path}" and method "${method}". Schema: "${schemaName}". Calling next()`
    );
    return next();
  }
  if (schema.domains) {
    schema.domains = Array.isArray(schema.domains) ? schema.domains : [schema.domains];
    const { host } = url.parse(req.headers.referer || '');
    if (!schema.domains.includes(host)) return res.status(401).json({ error: 'Domain is not in whitelist' });
  }
  const { errorMessage } = schema;
  if (schema.admin && req.headers[`admin_secret_${env.NODE_ENV}`] !== env.ADMIN_SECRET) {
    return res.status(401).json({
      error: "What are you doing ?? You're not an administrator"
    });
  }
  const schemaError: any[] = [];
  type reqType = 'headers' | 'params' | 'body';
  const isReqType = (str: string): str is reqType => ['headers', 'params', 'body'].includes(str);
  SCHEMA.REQUEST_TYPES.forEach((type: string): any => {
    if (!isReqType(type)) return;
    if (schema[type]) {
      if (typeof schema[type].validate !== 'function') {
        const error = `Invalid schema object. path '${path}'. Method '${method}'. Schema: '${schemaName}'. Key:'${type}'`;
        rollbar.error(error);
        return schemaError.push(error);
      }
      const validation = getSchemaError(schema[type], req[type], schema.options);
      const { errors } = validation;
      req[type] = validation.value;
      errors && schemaError.push(errors);
    }
  });
  if (schemaError.length) return res.status(400).json({ error: errorMessage || schemaError });
  if (schema.middlewares) {
    const middlewares = Array.isArray(schema.middlewares) ? schema.middlewares : [schema.middlewares];
    for (let i = 0; i < middlewares.length; i += 1) middlewares[i](req, res, middlewares[i + 1] || next);
  } else next();
};

const getRoute = (
  method: 'get' | 'post' | 'put' | 'patch',
  paths: string | string[],
  schemaName: string,
  schema: import('@hapi/joi').Schema,
  _epName: string,
  callbacks: import('express').RequestHandler[]
) => {
  if (!Array.isArray(callbacks)) callbacks = [callbacks];
  const validator = getValidator(schemaName, schema);
  router[method](paths, validator, ...callbacks);
};
const getRoutes = () => {
  const actionFiles = fs
    .readdirSync(`${projectDir}/src/routes/actions`)
    .filter(
      file => fs.statSync(`${projectDir}/src/routes/actions/${file}`).isFile() && file.slice(-3) === '.js'
    );
  const actions: { [key: string]: any } = {};
  for (let k = 0; k < actionFiles.length; k += 1) {
    const name = actionFiles[k].substring(0, actionFiles[k].length - 3);
    actions[name] = require(`../actions/${name}`);
  }
  let schemaFiles = fs.readdirSync(__dirname);
  schemaFiles = schemaFiles.filter(file => file !== 'index.js' && file.slice(-3) === '.js');
  const schemas: { [key: string]: { [key: string]: import('@hapi/joi').Schema } } = {};
  const routes: { Paths: { [key: string]: any }; [key: string]: any } = { Paths: {} };
  for (let k = 0; k < schemaFiles.length; k += 1) {
    const name = schemaFiles[k].substring(0, schemaFiles[k].length - 3);
    const schema = require(`./${name}`);
    routes.Paths[name] = {};
    if (!actions[name]) {
      rollbar.error(
        `No action was found for schema "${name}". Won't define associated routes.
Please define it in "server/routes/actions/${name}.js"`
      );
      continue;
    }
    routes[name] = {};

    schemas[name] = {};
    const epNames = Object.keys(schema);
    for (let m = 0; m < epNames.length; m += 1) {
      const epName = epNames[m];
      if (!actions[name][epName]) {
        rollbar.error(
          `No action was found for schema "${name}" and endpoint "${epName}". Won't define that endpoint.
Please review "server/routes/actions/${name}.js"`
        );
        continue;
      }
      schemas[name][epName] = joi.bool();
      let { paths } = schema[epName];
      const { method } = schema[epName];
      if (!method) {
        rollbar.error(
          `No "method" was specified on schema "${name}", endpoint "${epName}". This route definition will be ignored`
        );
        continue;
      }
      paths = Array.isArray(paths) ? paths : [paths];
      paths = paths.filter((path: string) => path);
      if (paths.length === 0) {
        rollbar.warn(
          `No "paths" specified at schemas "${name}", endpoint ${epName}. This route definition will be ignored`
        );
        continue;
      }
      routes.Paths[name][epName] = paths.map((path: string) => `/api${path}`);
      routes.Paths[name][epName].method = method;

      getRoute(method, paths, name, schema[epName], epName, actions[name][epName]);
    }
  }
  return routes;
};

module.exports = getRoutes();
