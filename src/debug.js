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

// export function debugWindingNumbers (edges) {
//     if (process.env.NODE_ENV !== 'development') return
//     const map = window.map

//     const pointsGroup = L.layerGroup([]).addTo(map)

//     edges.forEach(function (edge) {
//         const p = edge.offsetPoint1
//         L.circleMarker([p.y, p.x], {
//             color: edge.point1WindingNumber > 0 ? 'red' : 'green'
//         }).addTo(pointsGroup)
//     })

//     debugger

//     pointsGroup.remove()
// }

export function debugOffsetEdges (edges) {
    if (process.env.NODE_ENV !== 'development') return
    const map = window.map

    const linesGroup = L.layerGroup([]).addTo(map)

    edges.forEach(function (edge) {
        L.polyline([[edge.point1.y, edge.point1.x], [edge.point2.y, edge.point2.x]], {
            color: 'red'
        }).addTo(linesGroup)
    })

    // debugger

    linesGroup.remove()
}

export function debugWeirdPoint (edge) {
    if (process.env.NODE_ENV !== 'development') return
    const map = window.map

    const skippedLine = L.polyline([[edge.point1.y, edge.point1.x], [edge.point2.y, edge.point2.x]], {
        color: 'red'
    }).addTo(map)

    debugger

    skippedLine.remove()
}

export function debugSkippedEdge (edge) {
    if (process.env.NODE_ENV !== 'development') return
    const map = window.map

    const skippedLine = L.polyline([[edge.point1.y, edge.point1.x], [edge.point2.y, edge.point2.x]], {
        color: 'red'
    }).addTo(map)

    // debugger

    skippedLine.remove()
}

export function debugTriangulation (triangles) {
    if (process.env.NODE_ENV !== 'development') return
    const map = window.map
    const polyGroup = L.layerGroup([]).addTo(map)

    for (let i = 0; i < triangles.length; i += 3) {
        const coords = {type: 'Polygon', coordinates: [triangles.slice(i, i + 3)]}
        L.geoJSON(coords, {
            color: 'red',
            weight: 1,
            fillOpacity: 0
        }).addTo(polyGroup)
    }
    debugger

    polyGroup.remove()
}
