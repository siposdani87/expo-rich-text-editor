#!/bin/bash

# sudo npm i -g expo-cli expo-optimize
rm -rf node_modules/@siposdani87
npm i
npm run tsc-test 
expo start -c
