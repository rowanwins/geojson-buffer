import { getJoin } from './joinTypes'
import { distanceRadiansBetweenPoints } from './utils'
import { debugWindingNumbers, debugSkippedEdge, debugOffsetEdges, debugWeirdPoint, debugTriangulation } from './debug'
import polygonClipping from 'polygon-clipping/dist/polygon-clipping.esm.js'
import * as martinez from 'martinez-polygon-clipping'
import shamosHoey from 'shamos-hoey'
import earcut from 'earcut'
import Delaunator from 'delaunator'
import { triangulate } from './tess'

export default class Contour {

    constructor (isHole) {
        this.edges = []
        this.points = []
        this.isHole = isHole
        this.outContour = []
    }

    offsetEdges (distance) {
        for (var i = 0; i < this.edges.length; i++) {
            this.edges[i].offsetEdge(distance)
        }
        debugOffsetEdges(this.edges)
    }

    rejoinOffsetEdges (distanceDegrees, distanceRadians) {
        const bufferDistanceDoubled = distanceRadians * 2
        for (var i = 0; i < this.edges.length; i++) {
            const e = this.edges[i]

            // if (e.edgeLengthRadians < bufferDistanceDoubled) {
            //     // debugSkippedEdge(e)
            //     continue
            // }

            const p1 = e.point1
            const p2 = e.point2
            // if (p2.angleBetweenPoints > 290) {
            //     // debugWeirdPoint(e)
            //     if (distanceRadiansBetweenPoints(p1, e.nextEdge.point2) < bufferDistanceDoubled) {
            //         this.outContour.push(e.getIntersection(e.prevEdge))
            //         i++
            //         continue
            //     }
            // }

            if (p1.isConcave) {
                this.outContour.push(e.getIntersection(e.prevEdge))
            } else {
                const outsector = getJoin('round', e.point1, distanceDegrees, distanceRadians, e.offsetPoint1, e.prevEdge.offsetPoint2, 32)
                this.outContour = this.outContour.concat(outsector)
            }
        }
    }

    removeGlobalIntersections () {
        // const pg = this.outContour.map(function (p) {
        //     return [p.x, p.y]
        // })
        // const triangleVerts = triangulate([pg])
        // // console.log(triangleVerts)

        // var out = []
        // for (let i = 0; i < triangleVerts.length; i = i + 2) {
        //     out.push([triangleVerts[i], triangleVerts[i + 1]])
        // }
        // // console.log(out)
        // return [[out]]

        const pg = []
        for (var i = 0; i < this.outContour.length; i++) {
            pg.push(this.outContour[i].x)
            pg.push(this.outContour[i].y)
        }
        var result = earcut(pg)
        var triangles = []
        for (i = 0; i < result.length; i++) {
            var index = result[i]
            triangles.push([pg[index * 2], pg[index * 2 + 1]])
        }

        debugTriangulation(triangles)
        // return polygonClipping.union([pg])
        // const ip = []
        // // const ip = shamosHoey({ type: 'Polygon', coordinates: [pg] }, {
        // //     booleanOnly: false
        // // })
        // if (ip.length === 0) return [[pg]]
        // const goUntil = ip[0].segmentIndex1
        // const restart = ip[0].segmentIndex2

        // const finalOut = []
        // for (var i = 0; i < goUntil; i++) {
        //     finalOut.push(pg[i])
        // }

        // finalOut.push([ip[0].coords.x, ip[0].coords.y])

        // for (var i = restart + 1; i < pg.length; i++) {
        //     finalOut.push(pg[i])
        // }
        // return [[finalOut]]
    }
}
