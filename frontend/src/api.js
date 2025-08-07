import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const getAvailableSlots = (date) => {
    return axios.get(`${API_BASE_URL}/slots/available?date=${date}`);
};