from django.db import models
from django.db.models.fields import related

from mptt.models import MPTTModel, TreeForeignKey

from usermgmt.models import BaseModel, User


class Category(MPTTModel, BaseModel):
    name = models.CharField(max_length=100, db_index=True, unique=True)
    parent = TreeForeignKey('self', on_delete=models.CASCADE, null=True, 
                                blank=True, related_name='child_categories')

    def __str__(self):
        return self.name


class Product(BaseModel):
    title = models.CharField(max_length=250, db_index=True)
    description = models.TextField(null=True, blank=True)
    category = models.ForeignKey(Category, null=True, blank=True, 
                                    on_delete=models.SET_NULL,
                                    related_name='products')
    price = models.DecimalField(max_digits=19, decimal_places=2)
    # TODO : Add ImageField
    quantity = models.IntegerField(null=True, blank=True)
    added_by = models.ForeignKey(User, related_name='added_products',
                                    null=True, blank=True,
                                    on_delete=models.SET_NULL)
    is_published = models.BooleanField(default=False)

    def __str__(self):
        return self.title
