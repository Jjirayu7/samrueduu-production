const config = {
    apiPath: 'http://backend:3001',
    backofficePath: 'http://frontend-backoffice:3002',
    headers: () => {
        return{
            headers: {
                Authorization: localStorage.getItem("token")
            },
        };
    },
};
export default config;