'use strict';

/** */
let unique = (arr) => {
  return arr.filter((c, i, a) => {
    return a.indexOf(c) === i;
  });
}

//!NOTE: this number is arbitrary, but necesary to prevent an infinite loop
const ROUTE_MAX_STOPS = 10;
const ROUTE_MAX_DISTANCE = 100;

/** Represents the edges making up a directed graph*/
class DirectedGraph {

    constructor (edges) {
        this.edges = edges || [];
    }

    /** returns a list of nodes with an edge originating directly from 'node' */
    adjacentNodes(node){
      return unique(this.edges.filter(n => n.nodeA === node).map(n => n.nodeB));
    }

    /** returns an edge with the given endpoints */
    edge(nodeA, nodeB){
      let edges = this.edges.filter(edge => (edge.nodeA === nodeA && edge.nodeB === nodeB));
      if(edges.length){
        return edges.shift();
      }else{
        throw new Error("NO SUCH ROUTE");
      }
    }

    /** computes the magnitude of all the segments along a route */
    magnitude(...nodes){
      if (nodes.length < 2) return 0;
      let [start, end] = nodes.slice(0, 2);
      let segment = this.edge(start, end);
      let distance = segment.magnitude;

      distance += this.magnitude.apply(this, Array.prototype.slice.call(nodes, 1));
      return distance;
    }

    /** finds routes from A to B. Gated by ROUTE_MAX_STOPS to avoid overflowing the call stack */
    findRoute(start, end) {
      let routes = [];
      let self = this;
      function findPath(start, end, previous = []) {
        self.adjacentNodes(start).forEach(adj => {
          if (adj === end) {
            routes.push(previous.concat([start, adj]));
          }
          if(previous.length <= ROUTE_MAX_STOPS){
            findPath(adj, end, previous.concat([start]));
          }
        })
      }
      findPath(start, end, []);
      return routes;
    }

    /** returns all routes with at least minStops and no more than maxStops */
    routes(start, end, minStops, maxStops){
      return this.findRoute(start, end)
        .filter(route => {
          let stops=route.length - 1;
          return stops >= minStops && stops <= maxStops;
        })

    }

    /** returns all routes withing a given distance range */
    routesWithMagnitude(start, end, min = 0, max = ROUTE_MAX_DISTANCE){
      let routes = this.routes(start, end, 0, ROUTE_MAX_STOPS)
        // .map(route => ([, route]))
        .filter(route => {
          let distance=this.magnitude.apply(this, route);
          return distance >= min && distance <= max;
        })
      return routes;
    }

    /** returns the shortest route between two nodes */
    shortestRoute(start, end){
      return this.routesWithMagnitude(start, end)
          .sort((a, b) => this.magnitude.apply(this, a)-this.magnitude.apply(this, b))
          .shift();
    }

    /** returns the distance of the shortest route between two nodes */
    shortestRouteDistance(start, end){
      let route = this.shortestRoute(start, end);
      return this.magnitude.apply(this, route);
    }

    /** creates a string representation of the directed graph */
    toString () {
        return this.edges.join(', ');
    }

    /** creates a DirectedGraph from a string representation */
    static parse(str){
      let graph = new DirectedGraph();
      graph.edges = str.split(/, \s*/).sort().map(edge => {
        let [nodeA, nodeB, magnitude] = edge.split('');
        return new DirectedGraphEdge(nodeA, nodeB, parseInt(magnitude));
      });
      return graph;
    }
}

/** a node in a directed graph */
class DirectedGraphEdge {
  constructor (nodeA, nodeB, magnitude){
    this.nodeA = nodeA;
    this.nodeB = nodeB;
    this.magnitude = magnitude || 0;
  }
  toString () {
    return `${this.nodeA}${this.nodeB}${this.magnitude}`;
  }
}

module.exports = { DirectedGraph, DirectedGraphEdge };
