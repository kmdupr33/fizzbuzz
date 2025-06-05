function fizzBuzz(input) {
    if (input % 3 === 0 && input % 5 === 0 ) {
        console.log("fizzbuzz")
        return;
    }
    if (input % 3 === 0 ) {
        console.log("fizz");
        return;
    }
    if (input % 5 === 0) {
        console.log("buzz");
        return;
    }
}