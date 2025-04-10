const config = {
    clientPath: 'https://samrueduu.shop',
    headers: () => {
        return{
            headers: {
                Authorization: localStorage.getItem("token")
            },
        };
    },
};
export default config;
