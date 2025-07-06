const BaseURL = "https://manageit.tryasp.net/api/";



//Set Error
function ConsoleError(code, text) {
    console.error(`Error: status code :${code} , status text :${text}  `);
}



// cooke functions
function setRefreshTokenToCookies(refreshToken) {
    document.cookie = `refreshToken=${refreshToken}; path=/; Secure; SameSite=Strict`;
}
function setAccessTokenToCookies(token) {
    document.cookie = `token=${token}; path=/; Secure; SameSite=Strict`;
}
function getCookie(name) {
    return document.cookie
        .split('; ')
        .find(row => row.startsWith(name + '='))
        ?.split('=')[1];
}
function clearAuthCookies() {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

// get access token by refresh token
async function GetAccessToken(subUrl = "User/GetAccessToken") {
    const refreshToken = getCookie("refreshToken");

    const response = await fetch(BaseURL + subUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ refreshToken: refreshToken })
    })
    let Data = null;
    if (response.ok) {
        Data = await response.json();
        setAccessTokenToCookies(Data.token)
    } else {
        console.error(`Error: ${response.status}`);
        //go to login 
    }
    return response.status;
}





//WithoutAuth
async function LoginAPI(subUrl, dataJSON) {
    const response = await fetch(BaseURL + subUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: dataJSON
    });

    let Data = null;
    if (response.ok) {
        Data = await response.json();
        setRefreshTokenToCookies(Data.refreshToken)
        setAccessTokenToCookies(Data.token);
    } else {
        console.error(`Error: ${response.status}`);
    }
    return response;
}
async function PostWithoutAuth(subUrl, dataJSON) {
    var response = await fetch(BaseURL + subUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: dataJSON
    })
    if (!response.ok) {
        console.error(`Error: ${response.status}`);
    }
    return response;
}


//Abstract Function
async function AbstractionFetchFromAPI(subUrl) {

    const token = getCookie("token");
    const response = await fetch(BaseURL + subUrl, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    return response;
}
async function AbstractionPostToApi(subUrl, data) {

    const token = getCookie("token");
    var response = await fetch(BaseURL + subUrl, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: data
    })

    return response;
}
async function AbstractionPUTToAPI(subUrl, data) {
    const token = getCookie("token");
    const response = await fetch(BaseURL + subUrl,
        {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: data
        });
    return response;
}
async function AbstractionDeleteToApi(subUrl, data) {
    const token = getCookie("token");
    var response = await fetch(BaseURL + subUrl, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: data
    })
    return response;
}
async function AbstractionDeleteByQueryToApi(subUrl) {
    const token = getCookie("token");
    var response = await fetch(BaseURL + subUrl, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    return response;
}
async function AbstractionPUTByQueryToAPI(subUrl) {
    const token = getCookie("token");
    const response = await fetch(BaseURL + subUrl,
        {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
    return response;
}
async function AbstractionPUTFormDataToAPI(subUrl, formData) {
    const token = getCookie("token");

    const response = await fetch(BaseURL + subUrl, {
        method: "PUT",
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });

    return response;
}

// called functions
async function FetchFromAPI(subUrl) {
    let response = await AbstractionFetchFromAPI(subUrl)
    if (response.status == 401) {
        const statusOfRefresh = await GetAccessToken();
        if (statusOfRefresh == 200) {
            response = await AbstractionFetchFromAPI(subUrl)
        }
    }
    else if (!response.ok) {
        ConsoleError(response.status, response.statusText);
    }
    return response;
};
async function PostToApi(subUrl, dataBody) {
    let response = await AbstractionPostToApi(subUrl, dataBody);
    if (response.status == 401) {
        const statusOfRefresh = await GetAccessToken();
        if (statusOfRefresh == 200) {
            response = await AbstractionPostToApi(subUrl, dataBody);
        }

    }
    else if (!response.ok) {
        ConsoleError(response.status, response.statusText);
    }
    return response;
}
async function PUTToAPI(subUrl, dataBody) {
    let response = await AbstractionPUTToAPI(subUrl, dataBody);
    if (response.status == 401) {
        const statusOfRefresh = await GetAccessToken();
        if (statusOfRefresh == 200) {
            response = await AbstractionPUTToAPI(subUrl, dataBody);
        }
    }
    else if (!response.ok) {
        ConsoleError(response.status, response.statusText);
    }
    return response;
}
async function DeleteToApi(subUrl, dataBody) {
    let response = await AbstractionDeleteToApi(subUrl, dataBody)

    if (response.status == 401) {
        const statusOfRefresh = await GetAccessToken();
        if (statusOfRefresh == 200) {
            response = await AbstractionDeleteToApi(subUrl, dataBody);
        }
    }
    else if (!response.ok) {
        ConsoleError(response.status, response.statusText);
    }
    return response;
}
async function DeleteByQueryToApi(subUrl) {
    let response = await AbstractionDeleteByQueryToApi(subUrl)

    if (response.status == 401) {
        const statusOfRefresh = await GetAccessToken();
        if (statusOfRefresh == 200) {
            response = await AbstractionDeleteByQueryToApi(subUrl);
        }
    }
    else if (!response.ok) {
        ConsoleError(response.status, response.statusText);
    }
    return response;
}
async function PUTByQueryToAPI(subUrl) {
    let response = await AbstractionPUTByQueryToAPI(subUrl);
    if (response.status == 401) {
        const statusOfRefresh = await GetAccessToken();
        if (statusOfRefresh == 200) {
            response = await AbstractionPUTByQueryToAPI(subUrl);
        }
    }
    else if (!response.ok) {
        ConsoleError(response.status, response.statusText);
    }
    return response;
}
async function PUTFormDataToAPI(subUrl, formData) {
    let response = await AbstractionPUTFormDataToAPI(subUrl, formData);

    if (response.status === 401) {
        const statusOfRefresh = await GetAccessToken();
        if (statusOfRefresh === 200) {
            response = await AbstractionPUTFormDataToAPI(subUrl, formData);
        }
    }
    else if (!response.ok) {
        ConsoleError(response.status, response.statusText);
    }

    return response;
}

export { getCookie,clearAuthCookies, LoginAPI, PostWithoutAuth, FetchFromAPI, PostToApi, PUTToAPI, DeleteToApi, DeleteByQueryToApi, PUTByQueryToAPI, PUTFormDataToAPI }