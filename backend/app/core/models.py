from pathlib import Path

from django.db import models
import uuid


def sheet_file_path(_instance, filename):
    """Generate new file path for sheet file"""
    ext = filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    return str(Path("uploads/sheets") / filename)


class Composer(models.Model):
    """A composer object in the database"""

    name = models.CharField(max_length=255)
    born = models.DateField(null=True)
    died = models.DateField(null=True)
    is_alive = models.BooleanField(default=False)
    era = models.CharField(max_length=255)
    short_name = models.CharField(max_length=30, blank=True)

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

    def get_short_name(self):
        """Get composer short name"""
        if self.short_name:
            return self.short_name
        name_parts = self.name.split(" ")
        lname = name_parts.pop()
        initials = "".join([f"{name[0]}." for name in name_parts])
        return f"{initials} {lname}"


class Sheet(models.Model):
    """A sheet music file"""

    filename = models.CharField(max_length=255)
    format = models.CharField(max_length=255)
    type = models.CharField(max_length=255, blank=True)
    file = models.FileField(upload_to=sheet_file_path)

    def __str__(self):
        """Str representation"""
        return self.filename


class Piece(models.Model):
    """A Piece in the database"""

    title = models.CharField(max_length=255)
    catalog = models.CharField(max_length=255, blank=True)
    composer = models.ManyToManyField(to="Composer", related_name="pieces")
    files = models.ManyToManyField(to="Sheet", related_name="pieces")

    def __str__(self):
        """Get string representation"""
        return self.title
