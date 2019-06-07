import Point from './Point'
import { setupStructures } from './setupStructures'

export function removeGlobalIntersections (rawOffset, ips) {

    // console.time('removeIntersections')
    const outContours = []

    const rawContours = setupStructures({
        type: 'Polygon', coordinates: rawOffset
    })

    for (let i = 0; i < ips.length; i++) {
        const ip = ips[i]
        const p = new Point([ip.x, ip.y])

        const sEdgeIndex = ip.segmentIndices[0]
        const sEdge = rawContours[0].edges[sEdgeIndex]
        const [entryEdge, exitEdge] = sEdge.splitAtPoint(p)
        rawContours[0].edges.splice(sEdgeIndex, 1, entryEdge, exitEdge)

        const sEdgeIndex2 = ip.segmentIndices[1]
        const sEdge2 = rawContours[0].edges[sEdgeIndex2]
        const [entryEdge2, exitEdge2] = sEdge2.splitAtPoint(p)
        rawContours[0].edges.splice(sEdgeIndex2, 1, entryEdge2, exitEdge2)

        let e = i % 2 === 0 ? entryEdge : entryEdge2
        const outContour = []

        while (e.edgeType !== 'exit') {
            outContour.push([e.point1.x, e.point1.y])
            e = e.prevEdge
        }
        outContour.push(outContour[0])
        outContours.push(outContour)
        // contours[0].edges[ip.segmentIndices[1]].splitAtPoint([ip.x, ip.y])
    }
    // console.timeEnd('removeIntersections')

    return outContours
}
