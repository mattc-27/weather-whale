export function round(value, digits = 0) {
    if (value == null || value === "") return null;

    const num = Number(value);

    if (Number.isNaN(num)) return null;

    const factor = 10 ** digits;
    return Math.round(num * factor) / factor;
}