/**
 * LS-8 v2.0 emulator skeleton code
 */

/**
 * Class for simulating a simple Computer (CPU & memory)
 */
class CPU {

    /**
     * Initialize the CPU
     */
    constructor(ram) {
        this.ram = ram;

        this.reg = new Array(8).fill(0); // General-purpose registers R0-R7

        // Special-purpose registers
        this.PC = 0; // Program Counter
    }

    /**
     * Store value in memory address, useful for program loading
     */
    poke(address, value) {
        this.ram.write(address, value);
    }

    /**
     * Starts the clock ticking on the CPU
     */
    startClock() {
        this.clock = setInterval(() => {
            this.tick();
        }, 1); // 1 ms delay == 1 KHz clock == 0.000001 GHz
    }

    /**
     * Stops the clock
     */
    stopClock() {
        clearInterval(this.clock);
    }

    /**
     * ALU functionality
     *
     * The ALU is responsible for math and comparisons.
     *
     * If you have an instruction that does math, i.e. MUL, the CPU would hand
     * it off to it's internal ALU component to do the actual work.
     *
     * op can be: ADD SUB MUL DIV INC DEC CMP
     */
    alu(op, regA, regB) {
        switch (op) {
            case 'ADD':
                regA = (parseInt(regA, 2) + parseInt(regB, 2)).toString(2);
            case 'HLT':
                this.stopClock();
            case 'LDI':
                let index = parseInt(regA, 2);
                this.reg[index] = parseInt(regB, 2);
            case 'MUL':
                // !!! IMPLEMENT ME
                regA = (parseInt(regA, 2) * parseInt(regB, 2)).toString(2);
            case 'PRN':
                let index = parseInt(regA, 2);
                console.log(this.reg[index]);
            default:
                break;
        }
    }

    /**
     * Advances the CPU one cycle
     */
    tick() {
        // Load the instruction register (IR--can just be a local variable here)
        // from the memory address pointed to by the PC. (I.e. the PC holds the
        // index into memory of the instruction that's about to be executed
        // right now.)

        // !!! IMPLEMENT ME
        let IR = this.ram.read(this.PC);

        // Debugging output
        console.log(`${this.PC}: ${IR.toString(2)}`);

        // Get the two bytes in memory _after_ the PC in case the instruction
        // needs them.

        // !!! IMPLEMENT ME
        let operandA = this.read.read(this.PC + 1);
        let operandB = this.read.read(this.PC + 2);

        // Execute the instruction. Perform the actions for the instruction as
        // outlined in the LS-8 spec.

        // !!! IMPLEMENT ME
        const table = {
            10101000: () => this.alu('ADD', operandA, operandB),
            00000001: () => this.alu('HLT'),
            10011001: () => this.alu('LDI', operandA, operandB),
            10101010: () => this.alu('MUL', operandA, operandB),
            01000011: () => this.alu('PRN', operandA),
        }

        if (table[IR]) {
            table[IR]();
        } else {
            console.log(IR.toString(2));
        }

        // Increment the PC register to go to the next instruction. Instructions
        // can be 1, 2, or 3 bytes long. Hint: the high 2 bits of the
        // instruction byte tells you how many bytes follow the instruction byte
        // for any particular instruction.

        // !!! IMPLEMENT ME
        let binary = IR.toString(2);
        let length = binary[0] + binary[1]
        switch (length) {
            case '10':
                this.PC += 3;
            case '01':
                this.PC += 2;
            default:
                this.PC += 1;
        }
    }
}

module.exports = CPU;
