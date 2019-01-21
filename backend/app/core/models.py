import uuid
from pathlib import Path

from django.contrib.auth import get_user_model
from django.db import models


def sheet_file_path(_instance, filename):
    """Generate new file path for sheet file"""
    ext = filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    return str(Path("uploads/sheets") / filename)


def _generate_short_name(name):
    """Get composer short name"""
    name_parts = name.split(" ")
    lname = name_parts.pop()
    initials = "".join([f"{name[0]}." for name in name_parts])
    return f"{initials} {lname}".strip()


class Composer(models.Model):
    """A composer object in the database"""

    name = models.CharField(max_length=255)
    born = models.DateField(null=True)
    died = models.DateField(null=True)
    is_alive = models.BooleanField(default=False)
    era = models.CharField(max_length=255)
    short_name = models.CharField(max_length=30, blank=True)
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)

    def __str__(self):
        """Return name as string representation"""
        born = self.born.year if self.born else "?"
        died = ""
        if self.died:
            died = self.died.year
        elif self.is_alive:
            died = "present"
        else:
            died = "?"

        return f"{self.name} ({born} - {died})"

    def save(self, *args, **kwargs):
        """Generate a short name if not provided and save"""
        if not self.pk and not self.short_name:
            self.short_name = _generate_short_name(self.name)
        super().save(*args, **kwargs)


class Sheet(models.Model):
    """A sheet music file"""

    filename = models.CharField(max_length=255)
    file_format = models.CharField(max_length=255)
    sheet_type = models.CharField(max_length=255, blank=True)
    file = models.FileField(upload_to=sheet_file_path)
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)

    def __str__(self):
        """Str representation"""
        return self.filename


class Piece(models.Model):
    """A Piece in the database"""

    title = models.CharField(max_length=255)
    catalog = models.CharField(max_length=255, blank=True)
    composer = models.ManyToManyField(to="Composer", related_name="pieces")
    sheets = models.ManyToManyField(to="Sheet", related_name="pieces")
    tags = models.ManyToManyField(to="Tag", related_name="pieces")
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)

    def __str__(self):
        """Get string representation"""
        return self.title


class Tag(models.Model):
    """A Tag in the database"""

    name = models.CharField(max_length=50)
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)

    def __str__(self):
        """Get string representation"""
        return self.name
