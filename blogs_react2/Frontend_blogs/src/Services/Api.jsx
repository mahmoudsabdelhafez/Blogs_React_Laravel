import axios from 'axios';


const Api_base_url = 'http://127.0.0.1:8000/api/';

// Get the specified user data
export const getUserData = async (id) => {
  try {
    const response = await axios.get(`${Api_base_url}user/${id}/show`);
    return response.data;
  } catch (error) {
    console.error("Error:", error); 
    return null; 
  }
};

//user data update

export const updateUserData = async (id , userData) => {
  try {
    const response = await axios.put(`${Api_base_url}user/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    return null; 
  }
};
//user create blog
export const createBlog = async (userId, BlogDetails) => {
  try {
   
    if (userId) {
      BlogDetails.append("user_Id", userId);
    } else {
      throw new Error("User ID is missing.");
    }


    const response = await axios.post(`${Api_base_url}blog/store`, BlogDetails, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error: ", error.response ? error.response.data : error.message);
    return null;
  }
};

//user update blog

export const updateBlog = async (id, blogDetails) => {
  try {
    const response = await axios.put(`${Api_base_url}blog/${id}/update`, blogDetails);
    console.log(blogDetails);
    console.log('Response:', response.data);
    return response.data;
  } catch (e) {
 
    if (e.response) {
   
      console.error('Error occurred:', e.response.data);
      return { error: e.response.data };
    } else if (e.request) {
   
      console.error('No response received:', e.request);
      return { error: 'No response from server' };
    } else {
 
      console.error('Error occurred:', e.message);
      return { error: e.message };
    }
  }
};






//get categories for the blog //can be used in the blog details page and the favorite page 
export const getCatigories = async()=>{
  try{
    const response= await axios.get(`${Api_base_url}categories`);
    return response.data

  }catch(error){
console.error("Error:" , error)
return null;
  }
}


//get the blogs that a specific user has created 
export const getBlogsUser =async(id )=>{
  try{
    
const response= await axios.get(`${Api_base_url}blogUser/${id}`  )
return response.data
  }catch(error){
    console.log("Error:" , error)
    return null;
  }
}

//delete a specific blog 
export const deleteblog = async(id)=>{
try{
  const response= await axios.delete(`${Api_base_url}blog/${id}/delete`)
  return response.data
}catch(error){
  console.log("Error:" , error)
  return null;
}
} 


//get all blogs 
export const getBlogs = async (filters = {}) => {
  try {
    // Dynamically append filters to the URL
    const { category } = filters; // Make sure the property name matches what you expect in the backend
    let url = `${Api_base_url}blog`;

    if (category) {
      url += `?category=${category}`;
    }

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};


//save contact form data 
export const saveContact = async()=>{
  try{
const response= await axios.post(`${Api_base_url}contact`);
return response.data
  }catch(error){
    console.log("Error:" , error)
    return null;
  }
}

export const fetchHomeData = async () => {
  try {
    const response = await axios.get(`${Api_base_url}home`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch home data");
  }
};

export const fetchFavorites = async (userId) => {
  try {
    const response = await axios.get(`${Api_base_url}favorites/${userId}`);
    return new Set(response.data.favoriteBlogs.map((blog) => blog.id));
  } catch (error) {
    throw new Error("Failed to fetch favorites");
  }
};

export const toggleFavorite = async (userId, blogId, isFavorite) => {
  try {
    if (isFavorite) {
      await axios.delete(`${Api_base_url}favorites/${userId}/${blogId}`);
    } else {
      await axios.post(`${Api_base_url}favorites/${userId}/${blogId}`);
    }
  } catch (error) {
    throw new Error("Failed to toggle favorite");
  }
};


export default {
  getUserData,
  updateUserData,
  createBlog,
  getCatigories,
  updateBlog,
  deleteblog,
  fetchFavorites,
  toggleFavorite
};


