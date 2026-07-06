import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

function getTokenFromCookies() {
    const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
  }

export const CreateAdmin = async(username :string,email : string,password:string,mangedMuseum:string)=>{
try{
        const token = getTokenFromCookies();
        const response = await axios.post(`${API_URL}admin/SignUp`,{username,email,password,mangedMuseum},{
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
          });
          return response.data;
    }catch(error){
    }
}
    export const GetAllUser = async()=>{
        try{
                const token = getTokenFromCookies();
                const response = await axios.get(`${API_URL}users/getAllUsers`,{
                    headers: {
                      'Content-Type': 'multipart/form-data',
                      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                    },
                  });
                  return response.data;
            }catch(error){
            }
        
}