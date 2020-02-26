export function generateUUID(): string {
  let d = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}

export function tConvert(time): any {
  if (time === '' || !time) {
    return time;
  }
  time = time.match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
  if (time.length > 1) {
    time = time.slice(1);
    time[5] = +time[0] < 12 ? 'AM' : 'PM';
    time[0] = +time[0] % 12 || 12;
  }
  return time.join('');
}

export function dConvert(date): any {
  if (date === '' || !date) {
    return date;
  }
  const newDate = new Date(date);
  let timeDate = newDate.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' }).replace(/,/g, '');
  const calDate = new Date(newDate.getTime() - (newDate.getTimezoneOffset() * 60000)).toISOString().slice(0, 10);
  if (timeDate.charAt(1) === ':') {
    timeDate = '0' + timeDate;
  }
  return calDate + ' ' + timeDate;
}

export function nextMonthsDates(date, days): any {
  const dates = [];
  const dayMap = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6
  };
  date = new Date(date);
  dates.push(date);
  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < days.length; i++) {
    if (dayMap[days[i]] < date.getDay()) {
      const repDate = new Date(date);
      repDate.setDate(date.getDate() + (7 - date.getDay() + dayMap[days[i]]));
      dates.push(repDate);
    } else if (dayMap[days[i]] > date.getDay()) {
      const repDate = new Date(date);
      repDate.setDate(date.getDate() + (dayMap[days[i]] - date.getDay()));
      dates.push(repDate);
    }
  }
  const nextDates = [];
  // tslint:disable-next-line:prefer-for-of
  for (let j = 0; j < dates.length; j++) {
    for (let k = 1; k < 4; k++) {
      const nextDate = new Date(date);
      nextDate.setDate(dates[j].getDate() + (7 * k));
      nextDates.push(nextDate);
    }
  }
  return dates.concat(nextDates);
}

export function stripUnusedBusinessHours(model): any {
  Object.keys(model.business_hours).forEach(key => {
    if (model.business_hours[key] === ' - ') {
      model.business_hours[key] = 'closed';
    }
  });
  // if(Object.keys(model).length === 0){
  // 	delete model.business_hours;
  // }
  return model;
}

export function extractFireBaseFileName(url: string): string {
  return unescape(url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('?')));
}

export function checkURL(url: string): boolean {
  const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  return regexp.test(url);
}

export function defaultDate(): string {
  const date = new Date();
  const str = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
  if (str.indexOf('.') !== -1) {
    return str.substring(0, str.indexOf('.'));
  } else {
    return str.substring(0, str.length - 1);
  }
}

export function defaultDatePlusOne(): string {
  const date = new Date();
  date.setHours(date.getHours() + 1);
  const str = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
  if (str.indexOf('.') !== -1) {
    return str.substring(0, str.indexOf('.'));
  } else {
    return str.substring(0, str.length - 1);
  }
}

export function dateToSeconds(val): number {
  const date = new Date(val);
  return Math.round(date.getTime() / 1000);
}
