const config = {
    clientPath: 'http://3.0.101.103:3000',
    headers: () => {
        return{
            headers: {
                Authorization: localStorage.getItem("token")
            },
        };
    },
};
export default config;