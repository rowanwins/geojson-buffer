import { degreesToRadians, bearingToAzimuth } from './utils'
import { calculateBearing } from './bearing'

export default class Point {

    constructor (coords) {
        this.x = coords[0]
        this.y = coords[1]

        this.radiansX = null
        this.radiansY = null
        this.calcRadiansForCoords()

        this.prevPoint = null
        this.bearingPrevPoint = null

        this.nextPoint = null
        this.bearingNextPoint = null

        this.angleBetweenPoints = null
        this.isConcave = null
    }

    calcRadiansForCoords () {
        this.radiansX = degreesToRadians(this.x)
        this.radiansY = degreesToRadians(this.y)
    }

    calcuateAnglesBetweeenPoints () {
        this.bearingPrevPoint = calculateBearing(this, this.prevPoint)
        this.bearingNextPoint = calculateBearing(this, this.nextPoint)
        this.angleBetweenPoints = bearingToAzimuth(bearingToAzimuth(this.bearingNextPoint) - bearingToAzimuth(this.bearingPrevPoint))
        this.isConcave = this.angleBetweenPoints > 180
    }

}
