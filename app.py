from boggle import Boggle
from flask import Flask, render_template, redirect, session, request, jsonify
from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)

""" Configurations """

app.config["SECRET_KEY"] = "123ab"
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0
app.config["TESTING"] = True
# app.config["DEBUG_TB_HOSTS"] = ["dont-show-debug-toolbar"]
debug  = DebugToolbarExtension(app)
boggle_game = Boggle()
words = set(boggle_game.words)

@app.route('/')
def get_board():
    board = boggle_game.make_board()
    session['board'] = board
    session["total"] = session.get("total",0)
    session["number"] = session.get("number",1)
    total = session["total"]
    game_number = session["number"]
    return render_template('index.html', board=board, total=total, game_number = game_number)

@app.route("/check_valid_word")
def search():
    word = request.args["word"]
    board = session["board"]
    response = boggle_game.check_valid_word(board, word)
    # if response == "ok":
    #     session['score'] += len(word)
    # session['score']
    return jsonify({'result': response})

@app.route('/post_data', methods=['POST'])
def hello():
    json_data = request.json
    total = int(json_data["total"])
    session["number"] = session.get("number",0)+1
    if session["total"] < total:
        session["total"] = total
    else:
        total = session["total"]
    # import pdb
    # pdb.set_trace()
    # session["total"] = request.json
    return jsonify({"total":total, "number": session["number"]})

