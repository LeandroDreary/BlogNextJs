import Axios from "axios";

const uploadImages = async (file: File) => {
    let cloudName = "BlogNextJs"
    let url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    let form = new FormData();
    await form.append("upload_preset", "fva5iraw");
    await form.append("file", file);
    return await Axios.post(url, form).then(resp => resp.data);
}

export default uploadImages