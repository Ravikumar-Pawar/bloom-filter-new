// index.js
export default class BloomFilter {
    constructor(expectedItems = 1000, falsePositiveRate = 0.01) {
        this.expectedItems = expectedItems;
        this.falsePositiveRate = falsePositiveRate;
        this.size = this.calculateOptimalSize(expectedItems, falsePositiveRate);
        this.bitArray = new Array(this.size).fill(0);
        this.hashCount = this.calculateOptimalHashCount(expectedItems);
        this.itemsAdded = 0;
    }

    calculateOptimalSize(expectedItems, falsePositiveRate) {
        return Math.ceil(-(expectedItems * Math.log(falsePositiveRate)) / (Math.log(2) ** 2));
    }

    calculateOptimalHashCount(expectedItems) {
        return Math.ceil((this.size / expectedItems) * Math.log(2));
    }

    hash(value, seed) {
        let hash = 5381 + seed;
        for (let i = 0; i < value.length; i++) {
            hash = (hash * 33 + value.charCodeAt(i)) % this.size;
        }
        return Math.abs(hash);
    }

    add(value) {
        for (let i = 0; i < this.hashCount; i++) {
            const hash = this.hash(value, i + 1);
            this.bitArray[hash] = 1;
        }
        this.itemsAdded += 1;
    }

    contains(value) {
        for (let i = 0; i < this.hashCount; i++) {
            const hash = this.hash(value, i + 1);
            if (this.bitArray[hash] !== 1) {
                return false;
            }
        }
        return true;
    }

    async loadFromFile(filePath) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error(`Failed to fetch file: ${response.statusText}`);
            const text = await response.text();
            text.split(/\r?\n/).map(word => word.trim()).filter(word => word).forEach(word => this.add(word));
        } catch (error) {
            console.error(`Error loading file: ${error.message}`);
        }
    }

    getInfo() {
        const filledBits = this.bitArray.filter(bit => bit === 1).length;
        const fillPercentage = ((filledBits / this.size) * 100).toFixed(2);
        return {
            expectedItems: this.expectedItems,
            itemsAdded: this.itemsAdded,
            size: this.size,
            hashCount: this.hashCount,
            falsePositiveRate: this.falsePositiveRate,
            filledBits,
            fillPercentage: `${fillPercentage}%`,
        };
    }

    static async fromFile(filePath, expectedItems = 1000, falsePositiveRate = 0.01) {
        const bloomFilter = new BloomFilter(expectedItems, falsePositiveRate);
        await bloomFilter.loadFromFile(filePath);
        return bloomFilter;
    }
}
