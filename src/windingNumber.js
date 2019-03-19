// Modified from http://geomalgorithms.com/a03-_inclusion.html#Winding-Number

export function calculateWindingNumber2 (point, points) {
    let windingNumber = 0
    for (var i = 0; i < points.length; i++) {
        const p1 = points[i].offsetPoint1
        const p2 = i < points.length - 1 ? points[i + 1].offsetPoint1 : points[0].offsetPoint1

        if (p1.y <= point.y) {
            if (p2.y > point.y) {
                if (isLeft(p1, p2, point) > 0) windingNumber++
            }
        } else {
            if (p1.y <= point.y) {
                if (isLeft(p1, p2, point) < 0) windingNumber--
            }
        }
    }

    return windingNumber
}

export function calculateWindingNumberOrig (point, edges) {
    let windingNumber = 0
    for (var i = 0; i < edges.length; i++) {
        const edge = edges[i]
        if (edge.offsetPoint1.y <= point.y) {
            if (edge.offsetPoint2.y > point.y) {
                if (isLeft(edge.offsetPoint1, edge.offsetPoint2, point) > 0) windingNumber++
            }
        } else {
            if (edge.offsetPoint2.y <= point.y) {
                if (isLeft(edge.offsetPoint1, edge.offsetPoint2, point) < 0) windingNumber--
            }
        }
    }

    return windingNumber
}

function isLeft (P0, P1, P2) {
    return ((P1.x - P0.x) * (P2.y - P0.y) - (P2.x - P0.x) * (P1.y - P0.y))
}
