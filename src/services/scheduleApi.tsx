import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export const getSchedule = async (date: string) => {
    const response = await axios.get(`${API_URL}/api/v1/schedule/${date}`)
    return response.data
}

export const saveSchedule = async (scheduleDate: string | null, teams: any) => {
    try {
        const response = await axios.post(`${API_URL}/api/v1/schedule/`, {
            date: scheduleDate,
            teams: teams
        });
        return response.data;
    } catch (err) {
        console.error("Ошибка при сохранении расписания:", err);
        throw err;
    }
}

export const getTeamStaff = async (date: string) => {
    const res = await fetch(`${API_URL}/api/v1/schedule/${date}/teams/`);
    if (res.status === 404) {
        throw { response: { status: 404 } }; // имитируем axios-подобную ошибку
    }
    if (!res.ok) {
        throw new Error("Ошибка при получении данных по людям");
    }
    return await res.json();
};


