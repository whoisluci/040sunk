import { PubSub } from "./pubSub.js";

PubSub.subscribe({
    event: 'convertImg',
    listener: convertImgToBase64
});

function convertImgToBase64(img) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result);
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsDataURL(img); 
    });
}