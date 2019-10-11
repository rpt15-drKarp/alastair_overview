import http from 'k6/http'

export default function() {
  const url = 'http://localhost:3000/api/overview/'
  const payload = JSON.stringify({"game_name":"game","description":"game","release_date":"2019","publisher":"publisher","developer":"devloper","tags":["one","two","three"]})
  const params = { headers: { "Content-Type": "application/json"} }
  http.post(url, payload, params)
}