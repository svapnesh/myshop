from django.urls import path

from productmgmt.api_views import ProductSearchView, AddToCartView, \
    RemoveFromCartView


urlpatterns = [
    path('search/', ProductSearchView.as_view(), name="search_products"),
    path('cart/item/add/', AddToCartView.as_view(), name="add_to_cart"),
    path('cart/item/remove/', RemoveFromCartView.as_view(), name="remove_from_cart"),
    # path('cart/items/', CartItemsView.as_view(), name="cart_items"),
]
