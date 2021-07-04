from django.contrib import admin

from ordermgmt.models import Cart, CartItems

# Register your models here.
class CartAdmin(admin.ModelAdmin):
    list_display = ["id", "secret_id", "user"]
    search_fields = ("user",)

admin.site.register(Cart, CartAdmin)


class CartItemsAdmin(admin.ModelAdmin):
    list_display = ["id", "product", "quantity"]
    search_fields = ("product",)

admin.site.register(CartItems, CartItemsAdmin)