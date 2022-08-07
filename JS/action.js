const { createApp } = Vue

createApp({
    data() {
        return {
            endpoint: "http://127.0.0.1:5000/",
            aaSequence: ["G"],
            dnaSequence: ["A"],
            aboutShow: false,
            howtoShow: true,
            dnaShow: true,
            aaShow: false,
            spinnerShow: false,
            resultsShow: false,
            message: 'Hello Marlene!'
        }
    },
    methods: {
        show(something) {
            this.aboutShow = false;
            this.howtoShow = false;
            this.dnaShow = false;
            this.aaShow = false;
            this.spinnerShow = false;
            this.resultsShow = false;
            if ((something == "dnaShow") || (something == "aaShow")) {
                this.howtoShow = true;
            }
            this[something] = true;
        }
    },
    // This will be done before the app is mounted
    beforeMount() {
        // Method to get the amino acid sequence from the server
        const getAASequence = async () => {
            await axios
                        .get(this.endpoint + "aaseq")
                        .then(response => {
                            console.log(response.data);
                            this.aaSequence = response.data.split("");
                        })
                        .catch(error => {
                            console.log(error);
                        })
        };
        // Method to get the DNA sequence from the server
        const getDNASequence = async () => {
            await axios
                        .get(this.endpoint + "dnaseq")
                        .then(response => {
                            console.log(response.data);
                            this.dnaSequence = response.data.split("");
                        })
                        .catch(error => {
                            console.log(error);
                        })
        };
        getAASequence();
        getDNASequence();
    }
}).mount('#app')