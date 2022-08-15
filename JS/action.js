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
            patho: "",
            perce: "",
            model: "",
            dnaSlider: false,
            aaSlider: false,
            aaImgs: {},
            dnaImgs: {},
            disableControls: false,
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
            // Si el codigo es mas corto o mas largo de lo que deberia de ser ...
            if ((this.dnaMutCode.length >= 3) && (this.dnaMutCode.length <= 5)) {
                var primera = this.dnaMutCode.slice(0,1); // Primera letra del codigo
                var ultima = this.dnaMutCode.slice(-1); // Ultima letra del codigo
                // Si alguna de las letras incluidas en el codigo no corresponde a las existentes o si ambas son iguales
                if (Object.keys(this.dnaMut).includes(primera) && Object.keys(this.dnaMut).includes(ultima) && (primera != ultima)) {
                    var numero = this.dnaMutCode.slice(1,-1);
                    // Si el numero es mas grande o mas pequeno que la longitud de la secuencia
                    if ((+numero >= 1) && (+numero <= this.dnaSequence.length)) {
                        this.disableControls = true;
                        this.spinnerShow = true;
                        axios
                            .get(this.endpoint + 'dnamutate', // Enviar solicitud a nueva ruta
                                {
                                    params: {
                                        code: this.dnaMutCode // Incluir codigo como argumento
                                    }
                                })
                            .then(response => {
                                console.log(response.data); // Si todo sale bien
                                this.spinnerShow = false;
                                if (response.data["model"]) {
                                    this.patho = response.data["pathogenicity"];
                                    this.perce = response.data["percent"];
                                    this.model = response.data["model"];
                                    this.resultsShow = true;
                                }
                            })
                            .catch(error => {
                                this.spinnerShow = false;
                                console.log(error); // Si algo NO sale bien
                            })
                    } else {
                        console.log("Error de numero")
                    }
                } else {
                    console.log("Error de letras")
                }
            } else {
                console.log("Error de longitud")
            }
        },
        // Metodo para enviar el codigo de mutacion al backend DNA
        runAA() {
            // Si el codigo es mas corto o mas largo de lo que deberia de ser ...
            if ((this.aaMutCode.length >= 3) && (this.aaMutCode.length <= 5)) {
                var primera = this.aaMutCode.slice(0,1); // Primera letra del codigo
                var ultima = this.aaMutCode.slice(-1); // Ultima letra del codigo
                // Si alguna de las letras incluidas en el codigo no corresponde a las existentes o si ambas son iguales
                if (Object.keys(this.aaMut).includes(primera) && Object.keys(this.aaMut).includes(ultima) && (primera != ultima)) {
                    var numero = this.aaMutCode.slice(1,-1);
                    // Si el numero es mas grande o mas pequeno que la longitud de la secuencia
                    if ((+numero >= 1) && (+numero <= this.aaSequence.length)) {
                        this.disableControls = true;
                        this.spinnerShow = true;
                        axios
                            .get(this.endpoint + 'aamutate',
                                {
                                    params: {
                                        code: this.aaMutCode
                                    }
                                })
                            .then(response => {
                                console.log(response.data);
                                this.spinnerShow = false;
                                if (response.data["model"]) {
                                    this.patho = response.data["pathogenicity"];
                                    this.perce = response.data["percent"];
                                    this.model = response.data["model"];
                                    this.resultsShow = true;
                                }
                            })
                            .catch(error => {
                                this.spinnerShow = false;
                                console.log(error);
                            })
                    } else {
                        console.log("Error de numero")
                    }
                } else {
                    console.log("Error de letras")
                }
            } else {
                console.log("Error de longitud")
            }      
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