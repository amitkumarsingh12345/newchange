import axios from "axios";

export const viewproductHandler = async () => {
    let data = await axios.get('http://localhost:11000/api/v4/product/find');
    data = data?.data;
    return data;
}
