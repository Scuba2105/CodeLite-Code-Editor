const daysLookup = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];
const monthsLookup = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getDaySuffix(day) {
    const lastDigit = day.length === 1 ? day : day[1];
    return lastDigit === "1" ? "st" : lastDigit === "2" ? "nd" : lastDigit === "3" ? "rd" : "th"
}

function getTimeSuffix(hour) {
    return hour < 12 ? "am" : "pm";
}

function formatHours(hour) {
    return hour <= 12 ? hour : hour - 12;
}

function formatMinutes(minutes) {
    return String(minutes).length === 1 ? `0${minutes}` : minutes;
}

export function getDateTimeData(timestamp) {

    // Create the Date objects for request date and current date.
    const requestDate = new Date(timestamp);
    const currentDate = new Date();

    // Format the time in 12Hr format based on the minutes (0-59) and hours (0-23). eg. 11:30 am, 4:00 pm. 
    const requestTime = `${formatHours(requestDate.getHours())}:${formatMinutes(requestDate.getMinutes())} ${getTimeSuffix(requestDate.getHours())}`;
    
    // Add the request time to the date time object.
    const dateTimeObject = {requestTime: requestTime}

    // Get the number of days between the current date and request date and format accordingly.
    const dayDiff = Math.floor(currentDate - requestDate / (1000*60*60*24));

    // Format the day string accordingly.
    if (dayDiff === 0) {
        dateTimeObject.day = `Today` 
    }
    else if (dayDiff < 5) {
        dateTimeObject.day = `${dayDiff} ${dayDiff === 1 ? "day" : "days"} ago` 
    }
    else {
        const dayOfWeek = daysLookup[requestDate.getDay()];
        // Remove the 0 if the first 'digit' in the day of month string is zero eg. 05th so it becomes the 5th
        const dayOfMonth = requestDate.toLocaleDateString().split("/")[0][0] === "0" ? requestDate.toLocaleDateString().split("/")[0][1] : requestDate.toLocaleDateString().split("/")[0];
        const month = monthsLookup[requestDate.getDay()];
        dateTimeObject.day = `${dayOfWeek} ${dayOfMonth}${getDaySuffix(dayOfMonth)} ${month}`
    }
    return dateTimeObject
}
