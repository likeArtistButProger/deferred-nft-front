import { useState, useEffect } from "react"

const castInt = (num: number) => {
    return parseInt(num.toFixed(0));
}

const formatTimeLeft = (time: number) => {
    const allSeconds = castInt(time / 1000);
    const secondsLeft = allSeconds % 60;
    const minutesLeft = castInt(allSeconds / 60) % 60;
    const hoursLeft = castInt(allSeconds / 3600);

    return hoursLeft.toString() + ":" + minutesLeft.toString().padStart(2, "0") + ":" + secondsLeft.toString().padStart(2, "0");
}

const useTimer = (stopAt: number) => {
    const [timeLeft, setTimeLeft] = useState(stopAt - new Date().getTime());

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(prev => prev - 1000 > 0 ? prev - 1000 : 0);
        }, 1000);

        return () => {
            clearInterval(interval);
        }
    }, [setTimeLeft, stopAt]);

    return formatTimeLeft(timeLeft);
};

export {
    useTimer
}