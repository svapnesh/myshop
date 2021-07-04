from django.contrib import admin

from productmgmt.models import Category, Product

# Register your models here.
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "is_active"]
    search_fields = ("name",)

admin.site.register(Category, CategoryAdmin)


class ProductAdmin(admin.ModelAdmin):
    list_display = ["id", "title", "category", "price", "is_active"]
    search_fields = ("title", "category")

admin.site.register(Product, ProductAdmin)