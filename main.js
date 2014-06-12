addEventListener('load', Main, false);

function Main() {
	var f = function(x, y) {
		return (x - 1) * (x - 1) + (y - 1) * (y - 1) - 1;
	};


	console.log(MathUtil.gradientDescent(f, [-19, -19], 0.001));
    //console.log(MathUtil.partialDerivative(f, {withRespectTo: 0, at: [1]}));


	//var data = [[0, 0], [1, 1], [2, 2], [3, 3]];
	//MathUtil.linearRegression(data);
	//Vector.print(MathUtil.linearRegression(data));
}
