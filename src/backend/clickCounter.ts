// src/backend/clickCounter.ts
const counter = { 1: 0, 2: 0 };

export function incrementCounter(imageId: number) {
  counter[imageId] += 1;
}

export function getCurrentCounter() {
  return counter;
}
