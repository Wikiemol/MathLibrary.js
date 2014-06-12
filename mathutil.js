function MathUtil() {
	MathUtil.MACHINE_EPSILON;
}

MathUtil.MACHINE_EPSILON = (function() {
	var temp = 1;

	while (temp * 0.5 + 1 != 1)
		temp *= 0.5;

	return temp;
})();

MathUtil.MACHINE_EPSILON_ROOT = Math.sqrt(MathUtil.MACHINE_EPSILON);

/* Funct is the function to be minimized
 *
 * Init is an array of inputs into funct where 
 * the gradient descent will begin.
 *
 * Rate is the rate of descent
 */
 
MathUtil.gradientDescent = function(funct, init, rate, error) {
	var result = init;
	var temp;

	var errorDefault = 0.0000001;
	error = error || errorDefault;

	if (init.length != funct.length)
		throw "The number of parameters does not match initial point length."

	var count = 0;

	var previousDifference;
	do {
		temp = Vector.clone(result);

		for (var i = 0; i < funct.length; i++)
			result[i] = temp[i] - rate * MathUtil.partialDerivative(funct, {withRespectTo: i, at: temp});

		count++;

	/* Find out the correct criteria for stopping the descent */
	/* The uncommented method seems to be working the best*/
	
	//} while(Math.abs(funct.apply(this, result) - funct.apply(this, temp)) > error);
	} while(Vector.scalarDifference(result, temp) > error);

	return result;
}

//Returns two coefficients for the best fit line
//for the data. 
MathUtil.linearRegression = function(data) {
	var linear = function(a, b) {
		var result = 0;

		for (var i = 0; i < data.length; i++)
			result += ((a + b * data[i][0]) - data[i][1]) * ((a + b * data[i][0]) - data[i][1]);

		//console.log(result);
		return result;
	}

	var gd = MathUtil.gradientDescent(linear, [0, 0], 0.001);

	//console.log(linear(gd[0], gd[1]));

	return MathUtil.gradientDescent(linear, [1, 1], 0.01);
}

MathUtil.gcd = function(a, b) {
	if (!b)
        	return a;

    return MathUtil.gcd(b, a % b);
}

MathUtil.derivative = function(f, x, error) {
	if (this.eval.length > 1) 
		throw "This is a multivariable function. Use partial derivative method.";

	var errorDefault = MathUtil.MACHINE_EPSILON_ROOT * x;
	error = error || errorDefault;

	return (f(x + error) - f(x - error)) / (2 * error);
}

/* Params is an object with the following fields:
 *	withRespectTo 	- int denoting the variable number
 * 	at 				- array representing where to evaluate the derivative
 *  error 			- number representing the error in the calculation
 */

MathUtil.partialDerivative = function(f, params) {
	var errorDefault = MathUtil.MACHINE_EPSILON_ROOT * params.at[params.withRespectTo];
	params.error = params.error || errorDefault;
	
	if (!Array.isArray(params.at))
		throw "The partialDerivative 'at' paramater must be an array.";

	var atCopy1 = Vector.clone(params.at);
	atCopy1[params.withRespectTo] -= params.error;

	var atCopy2 = Vector.clone(params.at);
	atCopy2[params.withRespectTo] += params.error;

	return (f.apply(this, atCopy2) - f.apply(this, atCopy1)) / (2 * params.error);
}

//an object representing a / b;
function Quotient(a, b) {
	this.numerator = a;
	this.denominator = b;
}

Quotient.prototype.add = function(q) {
	var denom = q.denominator * this.denominator;
	var numer = this.numerator * q.denominator + q.numerator * this.denominator;
	return new Quotient(numer, denom);
}

Quotient.prototype.subtract = function(q) {
	var denom = q.denominator * this.denominator;
	var numer = this.numerator * q.denominator - q.numerator * this.denominator;
	return new Quotient(numer, denom);
}

Quotient.prototype.simplify = function() {
	var gcd = MathUtil.gcd(this.numerator, this.denominator);
	this.numerator /= gcd;
	this.denominator /= gcd;
}

Quotient.prototype.multiply = function(q) {
	return new Quotient(this.numerator * q.numerator, this.denominator * q.denominator);
}

Quotient.prototype.sProduct = function(a) {
	return new Quotient(this.numerator * a, this.denominator * a);
}