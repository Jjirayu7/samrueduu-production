const config = {
    apiPath: 'http://api.samrueduu.shop',
    backofficePath: 'http://backoffice.samrueduu.shop',
    headers: () => {
        return{
            headers: {
                Authorization: localStorage.getItem("token"),
                // Connection: 'keep-alive',
                'Cache-Control': 'max-age=3600', // Cache 1 ชม.
            },
            timeout: 5000,
        };
    },
};
export default config;
