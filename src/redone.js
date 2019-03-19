let OriginPoly = null;         //the original polygon
let PreprocessedPoly = null;   //original polygon after proprocessing
let RawOffsetCurve = null;     //raw offset curve
let OffsetPoly = null;         //the offset polygon

let polygon = POLY;

const offset = 0.0;        //offset distance

extern GLint PolyList;
extern GLint numContour;
extern GLint b_Closed;
extern POINT2D rubber_band;
extern GLint process_poly;
extern vector<point> Points;
extern vector<polygon> Faces1;
extern int* order_triangle(int plist[3],int up);


//GLU_TESS_BEGIN callback function
function beginCallback(){
    CONTOUR NewContour;
    if (process_poly == ORIGINAL_POLYGON) {
        PreprocessedPoly.push_back(NewContour); //start a new contour
    }
    else {
        OffsetPoly.push_back(NewContour);       //start a new contour
        numContour ++;
    }
}

//GLU_TESS_ERROR callback function
function errorCallback(errorCode) {
    console.log("ERRR")
}

//GLU_TESS_END callback function
function endCallback(void) {
    int* plist = new int[3];
    Faces1.push_back(POLY);
}

//GLU_TESS_VERTEX callback function
function vertexCallback(vertex) {
    
    const pointer = vertex;
    
    for(let cnt = 0; cnt < Points.size(); cnt++) {
        float x1 = Points[cnt].x[0]-pointer[0];
        float y1 = Points[cnt].x[1]-pointer[1];
        
        
        if(x1 < .001 && x1 > -.001 && y1 < .001 && y1 > -.001) {
            let FP = 0;
            for(let c1=0; c1 < POLY.v.size(); c1++) {
                if(POLY.v[c1] === cnt) {
                    FP=1;
                    break;
                }
            }
            if (FP === 0) {
                POLY.v.push_back(cnt);
                Points[cnt].polys.push_back(Faces1.size());
            } 
            break;
        }
    }
    if (cnt === Points.size()) console.log("Some err")

    const NewVert = null;

    const poly = &OffsetPoly;

    const iContour = poly->end();
    iContour--;
    NewVert.x = pointer[0];
    NewVert.y = pointer[1];
    iContour.push(NewVert)

}

//GLU_TESS_COMBINE callback function, used to create a new vertex when edges intersect
function CALLBACK combineCallback(coords[3], *vertex_data[4], weight[4], **dataOut ) {
    const vertex = [];

    vertex[0] = coords[0];
    vertex[1] = coords[1];
    vertex[2] = coords[2];
    vertex[3] = 0.0;
    vertex[4] = 0.5;
    vertex[5] = 0.0;

    *dataOut = vertex;
}


//remove self-intersections in the original polygon or raw offset curve
function remove_self_intersections() {
    POINT3D *p_head = NULL, *p = NULL;
    POLYGON *poly = NULL;
    POLYGON::iterator iContour;
    CONTOUR::iterator jVertex;

    const tessy = new libtess.GluTesselator();

    tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_VERTEX, vertexCallback);
    gluTessCallback(libtess.gluEnum.GLU_TESS_BEGIN, beginCallback);
    gluTessCallback(libtess.gluEnum.GLU_TESS_END, endCallback);
    gluTessCallback(libtess.gluEnum.GLU_TESS_ERROR, errorCallback);
    gluTessCallback(libtess.gluEnum.GLU_TESS_COMBINE, combineCallback);

    poly = RawOffsetCurve;
    numContour = 0;

    //set tessellator properties
    gluTessProperty(tessy, libtess.winding_rule.GLU_TESS_WINDING_POSITIVE, winding_rule); 
    gluTessProperty(tessy, GLU_TESS_BOUNDARY_ONLY, GL_TRUE);
    gluTessNormal(tessy, 0, 0, 1);

    //input to the tessellator
    tessy.gluTessBeginPolygon();
    for (iContour=poly->begin(); iContour!=poly->end(); iContour++) {
        tessy.gluTessBeginContour();
        for (jVertex=iContour->begin(); jVertex!=iContour->end(); jVertex++) {
            p = new POINT3D;
            p->coord[0] = jVertex.x;
            p->coord[1] = jVertex.y;
            p->coord[2] = 0.0;
            p->next = p_head;
            p_head = p;
            tessy.gluTessVertex(p.coord, p.coord)
        }
        tessy.gluTessEndContour()
    }
    
    tessy.gluTessEndPolygon()
    tessy.gluDeleteTess()

    while (p_head !== null) {
        p = p_head
        p_head = p.next
        delete p
    }
}

function CalNormal(v, n) {
    const length = sqrt(v.x * v.x + v.y * v.y);
    n.x = v.y / length;
    n.y = -v.x / length;
}

function OffsetPoints(n, v, offset, p) {
    p.x = v.x -n.x * offset;
    p.y = v.y - n.y * offset;
}

function CrossProduct(v1, v2) {
    const z = v1.x * v2.y - v1.y * v2.x;
    return z;
}

