import { PubSub } from "./pubSub";

PubSub.subscribe({
    event: 'randomizeNum',
    listener: randomizeNum
});

export function randomizeNum (min, max) {
    return Math.random() * (max - min) + min;
}
