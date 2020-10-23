#!/bin/bash

rm -rf package-lock.json
npm install
npm outdated
eslint . --fix
npm run tsc-test 
