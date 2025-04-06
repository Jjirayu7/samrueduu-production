const config = {
    clientPath: 'http://api.samrueduu.shop',
    headers: () => {
        return{
            headers: {
                Authorization: localStorage.getItem("token")
            },
        };
    },
};
export default config;
