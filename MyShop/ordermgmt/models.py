from django.db import models

from usermgmt.models import BaseModel, User

from productmgmt.models import Product


class Cart(BaseModel):
    secret_id = models.CharField(max_length=250, db_index=True)
    user = models.ForeignKey(User, blank=True, null=True,
                                related_name='cart',
                                on_delete=models.SET_NULL)

    def __str__(self):
        return self.secret_id


class CartItems(BaseModel):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE,
                                related_name='cart_items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE,
                                    related_name='cart_products')
    quantity = models.IntegerField(null=True, blank=True)
    

    def __str__(self):
        return self.cart.secret_id