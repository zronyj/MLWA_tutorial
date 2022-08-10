from flask import Flask, request
from flask_cors import CORS

# --------------------------------- Variables ---------------------------------

# DNA Sequence (predicted)
# Reverse translated from AA sequence
# https://www.bioinformatics.org/sms2/rev_trans.html
dna_seq = "atgagctattatcatcatcatcatcatcatgattatgatattccgaccaccgaaaacctgtattttcagggcgcgatgggcattctgggcagcggccagaaacattttgaaaaacgccgcaacccggcggcgggcctgattcagagcgcgtggcgcttttatgcgaccaacctgagccgcaccgatctgcatagcacctggcagtattatgaacgcaccgtgaccgtgccgatgtatcgcggcctggaagatctgaccccgggcctgaaagtgagcattcgcgcggtgtgcgtgatgcgctttctggtgagcaaacgcaaatttaaagaaagcctgcgcctggat"
dna_seq = dna_seq.upper()

# Amino Acid Sequence
# https://www.ncbi.nlm.nih.gov/protein/6FEH_A
aa_seq = "msyyhhhhhhdydipttenlyfqgamgilgsgqkhfekrrnpaagliqsawrfyatnlsrtdlhstwqyyertvtvpmyrgledltpglkvsiravcvmrflvskrkfkeslrld"
aa_seq = aa_seq.upper()

# Creating instance of Flask server
app = Flask(__name__)

# Cross Origin Resource Sharing
CORS(app)

# ----------------------------------- Routes ----------------------------------

# Route for the URL "/"
@app.route("/")
def hello_world():
    return "<p>Hello, Marlene! Is this the web app you'd like?</p>"

# Route for the URL "/dnaseq" --> DNA
@app.route("/dnaseq")
def dna_sequence():
    return dna_seq

# Route for the URL "/aaseq" --> Amino Acid
@app.route("/aaseq")
def aa_sequence():
    return aa_seq

# Route for the URL "/dnamutate" --> DNA
@app.route("/dnamutate", methods=['GET'])
def dna_mutation():
    if request.method == 'GET':
        if "code" in request.args.keys():
            dna_code = request.args["code"]
            return {"pathogenicity": False, "percent": 23, "code": dna_code, "model": True}
        else:
            {"pathogenicity": False, "percent": 0, "code": dna_code, "model": False}
    else:
        {"pathogenicity": False, "percent": 0, "code": dna_code, "model": False}

# Route for the URL "/aamutate" --> DNA
@app.route("/aamutate", methods=['GET'])
def aa_mutation():
    if request.method == 'GET':
        if "code" in request.args.keys():
            aa_code = request.args["code"]
            return {"pathogenicity": False, "percent": 32, "code": aa_code, "model": True}
        else:
            return {"pathogenicity": False, "percent": 0, "code": aa_code, "model": False}
    else:
        return {"pathogenicity": False, "percent": 0, "code": aa_code, "model": False}

# -------------------------------- Main Program -------------------------------

if __name__ == "__main__":
    app.run(debug=True)