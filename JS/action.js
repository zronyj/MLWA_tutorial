const { createApp } = Vue

createApp({
    data() {
        return {
            aboutShow: false,
            dnaShow: true,
            aaShow: false,
            spinnerShow: false,
            resultsShow: false,
            message: 'Hello World!'
        }
    },
    methods: {
        show(something) {
            this[something] = ! this[something];
        }
    }
}).mount('#app')