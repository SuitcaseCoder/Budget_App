'use strict';
// \\ run it in the database url I give or on local server
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/budgetAppDB';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-budgetAppDB';
exports.PORT = process.env.PORT || 8080;
