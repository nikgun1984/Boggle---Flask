from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle

class FlaskTests(TestCase):

    def setUp(self):
        """Stuff to do before every test."""

        self.client = app.test_client()
        app.config['TESTING'] = True

    # TODO -- write tests for every view function / feature!
    def test_welcome_window(self):
        with app.test_client() as client:

            resp = client.get("/")
            html = resp.get_data(as_text=True)
            self.assertEqual(resp.status_code, 200)
            self.assertIn('<h5 class="modal-title text-center">Choose Your Game:</h5>', html)

    def test_get_board(self):
        with app.test_client() as client:

            resp = client.get("/4")
            # import pdb
            # pdb.set_trace()
            print(session["board"])
            self.assertEqual(resp.status_code, 200)
            self.assertIsNotNone(session["board"])
            self.assertEqual(session["number"],1)
            self.assertEqual(len(session["board"]),4)

    def test_check_valid_word(self):
        """Test invalid word on the board"""
        with app.test_client() as client:
            resp = client.get("/4")
            word = "ant"
            board = session["board"]
            self.assertEqual(resp.status_code, 200)
            self.assertEqual(Boggle().check_valid_word(board, word, 4), "not-on-board")

    def test_valid_word(self):
        """Test if word is valid by modifying the board in the session"""

        with self.client as client:
            with client.session_transaction() as ses:
                ses['board'] = [["D", "A", "T", "T"], 
                                 ["C", "A", "T", "T"], 
                                 ["E", "A", "T", "T"], 
                                 ["M", "A", "T", "T"]] 
        response = self.client.get('/5/check_valid_word?word=mat')
        self.assertEqual(response.json['result'], 'ok')





