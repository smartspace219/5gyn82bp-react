import axios from 'axios';

class ApiService {
    constructor() {
        this.service = axios.create({
            baseURL: process.env.REACT_APP_SERVER_API_URL,
            headers: {
                'Content-Type': 'application/json'
            }
        })

        this.service.interceptors.response.use(
            (res) => res,
            (err) => {
                if (err.response.status === 401) {
                }
                return Promise.reject(err);
            }
        )
    }

    send = (pageUrl, position, orgContent, key) => {
        return new Promise((resolve, reject) => {
            // this.service.get(`p?v_page_url=${pageUrl}&v_position=${position}&v_key=${key}`).then(res => {
            //     resolve(res.data);
            // }).catch(err => {
            //     reject(err);
            // })
            this.service.post(`post`, {
                pageUrl: pageUrl,
                position: position,
                orgContent: orgContent,
                key: key
            }).then(res => {
                resolve(res.data);
            }).catch(err => {
                reject(err);
            })
        })
    }

    login = (username, password) => {
        return new Promise((resolve, reject) => {
            this.service.post(`signin`, {
                username: username,
                password: password
            }).then(res => {
                resolve(res.data);
            }).catch(err => {
                reject(err);
            })
        })
    }
}

const service = new ApiService();

export default service;