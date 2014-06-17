addEventListener('load', Main, false);

function Main() {
    var matrix1 = new Float32Array([1, 2, 3,
                                    4, 5, 6,
                                    7, 8, 9]);

    var matrix2 = new Float32Array([10, 11, 12,
                                    13, 14, 15,
                                    16, 17, 18]);
    MatrixUtil.matrixSize = 3;
    MatrixUtil.logMatrix(matrix1);
    MatrixUtil.logMatrix(matrix2);
    var result = MatrixUtil.minus(matrix1, matrix2);
    MatrixUtil.logMatrix(result);
    var result2 = MatrixUtil.sProduct(matrix1, 2);
    MatrixUtil.logMatrix(result2);

    console.log(MatrixUtil.getRowAsArray(matrix1, 3));
    console.log(MatrixUtil.getColumnAsArray(matrix1, 3));
    MatrixUtil.logMatrix(MatrixUtil.mProduct(matrix1, matrix2));
}
