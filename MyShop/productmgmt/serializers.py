
from rest_framework import serializers

from productmgmt.models import Product

class ProductListSerializer(serializers.ModelSerializer):
    category = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ('id', 'title', 'description', 'price', 'category')

    def get_category(self, obj):
        return obj.category.name if obj.category else None
