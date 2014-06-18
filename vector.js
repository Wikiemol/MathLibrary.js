//a library for treating arrays as vectors
function Vector() {}

Vector.cross = function(a1, a2) {
	if (a1.length != 3 || a2.length != 3)
		return;

	return [a1[1]*a2[2] - a1[2]*a2[1], a1[2]*a2[0] - a1[0]*a2[2], a1[0]*a2[1] - a1[1]*a2[0]];
}

Vector.sProduct = function(a, s) {
	for (var i = 0; i < a.length; i++)
		a[i] *= s;
}

Vector.clone = function(a) {
	var array = [];
	for (var i = 0; i < a.length; i++)
		array[i] = a[i];
	
	return array;
}

Vector.dot = function(a1, a2) {
        var result = 0;
        for (var i = 0; i < a1.length; i++)
                result += a1[i] * a2[i];
        return result;
}

Vector.print = function(a) {
    var string = "<";
    for (var i = 0; i < a.length; i++)
        string += a[i] + " ";
    console.log(string + ">");
}

//A way of testing the closeness of two vectors
//without using square roots.
Vector.scalarDifference = function(v1, v2) {
    var result = 0;

    for (var i = 0; i < v1.length; i++)
        result += v1[i] - v2[i];
    
    return result;
}

/* Draws a 2d vector onto an html5 canvas given a canvas context.
 * If the vectors length is greater than 2, then the indices
 * greater than 2 will be ignored.
 */
Vector.draw2DVector = function(context, vector, color) {
    var tempStrokeStyle = context.strokeStyle;
    var tempFillStyle = context.fillStyle;
    context.strokeStyle = color;
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(vector[0], vector[1]);
    context.stroke();
    context.fillRect(vector[0], vector[1], 5, 5);
    context.strokeStyle = tempStrokeStyle;
    context.fillStyle = tempFillStyle;
}
