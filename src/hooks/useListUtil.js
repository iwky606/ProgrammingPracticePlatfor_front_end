export function useBestRowNumber() {
    const rowHeight = 46;
    const headerHeight = 60;

    const bestRowNumber = Math.floor((window.innerHeight - headerHeight) / rowHeight);

    return bestRowNumber;
}