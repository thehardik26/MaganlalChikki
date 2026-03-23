import axios from "axios"


const getAbout = async()=>{
    try {

    const response =await axios.get("https://appy.trycatchtech.com/v3/maganlalchikki/about")
    
    return response.data

    } catch (error) {

        
    }

}
export default getAbout