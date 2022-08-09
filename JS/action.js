const { createApp } = Vue

createApp({
    data() {
        return {
            endpoint: "http://127.0.0.1:5000/",
            aaSequence: ["G"],
            dnaSequence: ["A"],
            aaMut: {
                "G": ["Glycine", "glycine.png"],
                "A": ["Alanine", "alanine.png"],
                "L": ["Leucine", "leucine.png"],
                "M": ["Methionine", "methionine.png"],
                "F": ["Phenylalanine", "phenylalanine.png"],
                "W": ["Tryptophan", "tryptophan.png"],
                "K": ["Lysine", "lysine.png"],
                "Q": ["Glutamine", "glutamine.png"],
                "E": ["Glutamic Acid", "glutamic_acid.png"],
                "S": ["Serine", "serine.png"],
                "P": ["Proline", "proline.png"],
                "V": ["Valine", "valine.png"],
                "I": ["Isoleucine", "isoleucine.png"],
                "C": ["Cysteine", "cysteine.png"],
                "Y": ["Tyrosine", "tyrosine.png"],
                "H": ["Histidine", "histidine.png"],
                "R": ["Arginine", "arginine.png"],
                "N": ["Asparagine", "asparagine.png"],
                "D": ["Aspartic Acid", "aspartic_acid.png"],
                "T": ["Threonine", "threonine.png"]
            },
            dnaMut: {
                "A": ["Adenine", "adenine.png"],
                "C": ["Thymine", "thymine.png"],
                "G": ["Guanine", "guanine.png"],
                "T": ["Cytosine", "cytosine.png"]
            },
            dna: 0,
            aa: 0,
            aaImgs: {},
            dnaImgs: {},
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
    },
    // This will be done right after the app has been mounted
    mounted() {
        Object.keys(this.aaMut).forEach(element => {
            this.aaImgs[element] = new Image();
            this.aaImgs[element].src = "IMG/" + this.aaMut[element][1];
        });
        Object.keys(this.dnaMut).forEach(element => {
            this.dnaImgs[element] = new Image();
            this.dnaImgs[element].src = "IMG/" + this.dnaMut[element][1];
        });
    }
}).mount('#app')