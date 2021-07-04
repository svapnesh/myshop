from django.http.response import JsonResponse

from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny

from productmgmt.models import Product
from productmgmt.serializers import ProductListSerializer

from ordermgmt.models import Cart, CartItems


class ProductSearchView(generics.ListAPIView):
    """
    Product list API
    """
    serializer_class = ProductListSerializer
    
    def get_queryset(self):
        # Get search query parameter
        search_param = self.request.query_params.get('q')

        # Filter products using search text
        products = Product.objects.filter(
            is_active=True, is_published=True,
            title__startswith=search_param)
        return products


class AddToCartView(APIView):
    """
    Add to Cart API
    POST method is allowed
    """
    permission_classes = (AllowAny,)

    def post(self, request):
        data = request.data
        secret_id = data.get('secret_id')
        if not secret_id:
            content = {"message": "Invalid secret id"}
            return JsonResponse(content, status=status.HTTP_400_BAD_REQUEST)

        product_id = data.get('product_id')
        if not product_id:
            content = {"message": "Invalid product id"}
            return JsonResponse(content, status=status.HTTP_400_BAD_REQUEST)

        # checker for product exists
        product = Product.objects.filter(id=product_id, is_published=True, is_active=True).last()
        if not product:
            content = {"message": "Product with given id is not available/active."}
            return JsonResponse(content, status=status.HTTP_400_BAD_REQUEST)

        # Get or create cart
        if secret_id:
            cart, is_created = Cart.objects.get_or_create(secret_id=secret_id)
        else:
            cart, is_created = Cart.objects.get_or_create(user=request.user)
        
        # Add products to cart items
        if is_created:
            cart_item = CartItems.objects.create(cart=cart, product=product, quantity=1)
            cart_item.save()
        else:
            # Add product in cart items if not exists
            if not cart.cart_items.filter(product=product).exists():
                cart_item = CartItems.objects.create(cart=cart, product=product, quantity=1)
                cart_item.save()

        content = {'message': "Item added to cart successfully"}
        return JsonResponse(content, status=status.HTTP_200_OK)


class RemoveFromCartView(APIView):
    """
    Remove from Cart API
    POST method is allowed
    """

    permission_classes = (AllowAny,)

    def post(self, request):
        data = request.data
        secret_id = data.get('secret_id')
        if not secret_id:
            content = {"message": "Invalid secret id"}
            return JsonResponse(content, status=status.HTTP_400_BAD_REQUEST)

        product_id = data.get('product_id')
        if not product_id:
            content = {"message": "Invalid product id"}
            return JsonResponse(content, status=status.HTTP_400_BAD_REQUEST)

        # Checker for secret id exists
        is_secret_id_exists = Cart.objects.filter(secret_id=secret_id).exists()
        if not is_secret_id_exists:
            content = {"message": "Invalid secret id"}
            return JsonResponse(content, status=status.HTTP_400_BAD_REQUEST)

        # Get cart object
        if secret_id:
            cart = Cart.objects.get(secret_id=secret_id)
        else:
            cart = Cart.objects.get(user=request.user)

        product = Product.objects.get(id=product_id)
        
        # Remove product from cart items
        if cart:
            cart_item = CartItems.objects.get(product=product)
            cart_item.delete()

        content = {'message': "Item deleted from cart successfully"}
        return JsonResponse(content, status=status.HTTP_200_OK)
