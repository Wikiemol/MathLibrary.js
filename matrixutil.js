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
    MatrixUtil.warnIfWrongSize(matrix1.length);
    MatrixUtil.warnIfWrongSize(matrix2.length);

    var result = MatrixUtil.createMatrix(matrix1.length);

    for (var i = 0; i < matrix1.length; i++) {
        result[i] = matrix1[i] + matrix2[i];
    }

    return result;
}

/* Subtracts two matrices */
MatrixUtil.minus = function(matrix1, matrix2) {
    MatrixUtil.warnIfWrongSize(matrix1.length);
    MatrixUtil.warnIfWrongSize(matrix2.length);

    var result = MatrixUtil.createMatrix(matrix1.length);

    for (var i = 0; i < matrix1.length; i++) {
        result[i] = matrix1[i] - matrix2[i];
    }

    return result;
}

/* Scalar product */
MatrixUtil.sProduct = function(matrix, scalar) {
    MatrixUtil.warnIfWrongSize(matrix.length);

    var result = MatrixUtil.createMatrix(matrix.length);

    for (var i = 0; i < matrix.length; i++) {
        result[i] = matrix[i] * scalar;
    }
    return result;
}

/* Matrix Product */
MatrixUtil.mProduct = function(matrix1, matrix2) {
    MatrixUtil.warnIfWrongSize(matrix1.length);
    MatrixUtil.warnIfWrongSize(matrix2.length);

    var result = MatrixUtil.createMatrix(matrix1.length);

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
MatrixUtil.createMatrix = function(length) {
    var result;
    switch(MatrixUtil.type) {
        case MatrixUtil.FLOAT_32_ARRAY:
            result = new Float32Array(length);
            break;
        case MatrixUtil.ARRAY:
            result = new Array(length);
            break;
        default:
            result = new Float32Array(length);
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
    var row = MatrixUtil.createMatrix(MatrixUtil.matrixSize);

    for (var i = 0; i < MatrixUtil.matrixSize; i++)
        row[i] = MatrixUtil.getElementAtIndex(matrix, rowIndex, i + 1);
    return row;
}

/* Returns the matrix column as an array */
MatrixUtil.getColumnAsArray = function(matrix, columnIndex) {
    MatrixUtil.warnIfWrongSize(matrix.length);
    var column = MatrixUtil.createMatrix(MatrixUtil.matrixSize);

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