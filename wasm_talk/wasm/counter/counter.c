#include <stdio.h>
#include <emscripten/emscripten.h>

int counter = 0;

EMSCRIPTEN_KEEPALIVE
int count() {
  return ++counter;
}

EMSCRIPTEN_KEEPALIVE
int set_count(int n) {
  return (counter = n);
}
