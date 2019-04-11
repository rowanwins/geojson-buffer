import { offsetEdge as offset, checkLineIntersection, distanceRadiansBetweenPoints } from './utils'

export default class Edge {

    constructor (point1, point2) {
        this.point1 = point1
        this.point2 = point2

        this.offsetPoint1 = null
        this.offsetPoint2 = null
        this.edgeLengthRadians = this.getEdgeLengthInRadians()
    }

    offsetEdge (distance) {
        const outPoints = offset(this.point1, this.point2, distance)
        this.offsetPoint1 = outPoints[0]
        this.offsetPoint2 = outPoints[1]
    }

    getIntersection (otherEdge) {
        const intersectionPoint = checkLineIntersection(
            this.offsetPoint1.x,
            this.offsetPoint1.y,
            this.offsetPoint2.x,
            this.offsetPoint2.y,
            otherEdge.offsetPoint1.x,
            otherEdge.offsetPoint1.y,
            otherEdge.offsetPoint2.x,
            otherEdge.offsetPoint2.y
        )
        return intersectionPoint
    }

    getEdgeLengthInRadians () {
        return distanceRadiansBetweenPoints(this.point1, this.point2)
    }

}
