export function quickSort(arr: number[], left = 0, right = arr.length - 1): void {
    if (left < right) {
        const pivotIndex = partition(arr, left, right);
        quickSort(arr, left, pivotIndex - 1);
        quickSort(arr, pivotIndex + 1, right);
    }
}

function partition(arr: number[], left: number, right: number): number {
    const pivotValue = arr[right];
    let pivotIndex = left;

    for (let i = left; i < right; i++) {
        if (arr[i] < pivotValue) {
            [arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]]; // Обмен элементов
            pivotIndex++;
        }
    }

    [arr[pivotIndex], arr[right]] = [arr[right], arr[pivotIndex]]; // Возвращаем опорный элемент
    return pivotIndex;
}