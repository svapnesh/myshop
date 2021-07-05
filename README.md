# myshop
PROJECT SETUP
Clone this repository:
git clone https://github.com/svapnesh/myshop.git
Create virtual environment:
sudo apt install virtualenv
virtualenv --python='/usr/bin/python3.6' env
source env/bin/activate
cd MyShop/
Install dependencies:
pip install -r requirements.txt

Run migrations:
./manage.py migrate
Create superuser:
./manage.py createsuperuser
Run the server:
./manage.py runserver
Browse below url:
Admin url: - http://localhost:8000/admin/
