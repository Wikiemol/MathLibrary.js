function MatrixUtil() {
    /* A library of static functions that treat 
     * arrays as square matrices */
}

MatrixUtil.FLOAT_32_ARRAY = true;
MatrixUtil.ARRAY = false;

/* Determines whether the library will act on
 * regular JS arrays or Float32Arrays.
 */
MatrixUtil.type = MatrixUtil.FLOAT_32_ARRAY;

/* All matrices passed in to any
 * MatrixUtil function will be assumed
 * to be MatrixUtil.matrixSize x MatrixUtil.matrixSize
 * If not, a warning will be thrown (see warnIfWrongSize).
 */
MatrixUtil.matrixSize = 3;

/* Adds two matrices */
MatrixUtil.plus = function(matrix1, matrix2) {
    var result = MatrixUtil.createEmptyMatrix(matrix1.length);

    for (var i = 0; i < matrix1.length; i++) {
        result[i] = matrix1[i] + matrix2[i];
    }

    return result;
}

/* Subtracts two matrices */
MatrixUtil.minus = function(matrix1, matrix2) {
    var result = MatrixUtil.createEmptyMatrix(matrix1.length);

    for (var i = 0; i < matrix1.length; i++) {
        result[i] = matrix1[i] - matrix2[i];
    }

    return result;
}

/* Scalar product */
MatrixUtil.sProduct = function(matrix, scalar) {
    var result = MatrixUtil.createEmptyMatrix(matrix.length);

    for (var i = 0; i < matrix.length; i++) {
        result[i] = matrix[i] * scalar;
    }
    return result;
}

/* Matrix vector product */
MatrixUtil.vProduct = function(matrix, vector) {
    MatrixUtil.warnIfWrongSize(matrix.length);
    MatrixUtil.warnIfWrongSize(vector.length * vector.length);

    var result = MatrixUtil.createEmptyMatrix(vector.length);

    for (var i = 0; i < result.length; i++) {
        result[i] = Vector.dot(MatrixUtil.getRowAsArray(matrix, i + 1), vector);
    }
    return result;
}
/* Matrix Product */
MatrixUtil.mProduct = function(matrix1, matrix2) {
    MatrixUtil.warnIfWrongSize(matrix1.length);
    MatrixUtil.warnIfWrongSize(matrix2.length);

    var result = MatrixUtil.createEmptyMatrix(matrix1.length);

    for (var i = 0; i < MatrixUtil.matrixSize; i++) {
        for (var j = 0; j < MatrixUtil.matrixSize; j++) {
            var element = Vector.dot(MatrixUtil.getRowAsArray(matrix1, i + 1), 
                                     MatrixUtil.getColumnAsArray(matrix2, j + 1));
            MatrixUtil.setElementAtIndex(result, i + 1, j + 1, element);
        }
    }
    return result;
}

/* Sets an element at a given index */
MatrixUtil.setElementAtIndex = function(matrix, i, j, value) {
    MatrixUtil.warnIfWrongSize(matrix.length);
    var index = MatrixUtil.convertMatrixIndexToArrayIndex(i, j);
    MatrixUtil.matrixIndexOutOfBounds(matrix, i, j, index);
    matrix[index] = value;
}

/* Returns the element at the given index */
MatrixUtil.getElementAtIndex = function(matrix, a, b) {
    MatrixUtil.warnIfWrongSize(matrix.length);
    var index = MatrixUtil.convertMatrixIndexToArrayIndex(a, b);
    MatrixUtil.matrixIndexOutOfBounds(matrix, a, b, index);
    return matrix[index];
}

/* Throws an error if the index is out of bounds */
MatrixUtil.matrixIndexOutOfBounds = function(matrix, i, j, index) {
    if (index > matrix.length - 1 || index < 0)
        throw "MatrixIndexOutOfBoundsError: The index (" + i + ", " + j + ") is out of bounds.";
}

MatrixUtil.convertMatrixIndexToArrayIndex = function(a, b) {
    return (a - 1) * MatrixUtil.matrixSize + (b - 1);
}

/* Creates an empty array of the right type and
 * length based on MatrixUtil.type.
 */
MatrixUtil.createEmptyMatrix = function(length) {
    var result;
    switch(MatrixUtil.type) {
        case MatrixUtil.FLOAT_32_ARRAY:
            result = new Float32Array(length);
            break;
        case MatrixUtil.ARRAY:
            result = new Array(length);
            break;
        default:
            MatrixUtil.wrongTypeError();
            break;
    }

    return result;
}

/* Neatly console.logs a matrix */
MatrixUtil.logMatrix = function(matrix) {
    MatrixUtil.warnIfWrongSize(matrix.length);

    var matrixString = "";
    for (var i = 1; i <= MatrixUtil.matrixSize; i++) {
        matrixString += "|"
        for (var j = 1; j < MatrixUtil.matrixSize; j++) {
            matrixString += MatrixUtil.getElementAtIndex(matrix, i, j) + ", "
        }

        matrixString += MatrixUtil.getElementAtIndex(matrix, i, j) + "|\n"
    }
    console.log(matrixString);
}

