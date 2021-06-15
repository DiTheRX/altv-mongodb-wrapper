
import * as development from './env/development.js';
import * as production from './env/production.js';
import * as test from './env/test.js';

export default {
  development: Object.assign({}, development),
  test: Object.assign({}, test),
  production: Object.assign({}, production)
}[process.env.NODE_ENV || 'development'];