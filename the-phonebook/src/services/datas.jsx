import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/persons'

const getAll = () => {
    return axios.get(baseUrl).then(response => response.data.map(person => ({
        ...person,
        id: person.id || person._id
    })))
}

const create = (newPerson) => {
    return axios.post(baseUrl, newPerson).then(response => response.data)
}

const upgrade = (id, upgradePerson) => {
    return axios.put(`${baseUrl}/${id}`, upgradePerson).then(response => response.data)
}

const earse = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

export default {
    getAll,
    create,
    upgrade,
    earse
}