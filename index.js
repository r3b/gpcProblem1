'use strict';


const {
  createRouteInfo
} = require('./routes');

const args = require('minimist')(process.argv.slice(2), {
  alias: {
    input: 'file',
    h: 'help',
    v: 'version'
  },
  default: {
    input: 'input.graph'
  }
});


let graph = createRouteInfo(args.input);
const testData = [
  ['A', 'B', 'C'],
  ['A', 'D'],
  ['A', 'D', 'C'],
  ['A', 'E', 'B', 'C', 'D'],
  ['A', 'E', 'D']
];

testData.forEach(route => {
  let d;
  try {
    d = graph.magnitude.apply(graph, route);
  } catch (e) {
    d = e.message;
  }
  console.log(d);
});

console.log(graph.routes('C', 'C', 1, 3).length);
console.log(graph.routes('A', 'C', 4, 4).length);
console.log(graph.shortestRouteDistance('A', 'C'));
console.log(graph.shortestRouteDistance('B', 'B'));
console.log(graph.routesWithMagnitude('C', 'C', 0, 29).length);
