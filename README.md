# bloom-filter-new

A simple **Bloom Filter** implementation in JavaScript (ES6). Bloom Filters are probabilistic data structures that allow you to test if an element is in a set with a small chance of false positives but no false negatives.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Usage](#usage)
4. [API Reference](#api-reference)
5. [How It Works](#how-it-works)
6. [License](#license)

---

## Introduction

Bloom Filters are useful when you need to:

- Check for set membership quickly.
- Optimize memory usage for large datasets where traditional data structures (like sets) are too memory-intensive.
- Tolerate a small rate of false positives (incorrectly indicating that an element is present) while ensuring no false negatives (correctly indicating that an element is definitely not present).

This implementation allows you to:

- Create a Bloom Filter with a customizable false positive rate.
- Add elements to the filter.
- Check if an element might be present.
- Load elements from a `.txt` file asynchronously.

---

## Installation

Install the package via npm:

```bash
npm install bloom-filter-new
```

---

## Usage

### Importing the Bloom Filter

```javascript
import BloomFilter from 'bloom-filter-new';
```

### Creating a Bloom Filter

Create a new Bloom Filter with a specified number of expected items and a false positive rate.

```javascript
const bloom = new BloomFilter(1000, 0.01); // 1000 expected items, 1% false positive rate
```

### Adding Elements

Add elements to the Bloom Filter using the `add` method.

```javascript
bloom.add('apple');
bloom.add('banana');
```

### Checking for Elements

Check if an element might be in the filter using the `contains` method.

```javascript
console.log(bloom.contains('apple'));    // true (might be present)
console.log(bloom.contains('grape'));    // false (definitely not present)
```

### Loading Words from a File

If you have a `.txt` file with one word per line, you can load these words asynchronously.

Example `words.txt`:

```
apple
banana
cherry
```

```javascript
(async () => {
    const bloom = await BloomFilter.fromFile('words.txt', 1000, 0.01);
    console.log(bloom.contains('apple'));  // true
    console.log(bloom.contains('grape'));  // false
})();
```

### Getting Bloom Filter Info

Retrieve information about the Bloom Filter, such as size, number of hash functions, and fill percentage.

```javascript
console.log(bloom.getInfo());
```

Example Output:

```json
{
  "expectedItems": 1000,
  "itemsAdded": 3,
  "size": 9586,
  "hashCount": 7,
  "falsePositiveRate": 0.01,
  "filledBits": 21,
  "fillPercentage": "0.22%"
}
```

---

## API Reference

### `constructor(expectedItems = 1000, falsePositiveRate = 0.01)`

Creates a new Bloom Filter.

- **`expectedItems`**: Number of items expected to be stored.
- **`falsePositiveRate`**: Desired false positive rate (e.g., `0.01` for 1%).

### `add(value)`

Adds a string `value` to the Bloom Filter.

```javascript
bloom.add('example');
```

### `contains(value)`

Checks if a string `value` might be in the Bloom Filter.

Returns `true` if the value might be present, otherwise `false`.

```javascript
bloom.contains('example'); // true or false
```

### `async loadFromFile(filePath)`

Loads words from a `.txt` file and adds them to the Bloom Filter.

```javascript
await bloom.loadFromFile('words.txt');
```

### `getInfo()`

Returns detailed information about the Bloom Filter.

```javascript
console.log(bloom.getInfo());
```

### `static async fromFile(filePath, expectedItems = 1000, falsePositiveRate = 0.01)`

Creates and loads a Bloom Filter from a `.txt` file.

```javascript
const bloom = await BloomFilter.fromFile('words.txt');
```

---

## How It Works

A Bloom Filter uses multiple hash functions to set bits in a fixed-size bit array. When checking for an element, the same hash functions are used to verify if all the corresponding bits are set:

- **False Positives**: The filter may return `true` for elements not in the set due to hash collisions.
- **False Negatives**: The filter never returns `false` for elements that were added.

### Formulae Used

1. **Optimal Bit Array Size (m):**

   ```
   m = -(n * log(p)) / (log(2) ^ 2)
   ```
   Where:
   - `n` = Expected number of items
   - `p` = False positive rate

2. **Optimal Number of Hash Functions (k):**

   ```
   k = (m / n) * log(2)
   ```

---

## License

This project is licensed under the **MIT License**.

---

Happy filtering! 🚀

