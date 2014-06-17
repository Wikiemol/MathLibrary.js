function Matrix(/*rows as arrays or array of arrays*/) {
	this.matrixArray = [];

	if (Array.isArray(arguments[0]) && Array.isArray(arguments[0][0]))
		for (var i = 0; i < arguments[0].length; i++)
			this.matrixArray.push(arguments[0][i]);
	else
		for (var i = 0; i < arguments.length; i++)
			this.matrixArray.push(arguments[i]);

	this.width = this.matrixArray[0].length;
	this.height = this.matrixArray.length;
	this.rational = false;
}

//this allows for integer matrices to stay accurate
Matrix.prototype.rationalize = function() {
	for (var i = 0; i < this.height; i++)
		for (var j = 0; j < this.width; j++)
			this.matrixArray[i][j] = new Quotient(this.matrixArray[i][j], 1);
	this.rational = true;
}

Matrix.prototype.sProduct = function(a) {
	for (var i = 0; i < this.matrixArray.length; i++)
		Vector.sProduct(this.matrixArray[i], a);
}

Matrix.prototype.mProduct = function(m) {
	if (m.width != this.height) {
		console.warn("mProduct failed due to incompatible matrix dimensions.")
		return;
	}
	var array = [];
	for (var i = 0; i < this.height; i++) {
		array.push([]);
		for (var j = 0; j < this.width; j++)
			array[i].push(Vector.dot(this.matrixArray[i], m.getColumnVector(j)));
	}
	
	return new Matrix(array);
}

Matrix.prototype.vProduct = function(v) {
	var result = new Vector();
	for (var i = 0; i < this.height; i++)
		result.push(Vector.dot(this.matrixArray[i], v));
	return result;
}

Matrix.prototype.getColumnVector = function(j) {
	var columnVector = [];

	for (var i = 0; i < this.height; i++)
		columnVector.push(this.matrixArray[i][j]);

	return columnVector;
}

Matrix.prototype.print = function() {
	for (var i = 0; i < this.height; i++) {
		var string = "|";
		for (var j = 0; j < this.width; j++)
			string += this.matrixArray[i][j] + " ";
		string += "|";
		console.log(string);
	}
}

Matrix.prototype.transpose = function() {
	var array = [];

	for (var i = 0; i < this.width; i++)
		array.push(this.getColumnVector(i));

	this.matrixArray = array;
	this.height = array.length;
	this.width = array[0].length;
}


Matrix.prototype.at = function(i, j) {
	return this.matrixArray[i][j];
}

Matrix.prototype.inverse = function() {
	if (this.width != this.height) {
		console.warn("inversion failed. Matrix is not square.")
		return;
	}

	if (this.determinant == 0)
		return;

	var result = this.adjoint();
	result.sProduct(1 / this.determinant())
	return result;
}

Matrix.prototype.determinant = function() {
	if (this.width != this.height) {
		console.warn("determinant failed. Matrix is not square.")
		return;
	}

	if (this.width == 2)
		return this.at(0, 0) * this.at(1, 1) - this.at(1, 0) * this.at(0, 1);
	
	var currentSign = 1;
	var result = 0;
	for (var i = 0; i < this.width; i++) {
		var m = this.minor(0, i);
		result += currentSign * this.at(0, i) * m.determinant();
		currentSign *= -1;
	}

	return result;
}

Matrix.prototype.clone = function() {
	return new Matrix(this.matrixArray);
}

//returns the minor of the matrix at a, b
Matrix.prototype.minor = function(b, a) {
	var array = [];
	for (var i = 0; i < this.height; i++) {
		if (i != b) {
			array.push([]);
			for (var j = 0; j < this.width; j++) {
				if (j != a) {
					array[array.length - 1].push(this.matrixArray[i][j]);
				}
			}
		}
	}

	return new Matrix(array);
}

Matrix.prototype.cofactorMatrix = function() {
	var array = [];
	var signsSign = 1
	for (var i = 0; i < this.height; i++) {
		array.push([]);
		var sign = signsSign;
		for (var j = 0; j < this.width; j++) {
			var m = this.minor(i, j);
			array[i][j] = m.determinant() * sign;
			sign *= -1;
		}
		signsSign *= -1;

	}


	return new Matrix(array);
}

Matrix.prototype.adjoint = function() {
	var c = this.cofactorMatrix();
	c.transpose();
	return c;
}

Matrix.prototype.set = function(i, j, value) {
	this.matrixArray[i][j] = value;
}

//Solves a system of linear equations of the form
//this * [x_1, x_2, ... , x_n] = array
//using gaussian elimination.
Matrix.prototype.solve = function(a) {

	if (this.determinant() == 0)
		return;
	var mClone = this.clone();
	mClone.gaussianElimination(a);
	return mClone.backSubstitution(a);

}

//Takes an array that has already been reduced
//by gaussian elimination and returns an array of solutions for x;
Matrix.prototype.backSubstitution = function(a) {
	if (a.length != this.height) {
		console.warn("backSubstitution failed due to incompatible array-matrix dimensions.");
		return;
	}
	var i = 0;
	var solutions = [a[a.length - 1] / this.matrixArray[this.height - 1][this.width - 1]];
	for (var i = this.height - 2; i >= 0; i--) {
		var row = this.matrixArray[i].slice(i + 1, this.width);
		var s_i = (a[i] - Vector.dot(row, solutions)) / this.matrixArray[i][i];
		solutions.unshift(s_i);
	}
	return solutions;
}

Matrix.prototype.gaussianElimination = function(a, useQuotientObject) {
	if (a.length != this.height) {
		console.warn("gaussianElimination failed due to incompatible array-matrix dimensions.")
		return;
	}

	for (var i = 0; i < this.height; i++) {
		for (var j = i + 1; j < this.height; j++) {
			var m = this.at(j, i) / this.at(i, i);
			a[j] -= m * a[i];

			for (var k = 0; k < this.width; k++)
				this.matrixArray[j][k] -= m * this.at(i, k);
		}
	}
}

/* TranslationMatrix
 * 
 * A 4x4 translation matrix representation 
 * using a Float32Array.
 *
 * @param params.shiftX
 * @param params.shiftY
 * @param params.shiftZ
 * @param params.rotationX
 * @param params.rotationY
 * @param params.rotationZ
 */
Matrix.prototype.createTranslationMatrix = function(params) {

    this.shiftX = params.shiftX;
    this.shiftY = params.shiftY;
    this.shiftZ = params.shiftZ;

    this.rotationX = params.rotationX;
    this.rotationY = params.rotationY;
    this.rotationZ = params.rotationZ;

    if (!params.shiftX)
        this.shiftX = 0;

    if (!params.shiftY)
        this.shiftY = 0;

    if (!params.shiftZ)
        this.shiftZ = 0;

    if (!params.rotationX)
        this.rotationX = 0;

    if (!params.rotationY)
        this.rotationY = 0;

    if (!params.rotationZ)
        this.rotationZ = 0;

    this.matrixArray = new Float32Array([]);
}