function CalAngle(n) {
    let angle;

    if (n.x >= 0 && n.y >= 0) { //0 ~ 90
        angle = asin(n.y);
    }
    else if (n.x >= 0 && n.y < 0) { //270 ~ 360
        angle = asin(n.y)+2*PI;
    }
    else if (n.x < 0 && n.y >= 0) { //90 ~ 180
        angle = acos(n.x);
    }   
    else if (n.x < 0 && n.y < 0) { //180 ~ 270
        angle = 2 * PI - Math.acos(n.x);
    }
    return angle;
}

// //construct raw offset curve from the preprocessed original polygon
// void ConstructRawOffsetCurve(GLdouble off) {
//     GLdouble IncreAngle = 10.0;
//     GLdouble angle[3];
//     POINT2D v12, v23, n12, n23, p[2];
//     POLYGON RawCurve;
//     POLYGON::iterator iContour;
//     CONTOUR::iterator iVertex, jVertex, kVertex;
//     for (iContour=RawOffsetCurve.begin(); iContour!=RawOffsetCurve.end(); iContour++)
//         iContour->clear();
//     RawOffsetCurve.clear();

//     //get the preprocessed original polygon as raw curve
//     RawCurve.assign(PreprocessedPoly.begin(), PreprocessedPoly.end());
    
//     //construct the raw offset curves
//     for (iContour=RawCurve.begin(); iContour!=RawCurve.end(); iContour++) { 
//         if (iContour->size() < 3)   //not a polygon
//             continue;

//         //add the 1st and 2nd vertex to the end of the vertex list
//         kVertex = iContour->begin();
//         kVertex ++;
//         kVertex ++;
//         iContour->insert(iContour->end(), iContour->begin(), kVertex);

//         //add one contour to the raw offset curve
//         CONTOUR NewContour;
//         iVertex = iContour->begin();
//         jVertex = iVertex;
//         jVertex ++;
//         for (; kVertex!=iContour->end(); iVertex++, jVertex++, kVertex++) {
//             v12.x = jVertex->x - iVertex->x;
//             v12.y = jVertex->y - iVertex->y;

//             v23.x = kVertex->x - jVertex->x;
//             v23.y = kVertex->y - jVertex->y;

//             CalNormal(&v12, &n12); //normalized normal
//             CalNormal(&v23, &n23); //normalized normal
//             OffsetPoints(n12, *jVertex, off, &p[0]); //Get offset point
//             OffsetPoints(n23, *jVertex, off, &p[1]);
            
//             if ((CrossProduct(v12, v23))*offset <= 0) { //for convex vertex with outer offset or concave vertex with inner offset
//                 if (offset > 0) { //concave vertex with inner offset, normal is reversed
//                     n12.x *= -1.0; 
//                     n12.y *= -1.0;
//                     n23.x *= -1.0; 
//                     n23.y *= -1.0;
//                 }
//                 angle[1]=CalAngle(n12); //get the angle relative to x axis, [0,360)
//                 angle[2]=CalAngle(n23);
//                 if (offset <= 0 && angle[1]>angle[2]) //convex vertex
//                     angle[2]=2*PI+angle[2]; //make sure angle[2]>angle[1] for outer offset
//                 else if (offset > 0 && angle[1]<angle[2]) 
//                     angle[1]=2*PI+angle[1]; //make sure angle[1]>angle[2] for inner offset
//                 angle[0]=angle[1]; 
//                 while ((offset<=0 && angle[0]<=angle[2]) || (offset>0 && angle[0]>=angle[2])) { //add each point by increment angle of IncreAngle degree
//                     POINT2D NewVert;
//                     NewVert.x=jVertex->x+fabs(off)*cos(angle[0]);
//                     NewVert.y=jVertex->y+fabs(off)*sin(angle[0]);
//                     NewContour.push_back(NewVert);
                            
//                     if (offset <= 0) //for outer offset
//                         angle[0]=angle[0]+IncreAngle*PI/180.0;
//                     else if (offset > 0) //for inner offset
//                         angle[0]=angle[0]-IncreAngle*PI/180.0;
//                     if (fabs(angle[0]-angle[2])<=IncreAngle*PI/360.0)
//                         angle[0]=angle[2];
//                 }
//             }
//             else { //for concave vertex with outer offset or convex vertex with inner offset, add two points p[0] and p[1], and the original vertex in between
//                 POINT2D NewVert[3];
//                 NewVert[0] = p[0];
//                 NewContour.push_back(NewVert[0]);
//                 NewVert[1] = *jVertex;
//                 NewContour.push_back(NewVert[1]);
//                 NewVert[2] = p[1];
//                 NewContour.push_back(NewVert[2]);
//             }
//         }
//         RawOffsetCurve.push_back(NewContour);
//     }

//     //clear the temporary raw curve
//     for (iContour=RawCurve.begin(); iContour!=RawCurve.end(); iContour++)
//         iContour->clear();
//     RawCurve.clear();
// }