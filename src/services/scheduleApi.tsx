import axios from 'axios'

const API_URL = 'http://localhost:8000/api/v1/schedule/'

export const getSchedule = async (date: string) => {
    const response = await axios.get(API_URL + date)
    return response.data
}



export const postScheduleText = async (text: string) => {
    const res = await fetch('https://localhost:8000/api/v1/schedule/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: text }),
    })

    if (!res.ok) {
        throw new Error('Ошибка при сохранении')
    }

    return res.json()
}

