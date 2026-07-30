from django.contrib import admin
from unfold.admin import ModelAdmin, StackedInline, TabularInline

from .models import Invoice, Milestone, Project, ProjectUpdate


class MilestoneInline(TabularInline):
    model = Milestone
    extra = 0


class InvoiceInline(TabularInline):
    model = Invoice
    extra = 0


class ProjectUpdateInline(StackedInline):
    model = ProjectUpdate
    extra = 0


@admin.register(Project)
class ProjectAdmin(ModelAdmin):
    list_display = ("title", "client", "status", "progress", "due_date", "is_demo")
    list_filter = ("status", "is_demo")
    search_fields = ("title", "client__email")
    inlines = (MilestoneInline, InvoiceInline, ProjectUpdateInline)


@admin.register(Invoice)
class InvoiceAdmin(ModelAdmin):
    list_display = ("number", "project", "amount", "currency", "status", "due_date")
    list_filter = ("status",)
    search_fields = ("number", "project__title")
