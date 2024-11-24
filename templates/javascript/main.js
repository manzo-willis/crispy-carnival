// src/main.js

// Example class using modern JavaScript features
class Calculator {
	constructor() {
		this.history = [];
	}

	add(a, b) {
		const result = a + b;
		this.history.push(`${a} + ${b} = ${result}`);
		return result;
	}

	subtract(a, b) {
		const result = a - b;
		this.history.push(`${a} - ${b} = ${result}`);
		return result;
	}

	multiply(a, b) {
		const result = a * b;
		this.history.push(`${a} * ${b} = ${result}`);
		return result;
	}

	divide(a, b) {
		if (b === 0) {
			throw new Error("Division by zero is not allowed");
		}
		const result = a / b;
		this.history.push(`${a} / ${b} = ${result}`);
		return result;
	}

	getHistory() {
		return [...this.history];
	}
}

// Example of modern JavaScript features that will be transpiled
const asyncOperation = async () => {
	try {
		// Simulating an API call
		const response = await fetch('https://api.example.com/data');
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching data:', error);
		return null;
	}
};

// Example of using the calculator
const calculator = new Calculator();

// Using array methods and arrow functions
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((num) => calculator.multiply(num, 2));
const summed = numbers.reduce((acc, curr) => calculator.add(acc, curr), 0);

// Export for use in other modules
export {
	Calculator,
	asyncOperation,
	doubled,
	summed,
};