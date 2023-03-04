import { useState, useEffect } from "react"

const castInt = (num: number) => {
    return parseInt(num.toFixed(0));
}

const formatTimeLeft = (time: number) => {
    const allSeconds = castInt(time / 1000);
    const secondsLeft = allSeconds % 60;
    const minutesLeft = castInt(allSeconds / 60) % 60;
    const hoursLeft = castInt(allSeconds / 3600);

    return hoursLeft.toString().padStart(2, "0") + ":" + minutesLeft.toString().padStart(2, "0") + ":" + secondsLeft.toString().padStart(2, "0");
}

const useTimer = (stopAt: number) => {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        setTimeLeft(stopAt);
    }, [stopAt]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(timeLeft - 1000 > 0 ? timeLeft - 1000 : 0);
        }, 1000);

        return () => {
            clearInterval(interval);
        }
    }, [stopAt, timeLeft]);

    return formatTimeLeft(timeLeft);
};

export {
    useTimer
}