import Contour from './Contour'
import Edge from './Edge'
import Point from './Point'
import { debugPoints } from './debug'

export function setupStructures (geojson) {
    const geom = geojson.type === 'Feature' ? geojson.geometry : geojson

    let coords = geom.coordinates
    // standardise the input
    if (geom.type === 'Polygon' || geom.type === 'MultiLineString') coords = [coords]
    if (geom.type === 'LineString') coords = [[coords]]

    const contours = []
    for (let i = 0; i < coords[0].length; i++) {

        const contour = new Contour(i > 0)
        contours.push(contour)

        let prevPoint = new Point(coords[0][i][0])
        let currentPoint = new Point(coords[0][i][1])
        let nextPoint = new Point(coords[0][i][2])
        linkPoints(prevPoint, currentPoint, nextPoint)

        contour.points.push(prevPoint)

        let prevEdge = new Edge(prevPoint, currentPoint) // eslint-disable-line
        contour.edges.push(prevEdge)

        // Save me for later
        const firstPoint = prevPoint
        const firstEdge = prevEdge

        prevPoint = currentPoint
        currentPoint = nextPoint

        for (let ii = 2; ii < coords[0][i].length - 2; ii++) {
            contour.points.push(prevPoint)

            nextPoint = new Point(coords[0][i][ii + 1])

            linkPoints(prevPoint, currentPoint, nextPoint)

            const e = new Edge(prevPoint, currentPoint) // eslint-disable-line
            e.prevEdge = prevEdge
            prevEdge.nextEdge = e

            contour.edges.push(e)

            prevPoint = currentPoint
            currentPoint = nextPoint
            prevEdge = e
        }

        linkPoints(prevPoint, currentPoint, firstPoint)

        const secondLastEdge = new Edge(prevEdge.point2, currentPoint)
        secondLastEdge.prevEdge = prevEdge
        prevEdge.nextEdge = secondLastEdge

        contour.edges.push(secondLastEdge)

        const lastEdge = new Edge(currentPoint, firstPoint) // eslint-disable-line
        lastEdge.prevEdge = secondLastEdge
        secondLastEdge.nextEdge = lastEdge
        firstEdge.prevEdge = lastEdge
        lastEdge.nextEdge = firstEdge

        contour.edges.push(lastEdge)

        contour.points.push(prevPoint)
        contour.points.push(nextPoint)

    }
    debugPoints(contours[0].points)
    return contours
}

function linkPoints (prevPoint, currentPoint, nextPoint) {
    currentPoint.prevPoint = prevPoint
    currentPoint.nextPoint = nextPoint
    currentPoint.calcuateAnglesBetweeenPoints()
}
