const { createApp } = Vue

createApp({
    data() {
        return {
            endpoint: "http://127.0.0.1:5000/",
            aaSequence: ["G"],
            dnaSequence: ["A"],
            aaPostSequence: ["G"],
            dnaPostSequence: ["A"],
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
            dnaMutCode: "",
            aaMutCode: "",
            dnaSlider: false,
            aaSlider: false,
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
        // Metodo para mostrar/ocultar segmentos de la Single Page Application (SPA)
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
        },
        // Metodo para actualizar el codigo de mutacion al cambiar el slider DNA
        updateDNAMut() {
            this.dnaMutCode = this.dnaSequence[this.dna] + (+this.dna + 1) + this.dnaPostSequence[this.dna];
        },
        // Metodo para actualizar el codigo de mutacion al seleccionar una mutacion DNA
        onDNA(nam) {
            this.dnaPostSequence[this.dna] = nam;
            this.dnaMutCode = this.dnaSequence[this.dna] + (+this.dna + 1) + nam;
            var difference = 0;
            for (var i = 0; i < this.dnaSequence.length; i++) {
                if (this.dnaSequence[i] != this.dnaPostSequence[i]) {
                    difference = difference + 1;
                }
            }
            if (difference == 0) {
                this.dnaSlider = false;
            } else {
                this.dnaSlider = true;
            }
        },
        // Metodo para actualizar el codigo de mutacion al cambiar el slider AA
        updateAAMut() {
            this.aaMutCode = this.aaSequence[this.aa] + (+this.aa + 1) + this.aaPostSequence[this.aa];
        },
        // Metodo para actualizar el codigo de mutacion al seleccionar una mutacion AA
        onAA(nam) {
            this.aaPostSequence[this.aa] = nam;
            this.aaMutCode = this.aaSequence[this.aa] + (+this.aa + 1) + nam;
            var difference = 0;
            for (var i = 0; i < this.aaSequence.length; i++) {
                if (this.aaSequence[i] != this.aaPostSequence[i]) {
                    difference = difference + 1;
                }
            }
            if (difference == 0) {
                this.aaSlider = false;
            } else {
                this.aaSlider = true;
            }
        },
        // Metodo para enviar el codigo de mutacion al backend DNA
        runDNA() {
            axios
                .get(this.endpoint + 'dnamutate',
                    {params: {
                        code: this.dnaMutCode
                    }
                    })
                .then(response => {
                    console.log(response.data);
                })
                .catch(error => {
                    console.log(error);
                })
        },
        // Metodo para enviar el codigo de mutacion al backend DNA
        runAA() {
            axios
                .get(this.endpoint + 'aamutate',
                    {params: {
                        code: this.aaMutCode
                    }
                    })
                .then(response => {
                    console.log(response.data);
                })
                .catch(error => {
                    console.log(error);
                })
        }
    },
    // This will be done before the app is mounted
    beforeMount() {
        // Method to get the amino acid sequence from the server
        const getAASequence = async () => {
            await axios
                        .get(this.endpoint + "aaseq")
                        .then(response => {
                            this.aaSequence = response.data.split("");
                            this.aaPostSequence = response.data.split("");
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
                            this.dnaSequence = response.data.split("");
                            this.dnaPostSequence = response.data.split("");
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