const RAM = require('./ram');
const CPU = require('./cpu');
const fs = require('fs');

const argv = process.argv.slice(2);
const file = argv[0];

const filedata = fs.readFileSync(file, "utf8");
const lines = filedata.trim().split(/[\r\n]+/g).filter(line => line[0] != '#');

/**
 * Load an LS8 program into memory
 *
 * TODO: load this from a file on disk instead of having it hardcoded
 */
function loadMemory() {

    // Hardcoded program to print the number 8 on the console

    const program = [];
    lines.forEach(line => program.push(line.split(' ')[0]));

    // Load the program into the CPU's memory a byte at a time
    for (let i = 0; i < program.length; i++) {
        cpu.poke(i, parseInt(program[i], 2));
    }
}

/**
 * Main
 */

let ram = new RAM(256);
let cpu = new CPU(ram);

// TODO: get name of ls8 file to load from command line

loadMemory(cpu);

cpu.startClock();