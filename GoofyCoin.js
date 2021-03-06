const SHA256 = require("crypto-js/sha256");

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("BLOCK MINED: " + this.hash);
    }
}


class Blockchain{
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
    }

    createGenesisBlock() {
        return new Block(0, "01/01/2018", "Genesis block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

//Let's test our Blockchain by using GoofyCoin

let GoofyCoin = new Blockchain();
console.log('Mining block 1...');
GoofyCoin.addBlock(new Block(1, "15/10/2018", { "from":"Alice","to":"Bob",amount: 4 }));

console.log('Mining block 2...');
GoofyCoin.addBlock(new Block(2, "15/10/2018", { "from":"Bob","to":"Carol",amount: 8 }));

console.log('Mining block 3...');
GoofyCoin.addBlock(new Block(3, "15/10/2018", { "from":"Carol","to":"Diana",amount: 20 }));

console.log('Is Blockchain valid? ' + GoofyCoin.isChainValid());

console.log('Tampering with the second block... Changing the transferred amount to 100 ...');
GoofyCoin.chain[1].data = { "from":"Bob","to":"Carol",amount: 1000 };
GoofyCoin.chain[1].hash = GoofyCoin.chain[1].calculateHash();

console.log("Is Blockchain valid now? " + GoofyCoin.isChainValid());

console.log('\n Printing the Blockchain \n')
console.log(JSON.stringify(GoofyCoin, null, 4));
