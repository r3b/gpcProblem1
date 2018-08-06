'use strict';

const expect = require('chai').expect;
const {
  createRouteInfo
} = require('../routes');
describe('routes', function () {
  describe('#createRouteInfo()', function () {
    it('should return the input file parsed as a DirectedGraph',
      function () {

        // 1. ARRANGE
        let testFile = 'input.graph';

        // 2. ACT
        let graph = createRouteInfo(testFile);

        // 3. ASSERT
        expect(graph.edges.length).to.be.equal(9);
        expect(graph.edges[0].nodeA).to.be.equal('A');
        expect(graph.edges[0].nodeB).to.be.equal('B');
        expect(graph.edges[0].magnitude).to.be.equal(5);


      });
  });
});
describe('DirectedGraph', function () {
  let testFile = 'input.graph';
  let graph = createRouteInfo(testFile);

  describe('#magnitude()', function () {
    it('should return the total magnitude for the given routes',
      function () {
        const testData = [
          [
            ['A', 'B', 'C'], 9
          ],
          [
            ['A', 'D'], 5
          ],
          [
            ['A', 'D', 'C'], 13
          ],
          [
            ['A', 'E', 'B', 'C', 'D'], 22
          ],
          [
            ['A', 'E', 'D'], 'NO SUCH ROUTE'
          ],
          [
            ['A'], 0
          ],
          [
            ['A', 'A'], 'NO SUCH ROUTE'
          ],
        ];

        testData.forEach(test => {
          let route = test[0];
          let distance = test[1];

          let d;
          try {
            d = graph.magnitude.apply(graph, route); //computeDistance(route);
          } catch (e) {
            d = e.message;
          }
          // console.log(route.join(' -> '), d);
          expect(d).to.be.equal(distance);
        });
      });
    it('should fail gracefully when given bad data',
      function () {
        const badData = [
          [
            ['A', 'B', 'C'], 0
          ],
          [
            ['A', 'E', 'D'], 'NO SUCH ROUTEzzz'
          ],
        ];
        badData.forEach(test => {
          let route = test[0];
          let distance = test[1];

          let d;
          try {
            d = graph.magnitude.apply(graph, route); //computeDistance(route);
          } catch (e) {
            d = e.message;
          }
          // console.log(route.join(' -> '), d);
          expect(d).not.to.be.equal(distance);
        });


      });
    describe('#routes()', function () {
      it('should find trips within a range of stops',
        function () {
          let trip1 = graph.routes('C', 'C', 1, 3);
          expect(trip1.length).to.be.equal(2);

          let trip2 = graph.routes('A', 'C', 4, 4);
          expect(trip2.length).to.be.equal(3);

        });
    });
    describe('#shortestRouteDistance()', function () {
      it('should find the shortest route',
        function () {
          let trip1 = graph.shortestRouteDistance('A', 'C');
          expect(trip1).to.be.equal(9);

          let trip2 = graph.shortestRouteDistance('B', 'B');
          expect(trip2).to.be.equal(9);

        });
    });
    describe('#routes()', function () {
      it('should find trips within a given distance',
        function () {
          let trip1 = graph.routesWithMagnitude('C', 'C', 0, 29);
          expect(trip1.length).to.be.equal(7);

        });
    });
  });
});
