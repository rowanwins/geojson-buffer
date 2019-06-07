import { getJoin } from './joinTypes'
import { distanceRadiansBetweenPoints } from './utils'
import { debugWindingNumbers, debugSkippedEdge, debugOffsetEdges, debugWeirdPoint, debugTriangulation } from './debug'

export default class Contour {

    constructor (isHole) {
        this.edges = []
        this.points = []
        this.isHole = isHole
        this.outContour = []
    }

    createRawOffset (distanceDegrees, distanceRadians, numSteps) {
        // const bufferDistanceDoubled = distanceRadians * 2

        this.edges[this.edges.length - 1].offsetEdge(distanceDegrees)

        for (var i = 0; i < this.edges.length; i++) {
            const e = this.edges[i]
            e.offsetEdge(distanceDegrees)
            const p1 = e.point1

            // const p2 = e.point2
            // if (e.edgeLengthRadians < bufferDistanceDoubled) {
            //     // debugSkippedEdge(e)
            //     continue
            // }
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
                const outsector = getJoin('round', e.point1, distanceDegrees, distanceRadians, e.offsetPoint1, e.prevEdge.offsetPoint2, numSteps)
                this.outContour.push(...outsector)
            }
        }

        return this.outContour
    }
}
