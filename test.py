from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):

    # TODO -- write tests for every view function / feature!
    def test_welcome_window(self):
        with app.test_client() as client:

            resp = client.get("/welcome_screen")
            raise
            html = resp.get_data(as_text=True)
            self.assertEqual(resp.status_code, 200)
            self.assertIn('<h5 class="modal-title text-center">Choose Your Game:</h5>', html)
