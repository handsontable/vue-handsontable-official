'use strict';

const webpack = require('webpack');
const env = process.env.HOT_TYPE;
const configFactory = require('./.config/' + env);

module.exports = configFactory.create(env);
