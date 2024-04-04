var url = "http://localhost/unitec/index.php/"

export const executeConsult = async (id, route) => {
    var data;

    if (id != null) url += `${id}`

    const consultUrl = url + `?route=${route}`;

    try {
        const response = await fetch(consultUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        })

        if (!response.ok) {
            throw new Error(response.status)
        }

        data = response.text()
        const data_json = await data.then(res => {
            return JSON.parse(res);
        })

        if (data_json.status != null) {
            switch (data.status) {
                case 400:
                    break;
                case 500:
                    exceptionCode500()
                    break;
            }
            return null;
        }

        return data_json;
    } catch (error) {
        exceptionCode500()
        return null
    }
}

export const executeInsert = async (data, route) => {
    const insertUrl = url + `?route=${route}`;

    try {
        const data_json = JSON.parse(data);
        const response = await fetch(insertUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(data_json)
        })

        if(!response.ok){
            throw new Error(response.status)
        }

        data = response.text()
        const data_response = await data.then(res => {
            return JSON.parse(res);
        })

        return data_response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const exceptionCode500 = () => {
    
}