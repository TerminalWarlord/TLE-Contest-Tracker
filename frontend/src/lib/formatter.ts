

export const timeDifference = (date: Date): { hours: string, minutes: string, seconds: string } => {
    const now = new Date();
    let diff = (date.getTime() - now.getTime()) / 1000;

    const hours = Math.floor(diff / 3600);
    diff %= 3600;
    const minutes = Math.floor(diff / 60);
    diff %= 60;
    const seconds = Math.floor(diff);
    return {
        hours: hours < 10 ? `0${hours}` : hours.toString(),
        minutes: minutes < 10 ? `0${minutes}` : minutes.toString(),
        seconds: seconds < 10 ? `0${seconds}` : seconds.toString(),
    };
}


export const formatDateTime = (date: Date): string => {

    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    })

    const [monthDay, year, time] = formattedDate.split(',');
    return `${monthDay}, ${year} • ${time}`;
}


export const formatTime = (time: number) => {
    const hours = Math.floor(time / (60 * 60));
    time %= (60 * 60);
    const minutes = Math.floor(time / (60));
    return (hours < 10 ? `0${hours}` : hours.toString()) + ":" + (minutes < 10 ? `0${minutes}` : minutes.toString());
}