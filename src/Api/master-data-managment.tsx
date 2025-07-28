import axios from "axios";

const apiUrl = process.env.BASE_URL;

const axiosRequest = async (method: "post" | "put" | "delete" | "get", url: string, data?: any) => {
    try {
        const res = await axios({
            method,
            url,
            data,
            withCredentials: true,
            responseType: 'json',
        });

        if (res.data.Success === true && (res.data.Code !== 401 || res.data.Code !== 403)) {
            return { status: true, msg: res.data.Message, data: res.data.Data, total_records: res?.data?.Count };
        } else if (res.data.Code === 401 || res.data.Code === 403) {
            const newRes = await axiosRequest(method, url, data);
            if (newRes.data.Success == true) {
                return { status: true, msg: res.data.Message, data: res.data.Data, total_records: res.data.Count };
            } else {
                return { status: false, data: res.data.Data, msg: res.data.Message, total_records: 0 };
            }
        } else if (res.status === 500) {
            return { status: false, data: {}, msg: "Internal Server Error" };
        }
        else {
            return { status: false, msg: res.data.Message, data: res.data.Data, total_records: 0 };
        }

    } catch (error) {
        console.error("API Request Error:", error);
        return { status: false, msg: "Network Error", data: {}, total_records: 0 };
    }
};

export const FetchData = (url: string) => {
    return axiosRequest("get", `${apiUrl}/${url}`);
}

export const FetchPaginationData = (url: string, data: any) => {
    return axiosRequest("post", `${apiUrl}/${url}`, data);
}

export const SaveData = (data: any, url: string, method: "post" | "put") => {
    return axiosRequest(method, `${apiUrl}/${url}`, data);
}

export const DeleteData = (data: any, url: string) => {
    return axiosRequest("delete", `${apiUrl}/${url}`, data)
}