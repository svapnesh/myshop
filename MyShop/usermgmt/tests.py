from django.test import TestCase
from usermgmt.models import User

class UserTestCase(TestCase):
    def setUp(self):
        User.objects.create(email="abc@gmail.com", username='abc')
        User.objects.create(email="def@gmail.com", username='def')

    def test_user_created(self):
        user_abc = User.objects.get(email='abc@gmail.com')
        print(user_abc)

        user_def = User.objects.get(email='def@gmail.com')
        print(user_def)
