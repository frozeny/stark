"use strict";

// This configuration file contains common values we can reuse in the different rollup configuration files (at least parts of)

const resolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");
const sourcemaps = require("rollup-plugin-sourcemaps");

const globals = {
	"@angular/core": "ng.core",
	"@angular/common/http": "angular.common.http",
	"@ngrx/store": "@ngrx/store",
	"class-validator": "class-validator",
	cerialize: "cerialize",
	moment: "moment",
	uuid: "uuid",

	rxjs: "rxjs",

	// this should be the preferred way to import RxJS operators: https://github.com/ReactiveX/rxjs/blob/master/doc/pipeable-operators.md
	// we should only use that in our code base
	"rxjs/operators": "rxjs.operators",

	"rxjs/Observable": "Rx",
	"rxjs/Subject": "Rx",
	//"rxjs/Subscription": "Rx",

	// TODO add lines such as the one below to make sure that stark modules that depend on other stark modules can find those
	// '@nationalbankbelgium/core': 'stark.core',
};

const plugins = [
	resolve(),
	commonjs(), // converts date-fns to ES modules
	sourcemaps()
];

const output = {
	globals: globals,
	format: "umd", // modules with code should be converted to umd
	exports: "named",
	sourcemap: true
};

exports.output = output;
exports.external = Object.keys(globals);
exports.plugins = plugins;