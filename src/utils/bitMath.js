
export const BIT_LENGTH = 64n;

export const getBit = (value, position) => {
    return (value >> BigInt(position)) & 1n;
};

export const setBit = (value, position, bitState) => {
    if (bitState) {
        return value | (1n << BigInt(position));
    } else {
        return value & ~(1n << BigInt(position));
    }
};

export const toggleBit = (value, position) => {
    return value ^ (1n << BigInt(position));
};

export const getRange = (value, start, end) => {
    // start is MSB, end is LSB in the range logic typically, but let's handle both
    const high = start > end ? start : end;
    const low = start > end ? end : start;

    const mask = ((1n << BigInt(high - low + 1)) - 1n) << BigInt(low);
    return (value & mask) >> BigInt(low);
};

export const setRange = (value, start, end, newValue) => {
    const high = start > end ? start : end;
    const low = start > end ? end : start;

    const mask = ((1n << BigInt(high - low + 1)) - 1n) << BigInt(low);
    const cleared = value & ~mask;
    const newPart = (BigInt(newValue) << BigInt(low)) & mask;
    return cleared | newPart;
};
