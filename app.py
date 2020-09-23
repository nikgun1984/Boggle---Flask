from boggle import Boggle
from flask import Flask, render_template, redirect, session, request, jsonify
from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)

""" Configurations """

app.config["SECRET_KEY"] = "123ab"
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0
app.config["TESTING"] = True
app.config["DEBUG_TB_HOSTS"] = ["dont-show-debug-toolbar"]
debug  = DebugToolbarExtension(app)
boggle_game = Boggle()
words = set(boggle_game.words)

@app.route('/')
def get_board():
    board = boggle_game.make_board()
    session['board'] = board
    # session['score'] = 0
    return render_template('index.html', board=board)

@app.route("/check_valid_word")
def search():
    word = request.args["word"]
    board = session["board"]
    response = boggle_game.check_valid_word(board, word)
    # if response == "ok":
    #     session['score'] += len(word)
    # session['score']
    return jsonify({'result': response})

