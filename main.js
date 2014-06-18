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

    MatrixUtil.matrixSize = 4;
    console.log(MatrixUtil.vProduct(MatrixUtil.createTranslationMatrix(3, 2, 1), [1, 2, 3, 1]));

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    context.translate(canvas.width / 2, canvas.height / 2);
    context.transform(1, 0, 0, -1, 0, 0);

    var vector = [100, -100, 0, 1];
    var t = 0;

    /*setInterval(function(){
        context.clearRect(-canvas.width / 2, canvas.height / 2, canvas.width, -canvas.height);
        var transformationMatrix = MatrixUtil.createRotationYMatrix(Math.PI + t);
        var vectorTranslated = MatrixUtil.vProduct(transformationMatrix, vector);
        Vector.draw2DVector(context, vectorTranslated, "#000000");
        //console.log(vector);

        t += 0.01;
    }, 33);*/

    MatrixUtil.logMatrix(MatrixUtil.createTransformationMatrix({shiftX: 10,
                                                                shiftY: 11,
                                                                shiftZ: 12,
                                                                rotationZ: Math.PI / 2}));
}