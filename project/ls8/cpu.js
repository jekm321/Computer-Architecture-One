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
        this.operandA = null;
        this.operandB = null;
        const SP = 7;
        this.reg[SP] = 244;
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
    // !!! IMPLEMENT ME
    alu(op, regA, regB) {
        switch (op) {
            case 'ADD':
                this.reg[this.operandA] += this.reg[this.operandB]
            case 'MUL':
                this.reg[this.operandA] = this.reg[this.operandA] * this.reg[this.operandB];
            default:
                break;
        }
    }

    HLT() {
        this.stopClock();
    }

    LDI() {
        this.reg[this.operandA] = this.operandB;
    }

    POP() {
        this.reg[this.operandA] = this.ram.read[this.reg[SP]];
        this.reg[7]++;
    }

    PRN() {
        console.log(this.reg[this.operandA]);
    }

    PUSH() {
        this.reg[SP]--;
        this.ram.write(this.reg[SP], this.reg[this.operandA]);
    }

    // CALL(regA, regB) {
    //     this.PUSH(regB)
    //     this.PC = this.reg[regA];
    // }

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
        this.operandA = this.ram.read(this.PC + 1);
        this.operandB = this.ram.read(this.PC + 2);

        // Execute the instruction. Perform the actions for the instruction as
        // outlined in the LS-8 spec.

        // !!! IMPLEMENT ME
        const table = {
            0b10101000: () => this.alu('ADD'),
            0b00000001: () => this.HLT(),
            0b10011001: () => this.LDI(),
            0b10101010: () => this.alu('MUL'),
            0b01001100: () => this.POP(),
            0b01000011: () => this.PRN(),
            0b01001101: () => this.PUSH(),
            // 0b01001000: () => this.CALL(),
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
        let length = IR >> 6;
        switch (length) {
            case 2:
                this.PC += 3;
                break;
            case 1:
                this.PC += 2;
                break;
            default:
                this.PC += 1;
                break;
        }
    }
}

module.exports = CPU;