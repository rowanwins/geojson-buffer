import { getJoin } from './joinTypes'
import { distanceRadiansBetweenPoints } from './utils'
import { debugWindingNumbers, debugSkippedEdge, debugOffsetEdges, debugWeirdPoint, debugTriangulation } from './debug'
import polygonClipping from 'polygon-clipping/dist/polygon-clipping.esm.js'
import * as martinez from 'martinez-polygon-clipping'
import shamosHoey from 'shamos-hoey'

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
            if (p2.angleBetweenPoints > 290) {
                // debugWeirdPoint(e)
                if (distanceRadiansBetweenPoints(p1, e.nextEdge.point2) < bufferDistanceDoubled) {
                    this.outContour.push(e.getIntersection(e.prevEdge))
                    i++
                    continue
                }
            }

            if (p1.isConcave) {
                this.outContour.push(e.getIntersection(e.prevEdge))
            } else {
                const outsector = getJoin('round', e.point1, distanceDegrees, distanceRadians, e.offsetPoint1, e.prevEdge.offsetPoint2, 32)
                this.outContour = this.outContour.concat(outsector)
            }
        }
    }

    removeGlobalIntersections () {
        let pg = [[]]
        for (var i = 0; i < this.outContour.length; i++) {
            pg[0].push([this.outContour[i].x, this.outContour[i].y])
        }
        return pg
        // const ip = shamosHoey({
        //     type: 'Polygon',
        //     coordinates: pg
        // }, {
        //     booleanOnly: false
        // })
        // console.log(ip)
        // if (ip.length === 0) {
        //     return pg
        // } else if (ip.length === 1) {
        //     let indicesFirst = ip[0].segmentIndices
        //     pg[0].splice(indicesFirst[0], (indicesFirst[1] - indicesFirst[0]) + 1, [ip[0].x, ip[0].y])
        //     return pg
        // } else {
        //     const indicesFirst = ip[0].segmentIndices
        //     const indicesSecond = ip[1].segmentIndices
        //     let hole = pg[0].splice(indicesSecond[0] + 1, indicesSecond[1] - indicesSecond[0])
        //     hole = [[ip[1].x, ip[1].y], ...hole, [ip[1].x, ip[1].y]]

        //     const countOfRemainderToRemove = (indicesSecond[0] - indicesFirst[0]) + (indicesFirst[1] - indicesSecond[1]) + 1
        //     pg[0].splice(indicesFirst[0], countOfRemainderToRemove, [ip[0].x, ip[0].y])
        //     pg[0].push(hole)
        //     return pg
        // }
    }
}
