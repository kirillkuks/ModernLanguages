#include "main.h"
#include <stdio.h>

void bubble_sort(int* ptr_data, int size) {
    int i, j;
    int temp;
    char swapped = 0;

    for (i = 0; i < size; ++i) {
        swapped = 0;

        for (j = 0; j < size - i - 1; ++j) {
            if (ptr_data[j] > ptr_data[j + 1]) {
                temp = ptr_data[j];
                ptr_data[j] = ptr_data[j + 1];
                ptr_data[j + 1] = temp;

                swapped = 1;
            }
        }

        if (!swapped) {
            break;
        }
    }
}
