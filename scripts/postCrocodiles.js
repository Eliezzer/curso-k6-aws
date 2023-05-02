import { check } from "k6";
import http from "k6/http";



const BASE_URL = 'https://test-api.k6.io';
const crocodilo = {
    "name": "Joao",
    "sex": "M",
    "date_of_birth": "2010-06-27"
};
console.log(JSON.stringify(crocodilo));
export const options = {
    stage: [
        {duration: '5s', target: 10},
        {duration: '5s', target: 10},
        {duration: '2s', target: 0},
    ],
    thresholds: {
        checks: ['rate > 0.90'],
        http_req_duration: ['p(90)< 1500'],
        http_req_failed: ['rate < 0.10']
    }
}
export function setup(){
    const loginResponse = http.post(`${BASE_URL}/auth/token/login/`, {
        username: '0.6937342566724328@email.com',
        password: 'user123'
    });
    const token = loginResponse.json('access');
    return token;
};


export default function(token){
    const params =  {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'        
        }
    };
    const req = http.post(`${BASE_URL}/my/crocodiles/`, JSON.stringify(crocodilo), params);
    console.log("status code retornaado: " + req.status);
    check(req, {
        'crocodilo criado com sucesso': (r) => r.status === 201,
        'valida se é joao': (r) => r.json('age') === 12
    });
}
