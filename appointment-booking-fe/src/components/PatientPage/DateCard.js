import React from 'react'




function DateCard(props) {
    let date = new Date(props.bookingData).toString();

    let month = date.split(' ')[1];
    let day = date.split(' ')[2];
    let year = date.split(' ')[3];
    return <>
        < h5 className='appointmentList__month'>{month}</h5> {day} <br /> {year}
    </>

}

export default DateCard