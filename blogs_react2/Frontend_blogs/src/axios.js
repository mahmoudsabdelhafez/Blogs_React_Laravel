import axios from "axios";


const axiosClient = axios.create({
  baseURL: `http://localhost:8000/api`,
});

// handle request, add token to header for each request
axiosClient.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('TOKEN')}`
  return config
});


// handle response, if unauthorized redirect to login, if authorized return response
axiosClient.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response && error.response.status === 401) // if unauthorized
     {
    localStorage.removeItem('TOKEN')
    window.location.reload();
    // router.navigate('/login')
    return error;
  }
  throw error;
})

export default axiosClient;