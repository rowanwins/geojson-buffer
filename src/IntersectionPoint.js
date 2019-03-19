import Point from './Point'

export default class IntersectionPoint extends Point {

    constructor (coords) {
        super(coords)
        this.visited = false
    }

}
