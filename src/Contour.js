import { getJoin } from './joinTypes'
import { debugWindingNumbers } from './debug'

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
    }

    rejoinOffsetEdges (distanceDegrees, distanceRadians) {

        for (var i = 0; i < this.edges.length; i++) {
            const e = this.edges[i]
            const p1 = e.point1

            if (p1.isConcave) {
                this.outContour.push(e.getIntersection(e.prevEdge))
            } else {
                const outsector = getJoin('round', e.point1, distanceDegrees, distanceRadians, e.offsetPoint1, e.prevEdge.offsetPoint2, 64)
                this.outContour = this.outContour.concat(outsector)
            }
        }
    }

    // calculateWindingNumbers () {
    //     for (var i = 0; i < this.edges.length; i++) {
    //         this.edges[i].point1WindingNumber = calculateWindingNumberOrig(this.edges[i].offsetPoint1, this.edges)
    //     }
    //     debugWindingNumbers(this.edges)
    // }
}
