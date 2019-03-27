
// prototype methodss
/*
Array.prototype.myForEach = function(func) {
	for (var i = 0; i <this.length; i++) {
		func(this[i]);
	}
};


Array.prototype.sum = function(){
	var sum=0; 
	this.forEach(function(num){
		sum += num ; 
	});
	return sum;
}
*/

// quiz - 1  /// IIFE!!!!!!!!
/* 
(function(){
	function Question(question,answers,correctAnswer){
		this.question = question;
		this.answers = answers;
		this.correct = correctAnswer;
	}
	
	Question.prototype.displayQuestion = function(){
		console.log(this.question);
		for (let i = 0; i < this.answers.length; i++) {
			console.log(i + " : " + this.answers[i]);
		}
	}
	
	Question.prototype.checkAnswer = function(ans){
		if(ans === this.correct){
			console.log("Answer is Correct!!!");
		} else {
			console.log("Answer is not correct!!!");
		}
	}
	
	var q1 = new Question("Who are you?",["programmer","nerb","freak"] ,0);
	var q2 = new Question("How old am i?",["12","13","23"] , 2);
	var q3 = new Question("What language can u speak in?",["Eng","Chinese","Kor"] ,0);
	
	var questions = [];
	
	questions.push(q1);
	questions.push(q2);
	questions.push(q3);
	
	var question = questions[Math.floor(Math.random()*3)];
	question.displayQuestion();
	var answer = parseInt(prompt("Answer The Question"));
	question.checkAnswer(answer);
})();
*/


// quiz 2 
	function Question(question,answers,correctAnswer){
		this.question = question;
		this.answers = answers;
		this.correct = correctAnswer;
	}

	var q1 = new Question("Who are you?",["programmer","nerb","freak"] ,0);
	var q2 = new Question("How old am i?",["12","13","23"] , 2);
	var q3 = new Question("What language can u speak in?",["Eng","Chinese","Kor"] ,0);
	
	var questions = [];
	
	questions.push(q1);
	questions.push(q2);
	questions.push(q3);
	
	Question.prototype.displayQuestion = function(){
		console.log(this.question);
		for (let i = 0; i < this.answers.length; i++) {
			console.log(i + " : " + this.answers[i]);
		}
	}
	
	Question.prototype.checkAnswer = function(ans,callback){
		var sc;
		if(ans === this.correct){
			console.log("Answer is Correct!!!");
			sc = callback(true);
		} else {
			console.log("Answer is not correct!!!");
			sc = callback(false);		
		}
		this.displayScore(sc);
	}

	Question.prototype.displayScore =function(score){
		console.log("Your Current Score is " + score);
		console.log("______________________________");
	}



	function score(){
		var sc = 0;
		return function(correct){
			if(correct) {
				sc++;
			} 
			return sc;
		}
	}

	var keepScore = score(); 
	
	function nextQuestion(){
		var question = questions[Math.floor(Math.random()*3)];
		question.displayQuestion();
		var answer = prompt("Answer The Question !!!");
		
		if(answer !== "exit"){
			question.checkAnswer(parseInt(answer),keepScore);
			nextQuestion();
		}		
	}

	nextQuestion();	


	
	
	
	

	

	













