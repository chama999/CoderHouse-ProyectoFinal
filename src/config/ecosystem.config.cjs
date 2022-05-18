module.exports = {
    apps : [
    {
        name      : "Clusters Servers",
        script    : "./src/app.js",
        instances : "4",
        exec_mode : "cluster",
        env: {
            NODE_ENV: "production",
            PORT: 8082
        },
        watch: true
    },
    {
        name      : "Worker server 1",
        script    : "./src/app.js",
        instances : "1",
        exec_mode : "fork",
        env: {
            NODE_ENV: "production",
            PORT: 8081
        },
        watch: true
    }]
}