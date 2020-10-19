#!/bin/bash

rm -rf node_modules/sui-externs
rm -rf node_modules/sui-js
rm -rf node_modules/expo-rich-text-editor
rm -rf package-lock.json
npm install
npm outdated
eslint . --fix
npm run tsc-test 
