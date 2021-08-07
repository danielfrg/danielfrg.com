export function insertBetween(list, item) {
    return list.flatMap((value, index, array) =>
        array.length - 1 !== index // check for the last item
            ? [value, item]
            : value
    );
}
