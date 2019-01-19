from django.contrib import admin

from core.models import Composer, Piece, Sheet

admin.register(Sheet)
admin.register(Piece)
admin.register(Composer)
