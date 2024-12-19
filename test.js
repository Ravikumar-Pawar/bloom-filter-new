// test.js
import BloomFilter from './index.js';
import fs from 'fs';
import path from 'path';

// Modify the loadFromFile method for Node.js
BloomFilter.prototype.loadFromFile = async function (filePath) {
    try {
        const fullPath = path.resolve(filePath); // Ensure it's an absolute path
        const text = fs.readFileSync(fullPath, 'utf-8'); // Read the file synchronously
        text.split(/\r?\n/).map(word => word.trim()).filter(word => word).forEach(word => this.add(word));
    } catch (error) {
        console.error(`Error loading file: ${error.message}`);
    }
};

async function testBloomFilter() {
    // Test case 1: Initialize BloomFilter and add some items
    const bloomFilter = new BloomFilter(1000, 0.01);
    console.log('Test Case 1: Initialization and Add');
    console.log('Initial info:', bloomFilter.getInfo());

    // Add items
    bloomFilter.add('apple');
    bloomFilter.add('banana');
    bloomFilter.add('cherry');
    console.log('After adding 3 items:', bloomFilter.getInfo());

    // Test if contains
    console.log('Contains apple:', bloomFilter.contains('apple')); // Should be true
    console.log('Contains banana:', bloomFilter.contains('banana')); // Should be true
    console.log('Contains orange:', bloomFilter.contains('orange')); // Should be false (or a false positive)

    // Test case 2: Test false positive rate (random large set)
    const bloomFilter2 = new BloomFilter(10000, 0.01);
    console.log('Test Case 2: Large BloomFilter');
    bloomFilter2.add('dog');
    bloomFilter2.add('cat');
    bloomFilter2.add('fish');

    console.log('Contains dog:', bloomFilter2.contains('dog')); // Should be true
    console.log('Contains cat:', bloomFilter2.contains('cat')); // Should be true
    console.log('Contains fish:', bloomFilter2.contains('fish')); // Should be true
    console.log('Contains bird:', bloomFilter2.contains('bird')); // Should be false with high probability

    // Test case 3: Load data from a file
    console.log('Test Case 3: Load from file');
    const bloomFilterFromFile = await BloomFilter.fromFile('words.txt');
    console.log('BloomFilter loaded from file, info:', bloomFilterFromFile.getInfo());

    // Test case 4: Check filled bits and size
    console.log('Test Case 4: Check filled bits and size');
    const filledBits = bloomFilterFromFile.getInfo().filledBits;
    const totalSize = bloomFilterFromFile.getInfo().size;
    console.log(`Filled Bits: ${filledBits}`);
    console.log(`Bloom Filter Size: ${totalSize}`);

    // Test case 5: False Positive Rate Test (Edge case)
    const edgeCaseFilter = new BloomFilter(1000, 0.001); // Higher false positive rate
    edgeCaseFilter.add('test1');
    edgeCaseFilter.add('test2');
    console.log('Contains test1:', edgeCaseFilter.contains('test1')); // Should be true
    console.log('Contains test2:', edgeCaseFilter.contains('test2')); // Should be true
    console.log('Contains test3:', edgeCaseFilter.contains('test3')); // Should be false (or possibly false positive)

    console.log('All tests completed!');
}

testBloomFilter();
