const config = {
    apiPath: 'http://3.0.101.103:3001',
    backofficePath: 'http://3.0.101.103:3002',
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
