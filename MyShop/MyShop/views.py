from django.shortcuts import render


# Render home page
def HomePageView(request):
    context = {}
    return render(request, 'index.html', context)