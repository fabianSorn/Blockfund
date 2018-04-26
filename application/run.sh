#!/bin/sh
rm -rf ./build/
truffle compile
truffle migrate
npm start