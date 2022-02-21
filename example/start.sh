#!/bin/bash

npm i
rm -rf node_modules/@siposdani87
mkdir -p node_modules/@siposdani87/expo-rich-text-editor
cp -R ../dist node_modules/@siposdani87/expo-rich-text-editor
cp -R ../package.json node_modules/@siposdani87/expo-rich-text-editor
npm run tsc-test 
expo start -c