/* Returns the matrix row as an array */
MatrixUtil.getRowAsArray = function(matrix, rowIndex) {
    MatrixUtil.warnIfWrongSize(matrix.length);
    var row = MatrixUtil.createEmptyMatrix(MatrixUtil.matrixSize);

    for (var i = 0; i < MatrixUtil.matrixSize; i++)
        row[i] = MatrixUtil.getElementAtIndex(matrix, rowIndex, i + 1);
    return row;
}

/* Returns the matrix column as an array */
MatrixUtil.getColumnAsArray = function(matrix, columnIndex) {
    MatrixUtil.warnIfWrongSize(matrix.length);
    var column = MatrixUtil.createEmptyMatrix(MatrixUtil.matrixSize);

    for (var i = 0; i < MatrixUtil.matrixSize; i++)
        column[i] = MatrixUtil.getElementAtIndex(matrix, i + 1, columnIndex);
    return column;
}

/* Takes the length of a matrix array as an argument
 * and warns the user if the matrix is the wrong size.
 * Returns true if the matrix is the wrong size and
 * false if it is the right size.
 */
MatrixUtil.warnIfWrongSize = function(length) {

    if (length != MatrixUtil.matrixSize * MatrixUtil.matrixSize) {
        console.warn("WrongSizeWarning: A matrix passed in to MatrixUtil is not the size specified by matrixSize <" + MatrixUtil.matrixSize + ">");
        return true;
    }

    return false;
}

/* Returns a 4x4 transformation matrix with the given attributes
 * 
 * @params.rotationX
 * @params.rotationY
 * @params.rotationZ
 * @params.shiftX
 * @params.shiftY
 * @params.shiftZ
 */
MatrixUtil.createTransformationMatrix = function(params) {
    if(!params)
        params = {};

    if (params.rotationX != 0 && !params.rotationX)
        params.rotationX = 0;

    if (params.rotationY != 0 && !params.rotationY)
        params.rotationY = 0;

    if (params.rotationZ != 0 && !params.rotationZ)
        params.rotationZ = 0;

    if (params.shiftX != 0 && !params.shiftX)
        params.shiftX = 0;

    if (params.shiftY != 0 && !params.shiftY)
        params.shiftY = 0;

    if (params.shiftZ != 0 && !params.shiftZ)
        params.shiftZ = 0;

    var rotationX = MatrixUtil.createRotationXMatrix(params.rotationX);
    var rotationY = MatrixUtil.createRotationYMatrix(params.rotationY);
    var rotationZ = MatrixUtil.createRotationZMatrix(params.rotationZ);

    var translation = MatrixUtil.createTranslationMatrix(params.shiftX, params.shiftY, params.shiftZ)

    /* Shorthand for matrix multiply */
    var m = MatrixUtil.mProduct;

    var result = m(m(m(rotationX, rotationY), rotationZ), translation);
    return result;
}

/* Returns a 4x4 matrix that will rotate a vector 
 * theta radians about the X axis.
 */
MatrixUtil.createRotationXMatrix = function(theta) {
    var cos = Math.cos(theta);
    var sin = Math.sin(theta);
    var result = MatrixUtil.createMatrix([1, 0,    0,   0,
                                          0, cos, -sin, 0,
                                          0, sin,  cos, 0,
                                          0, 0,    0,   1]);
    return result;
}

/* Returns a 4x4 matrix that will rotate a vector 
 * theta radians about the Y axis.
 */
MatrixUtil.createRotationYMatrix = function(theta) {
    var cos = Math.cos(theta);
    var sin = Math.sin(theta);
    var result = MatrixUtil.createMatrix([ cos, 0, sin, 0,
                                           0,   1, 0,   0,
                                          -sin, 0, cos, 0,
                                           0,   0, 0,   1]);
    return result;
}

/* Returns a 4x4 matrix that will rotate a vector 
 * theta radians about the Z axis.
 */
MatrixUtil.createRotationZMatrix = function(theta) {
    var cos = Math.cos(theta);
    var sin = Math.sin(theta);
    var result = MatrixUtil.createMatrix([cos, -sin, 0, 0,
                                          sin,  cos, 0, 0,
                                          0,    0,   1, 0,
                                          0,    0,   0, 1]);

    return result;
}

/* Returns a 4x4 translation matrix that shifts a vector
 * by shiftX, shiftY, and shiftZ.
 */
MatrixUtil.createTranslationMatrix = function(shiftX, shiftY, shiftZ) {
    var result = MatrixUtil.createMatrix([1, 0, 0, shiftX,
                                          0, 1, 0, shiftY,
                                          0, 0, 1, shiftZ,
                                          0, 0, 0, 1])
    return result;
}

/* Creates a matrix of the given values and
 * the correct type.
 */
MatrixUtil.createMatrix = function(array) {
    var result;
    switch(MatrixUtil.type) {
        case MatrixUtil.FLOAT_32_ARRAY:
            result = new Float32Array(array);
            break;
        case MatrixUtil.ARRAY:
            result = array;
            break;
        default:
            MatrixUtil.wrongTypeError();
            break;
    }
    return result
}


/* Should be thrown when MatrixUtil.type is set
 * to something that is not known as a type.
 */
MatrixUtil.wrongTypeError = function() {
    throw "WrongTypeError: MatrixUtil.type must be set to either MatrixUtil.FLOAT_32_ARRAY or MatrixUtil.ARRAY";
}