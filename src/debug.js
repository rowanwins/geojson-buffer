export function debugPoints (points) {
    if (process.env.NODE_ENV !== 'development') return
    const map = window.map

    const pointsGroup = L.layerGroup([]).addTo(map)

    points.forEach(function (p) {
        L.circleMarker([p.y, p.x], {
            color: p.isConcave ? 'red' : 'green'
        }).addTo(pointsGroup)
    })

    // debugger

    pointsGroup.remove()
}

export function debugWindingNumbers (edges) {
    if (process.env.NODE_ENV !== 'development') return
    const map = window.map

    const pointsGroup = L.layerGroup([]).addTo(map)

    edges.forEach(function (edge) {
        const p = edge.offsetPoint1
        L.circleMarker([p.y, p.x], {
            color: edge.point1WindingNumber > 0 ? 'red' : 'green'
        }).addTo(pointsGroup)
    })

    debugger

    pointsGroup.remove()
}
