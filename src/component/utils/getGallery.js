import axios from "axios"

const getGallery = async()=>{
    try{
        const response = await axios.get("https://appy.trycatchtech.com/v3/maganlalchikki/home_image_gallery")
        return response.data
    }catch(error){

    }
}

export default getGallery