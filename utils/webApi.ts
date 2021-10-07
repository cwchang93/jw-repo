// Search qString Param

let searchParams = new URLSearchParams(window.location.search);
searchParams.get('q')

interface qString {
    [s: string]: string;
}

const getUrlParams = (searchString: string): qString => {
    const obj = {};
    let searchParams = new URLSearchParams(searchString);

    for (let param of searchParams) {
        obj[param[0]] = param[1];
    }

    return obj;
}
