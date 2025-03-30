const config = {
    apiPath: 'http://localhost:3001',
    backofficePath: 'http://localhost:3002',
    headers: () => {
        return{
            headers: {
                Authorization: localStorage.getItem("token")
            },
        };
    },
};
export default config;