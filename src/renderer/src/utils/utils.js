import {ipcRenderer} from 'electron';

export function capitaliseFirstLetters(input) {
    const words = input.split(' ');
    const formattedWords = words.map((word) => {
        return word === 'MPS' ? word : word[0].toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
    return formattedWords
}

export function generateDataPages(queryData, entriesPerPage) {
    let pageCount = 0;
    const paginatedData = queryData.reduce((acc, curr, index) => {
        const remainder = index % entriesPerPage;
        
        if (remainder === 0 && index !== 0) {
            pageCount++
            acc.push([]);
        }
        
        acc[pageCount].push(curr)
        return acc;
    }, [[]]);
    return paginatedData;
}

export async function fetchData(staffId) {
    try {
        // You can await here
        console.log("Requesting Data")
        const appData = await renderer_api.GetAllData()
        console.log("Returned Data")
        return appData
    }
    catch (err) {
        throw new Error(err.message);
    }
}

export function delayFunctionInitiation(func) {
    setTimeout(() => {
        func();
    }, 150)
}

export function sortMandatoryFields(changedMandatoryFields) {
    // Check if mandatory fields exist in array
    const locationChanged = changedMandatoryFields.includes("Location");
    const positionChanged = changedMandatoryFields.includes("Position");
    const officeChanged = changedMandatoryFields.includes("Office Phone");

    // Push them to the new array in the correct order
    const sortedFields = [];
    if (locationChanged) {
        sortedFields.push("Location");
    }
    if (positionChanged) {
        sortedFields.push("Position");
    }
    if (officeChanged) {
        sortedFields.push("Office Phone");
    }

    return sortedFields;
}

export function getOrdinalNumber(number) {
    const lastNumber = number.split("").slice(-1)[0];
    if (lastNumber === '1') {
        return `${number}st`
    } 
    else if (lastNumber === '2') {
        return `${number}nd`
    } 
    else if (lastNumber === '3') {
        return `${number}rd`
    } 
    else {
        return `${number}th`
    }
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export function getWeekBoundingDates(inputDate) {
    const selectedDay = inputDate.getDay();
    // Adjust day to make Monday the start, not Sunday.
    const adjustedDay = selectedDay === 0 ? 6 : selectedDay - 1;
    const weekStart = inputDate - adjustedDay * (24*60*60*1000);
    const weekEnd = weekStart + 6 * (24*60*60*1000);
    const upperBoundDate = new Date(weekEnd);
    const lowerBoundDate = new Date(weekStart);
    return [lowerBoundDate, upperBoundDate];
}

// Variables and functions used in multiple places in on-call page
export const staffOnCallRoster = ["Durga Sompalle", "Mitchell Pyne", "Atif Siddiqui",
"Mitchell Pacey", "Steven Bradbury", "Ray Aunei Mose", "Rodney Birt", "Kendo Wu", "Matthew Murrell"];

export function getAdjustedBeginRoster(staffOnCallRoster) {
    const startIndex = staffOnCallRoster.indexOf("Kendo Wu");
    return staffOnCallRoster.slice(startIndex).concat(staffOnCallRoster.slice(0, startIndex));
}

export function currentOnCallName(onCallRoster, beginDate, date) {
    const diff = (date - beginDate)
    // Number of weeks is difference in ms divided by number of ms in one week rounded down
    const numberOfWeeks = Math.abs(Math.floor(diff/(604800000)));
    const rosterCycleNumber = numberOfWeeks % onCallRoster.length;
    const reversedRoster = onCallRoster.slice(1).reverse();
    // Add the initial entry to the roster
    reversedRoster.unshift(onCallRoster[0]);
    if (beginDate <= date) {
      return onCallRoster[rosterCycleNumber]; 
    }
    return reversedRoster[rosterCycleNumber];  
  }

// Begin date is mm/dd/yyyy so actually Mon 09/10/2023
export const beginDate = new Date("10/09/2023");

