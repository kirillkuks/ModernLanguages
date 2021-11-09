# А в Питоне ли дело?
# Реализовать сортировку пузырьком на языке C, подключить в Питон
# через Cython или Ctype, и протестировать ускорение относительно
# аналогичной реализации на чистом Python


import ctypes
import numpy as np
import time


def bubble_sort(arr: np.array(int)) -> None:
    for i in range(arr.size):
        swapped = False

        for j in range(arr.size - 1 - i):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True

        if not swapped:
            break


def sort_compare(dll_name: str, sizes: np.array(int)) -> None:
    lib = ctypes.cdll.LoadLibrary(dll_name)

    for size in sizes:
        arr1 = np.random.randint(size, size=size)
        arr2 = arr1.copy()
        a = arr1.copy()

        time1 = time.time()
        lib.bubble_sort(ctypes.c_void_p(arr1.ctypes.data), arr1.size)
        delta_time_c_impl = time.time() - time1

        time1 = time.time()
        bubble_sort(arr2)
        delta_time_python_impl = time.time() - time1

        assert np.array_equal(arr1, arr2)
        assert np.array_equal(arr2, sorted(arr2))

        print(f'for size {size}\n'
              f'Python bubble sort time = {delta_time_python_impl}\n'
              f'C bubble sort time = {delta_time_c_impl}\n')


def main():
    sizes = np.array([100, 250, 500, 1000, 2500])

    sort_compare('lib/BubbleSortDLL.dll', sizes)

    return


if __name__ == '__main__':
    main()
