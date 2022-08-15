from flask import Flask, request
from flask_cors import CORS
import time

# --------------------------------- Variables ---------------------------------

# Read DNA sequence from file
dna_seq = ""
with open("protein_dna.dat", "r") as f:
    for line in f.readlines():
        if not (">" in line):
            dna_seq = line.upper()

# Read amino acid sequence from file
aa_seq = ""
with open("protein_aa.dat", "r") as g:
    for line in g.readlines():
        if not (">" in line):
            aa_seq = line.upper()


# Codon table to translate DNA into Amino Acids
translator = {"ATT": "I", "ACT": "T", "AAT": "N", "AGT": "S",
              "ATC": "I", "ACC": "T", "AAC": "N", "AGC": "S",
              "ATA": "I", "ACA": "T", "AAA": "K", "AGA": "R",
              "ATG": "M", "ACG": "T", "AAG": "K", "AGG": "R",
              "CTT": "L", "CCT": "P", "CAT": "H", "CGT": "R",
              "CTC": "L", "CCC": "P", "CAC": "H", "CGC": "R",
              "CTA": "L", "CCA": "P", "CAA": "Q", "CGA": "R",
              "CTG": "L", "CCG": "P", "CAG": "Q", "CGG": "R",
              "GTT": "V", "GCT": "A", "GAT": "D", "GGT": "G",
              "GTC": "V", "GCC": "A", "GAC": "D", "GGC": "G",
              "GTA": "V", "GCA": "A", "GAA": "E", "GGA": "G",
              "GTG": "V", "GCG": "A", "GAG": "E", "GGG": "G",
              "TTT": "F", "TCT": "S", "TAT": "Y", "TGT": "C",
              "TTC": "F", "TCC": "S", "TAC": "Y", "TGC": "C",
              "TTA": "L", "TCA": "S", "TAA": "-", "TGA": "-",
              "TTG": "L", "TCG": "S", "TAG": "-", "TGG": "W"
              }

# List with all letters of the amino acids
aa_full_list = ["G","A","L","M","F","W","K","Q","E","S","P","V","I","C","Y","H","R","N","D","T"]

# Creating instance of Flask server
app = Flask(__name__)

# Cross Origin Resource Sharing
CORS(app)

# ---------------------------------- Methods ----------------------------------

# Method to translate DNA into amino acids
def ribosome(dna_s):
    if len(dna_s) % 3 == 0:
        aa_s = []
        for i in range(0, len(dna_s), 3):
            try:
                codon = dna_s[i:i+3]
                aa_s.append(translator[codon])
            except Exception as e:
                print(e)
                print("An error was found in the DNA sequence.")
                print(f"Please check codon {dna_s[i:i+3]} at position {i}.")
                return [False, ""]
        aa_ss = "".join(aa_s)
        return [True, aa_ss]
    else:
        print("An error was found in the DNA sequence.")
        print("The length of the DNA sequence has to be a multeple of 3.")
        print(f"Current sequence has a length of {len(dna_s)} nucleotides.")
        return [False, ""]

# Method to create a mutated sequence of amino acids, based on DNA
def dna_seq_generator(code):
    # If the code is longer or shorter than it should
    if ((len(code) >= 3) and (len(code) <= 5)):
        primera = code[0]
        ultima = code[-1]
        # If the code contains a letter which is not a nucleotide, or if both
        # letters are the same.
        if ((primera in "ACGT") and (ultima in "ACGT") and (primera != ultima)):
            numero = int(code[1:-1])
            # If the number in the code is out of range
            if ((numero >= 1) and (numero <= len(dna_seq))):
                # If the position and the first letter of the code don't match
                if (dna_seq[numero - 1] == primera):
                    new_seq_list = list(dna_seq)
                    new_seq_list[numero - 1] = ultima
                    dna_seq_string = "".join(new_seq_list)
                    translate_ok, aa_seq_string = ribosome(dna_seq_string)
                    if translate_ok:
                        return aa_seq_string
                    else:
                        print("An error happened during translation ...")
                        return ""
                else:
                    print("The letter from the code and the sequence at the provided position don't match!")
                    return ""
            else:
                print("The provided number is out of range of the sequence's length.")
                return ""
        else:
            print("One/Both of the provided letters don't belong to the sequence.")
            return ""
    else:
        print("The code's length presents an error.")
        return ""

# Method to create a mutated sequence of amino acids
def aa_seq_generator(code):
    # If the code is longer or shorter than it should
    if ((len(code) >= 3) and (len(code) <= 5)):
        primera = code[0]
        ultima = code[-1]
        # If the code contains a letter which is not an amino acid, or if both
        # letters are the same.
        if ((primera in aa_full_list) and (ultima in aa_full_list) and (primera != ultima)):
            numero = int(code[1:-1])
            # If the number in the code is out of range
            if ((numero >= 1) and (numero <= len(aa_seq))):
                # If the position and the first letter of the code don't match
                if (aa_seq[numero - 1] == primera):
                    new_seq_list = list(aa_seq)
                    new_seq_list[numero - 1] = ultima
                    return "".join(new_seq_list)
                else:
                    print("The letter from the code and the sequence at the provided position don't match!")
                    return ""
            else:
                print("The provided number is out of range of the sequence's length.")
                return ""
        else:
            print("One/Both of the provided letters don't belong to the sequence.")
            return ""
    else:
        print("The code's length presents an error.")
        return ""

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
            mutated_dna_seq = dna_seq_generator(dna_code)
            time.sleep(3) # Let's make the frontend wait for 3 seconds
            if len(mutated_dna_seq) > 0:
                return {"pathogenicity": False, "percent": 23, "code": dna_code, "model": True, "sequence": mutated_dna_seq}
            else:
                {"pathogenicity": False, "percent": 0, "code": dna_code, "model": False, "sequence": mutated_dna_seq}
        else:
            {"pathogenicity": False, "percent": 0, "code": dna_code, "model": False, "sequence": mutated_dna_seq}
    else:
        {"pathogenicity": False, "percent": 0, "code": dna_code, "model": False, "sequence": mutated_dna_seq}

# Route for the URL "/aamutate" --> DNA
@app.route("/aamutate", methods=['GET'])
def aa_mutation():
    if request.method == 'GET':
        if "code" in request.args.keys():
            aa_code = request.args["code"]
            mutated_aa_seq = aa_seq_generator(aa_code)
            time.sleep(3) # Let's make the frontend wait for 3 seconds
            if len(mutated_aa_seq) > 0:
                return {"pathogenicity": False, "percent": 32, "code": aa_code, "model": True, "sequence": mutated_aa_seq}
            else:
                return {"pathogenicity": False, "percent": 0, "code": aa_code, "model": False, "sequence": mutated_aa_seq}
        else:
            return {"pathogenicity": False, "percent": 0, "code": aa_code, "model": False, "sequence": mutated_aa_seq}
    else:
        return {"pathogenicity": False, "percent": 0, "code": aa_code, "model": False, "sequence": mutated_aa_seq}

# -------------------------------- Main Program -------------------------------

if __name__ == "__main__":
    app.run(debug=True)