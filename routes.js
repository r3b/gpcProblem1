'use strict';
const fs = require('fs');
const {
  DirectedGraph, DirectedGraphEdge
} = require('./graph');

function createRouteInfo(filename) {
  let contents = fs.readFileSync(filename, 'utf8');

  let graph = DirectedGraph.parse(contents);
  return graph;

}


module.exports = { createRouteInfo };
