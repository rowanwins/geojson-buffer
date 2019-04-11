const libtess = require('libtess')

const tessy = (function initTesselator () {

    function vertexCallback (data, polyVertArray) {
        polyVertArray[polyVertArray.length] = data[0]
        polyVertArray[polyVertArray.length] = data[1]
    }
    function begincallback (type) {
        // if (type !== libtess.primitiveType.GL_TRIANGLES) {
        // }
    }
    function errorcallback (errno) {
    }

    function combinecallback (coords, data, weight) {
        return [coords[0], coords[1], coords[2]]
    }
    function edgeCallback (flag) {
    }

    var tessy = new libtess.GluTesselator()
    // tessy.gluTessProperty(libtess.gluEnum.GLU_TESS_WINDING_RULE, libtess.windingRule.GLU_TESS_WINDING_POSITIVE);
    tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_VERTEX_DATA, vertexCallback)
    tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_BEGIN, begincallback)
    tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_ERROR, errorcallback)
    tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_COMBINE, combinecallback)
    tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_EDGE_FLAG, edgeCallback)

    return tessy
})()

export function triangulate (contours) {
    tessy.gluTessNormal(0, 0, 1)

    var triangleVerts = []
    tessy.gluTessBeginPolygon(triangleVerts)

    for (var i = 0; i < contours.length; i++) {
        tessy.gluTessBeginContour()
        var contour = contours[i]
        for (var j = 0; j < contour.length; j++) {
            var coords = [contour[j][0], contour[j][1], 0]
            tessy.gluTessVertex(coords, coords)
        }
        tessy.gluTessEndContour()
    }

    tessy.gluTessEndPolygon()

    return triangleVerts
}
