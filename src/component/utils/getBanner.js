import axios from "axios"

const getBanner = async()=>{
    try{
        const response = await axios.get("https://appy.trycatchtech.com/v3/maganlalchikki/banner_image")
        return response.data
    }catch(error){

    }
}

export default getBanner