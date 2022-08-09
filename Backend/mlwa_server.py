from flask import Flask
from flask_cors import CORS

# DNA Sequence (predicted)
# Reverse translated from AA sequence
# https://www.bioinformatics.org/sms2/rev_trans.html
dna_seq = "atgagctattatcatcatcatcatcatcatgattatgatattccgaccaccgaaaacctgtattttcagggcgcgatgggcattctgggcagcggccagaaacattttgaaaaacgccgcaacccggcggcgggcctgattcagagcgcgtggcgcttttatgcgaccaacctgagccgcaccgatctgcatagcacctggcagtattatgaacgcaccgtgaccgtgccgatgtatcgcggcctggaagatctgaccccgggcctgaaagtgagcattcgcgcggtgtgcgtgatgcgctttctggtgagcaaacgcaaatttaaagaaagcctgcgcctggat"
dna_seq = dna_seq.upper()

# Amino Acid Sequence
# https://www.ncbi.nlm.nih.gov/protein/6FEH_A
aa_seq = "msyyhhhhhhdydipttenlyfqgamgilgsgqkhfekrrnpaagliqsawrfyatnlsrtdlhstwqyyertvtvpmyrgledltpglkvsiravcvmrflvskrkfkeslrld"
aa_seq = aa_seq.upper()

app = Flask(__name__)
CORS(app)

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

if __name__ == "__main__":
    app.run(debug=True)