import { offsetEdge as offset, checkLineIntersection, distanceRadiansBetweenPoints } from './utils'

export default class Edge {

    constructor (point1, point2) {
        this.point1 = point1
        this.point2 = point2

        this.offsetPoint1 = null
        this.offsetPoint2 = null

        this.prevEdge = null
        this.nextEdge = null

        this.edgeType = null

        this.edgeLengthRadians = this.getEdgeLengthInRadians()
    }

    offsetEdge (distance) {
        const outPoints = offset(this.point1, this.point2, distance)
        this.offsetPoint1 = outPoints[0]
        this.offsetPoint2 = outPoints[1]
    }

    getIntersection (otherEdge) {
        const intersectionPoint = checkLineIntersection(
            this.offsetPoint1[0],
            this.offsetPoint1[1],
            this.offsetPoint2[0],
            this.offsetPoint2[1],
            otherEdge.offsetPoint1[0],
            otherEdge.offsetPoint1[1],
            otherEdge.offsetPoint2[0],
            otherEdge.offsetPoint2[1]
        )
        return intersectionPoint
    }

    getEdgeLengthInRadians () {
        return distanceRadiansBetweenPoints(this.point1, this.point2)
    }

    splitAtPoint (p) {
        p.prevPoint = this.point1
        p.nextPoint = this.point2

        this.point1.nextPoint = p
        this.point2.prevPoint = p

        const entryEdge = new Edge(this.point1, p)
        entryEdge.edgeType = 'entry'
        entryEdge.prevEdge = this.prevEdge
        this.prevEdge.nextEdge = entryEdge

        const exitEdge = new Edge(p, this.point2)
        exitEdge.edgeType = 'exit'
        exitEdge.nextEdge = this.nextEdge
        exitEdge.nextEdge.prevEdge = exitEdge
        exitEdge.prevEdge = entryEdge

        entryEdge.nextEdge = exitEdge

        return [entryEdge, exitEdge]
    }

}
