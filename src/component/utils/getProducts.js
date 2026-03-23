import axios from "axios";

const getCategory = async () => {
    try {
        const response = await axios.get("https://appy.trycatchtech.com/v3/maganlalchikki/category_list");

        return response.data;
    } catch (error) { }
};

const getProducts = async (id) => {
    const response = await axios.get(
        `https://appy.trycatchtech.com/v3/maganlalchikki/product_list?category_id=${id}`,
    );
    return response.data;
};

export { getCategory,getProducts};
export default getProducts;