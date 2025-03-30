const config = {
    clientPath: 'http://localhost:3000',
    headers: () => {
        return{
            headers: {
                Authorization: localStorage.getItem("token")
            },
        };
    },
};
export default config;