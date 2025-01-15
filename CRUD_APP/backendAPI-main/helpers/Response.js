// error response
export const error_response = (error, res) => {
    res.status(400).json({
        status: false,
        message: error,
    });
};

// fetch data response
export const fetch_data = (data, res) => {
    res.status(200).json({
        status: true,
        message: "Data get successfully!",
        data: data,
    });
};

// create_response data response
export const create_response = (msg, res) => {
    res.status(200).json({
        status: true,
        message: msg
    });
};

// custom response
export const custom_response = (data, msg, res) => {
    res.status(200).json({
        status: true,
        message: msg,
        data: data,
    });
};


export const custom_responseF = (data,count, msg, res) => {
    res.status(200).json({
        status: true,
        message: msg,
        data: data,
        count: count,
    });
};