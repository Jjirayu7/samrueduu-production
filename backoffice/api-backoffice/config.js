const config = {
    clientPath: 'http://frontend-client:3000',
    headers: () => {
        return{
            headers: {
                Authorization: localStorage.getItem("token")
            },
        };
    },
};
export default config;