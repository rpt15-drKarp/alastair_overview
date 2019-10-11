import http from 'k6/http'

export default function() {
  const url = 'http://localhost:3000/api/overview/' + Math.floor(Math.random() * 10000000)
  http.get(url)
}