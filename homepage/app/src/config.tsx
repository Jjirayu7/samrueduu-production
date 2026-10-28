const config = {
    apiPath: 'http://3.0.101.103:3001',
    backofficePath: 'http://3.0.101.103:3002',
    headers: () => {
        return{
            headers: {
                Authorization: localStorage.getItem("token")
            },
        };
    },
};
export default config;
