import moment from "moment"

function timeDateFormat(dateTime): any {
    return moment(dateTime).format('MMMM Do YYYY, h:mm:ss a')
}

export { timeDateFormat }