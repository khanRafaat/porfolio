from rest_framework import serializers

from .models import Invoice, Milestone, Project, ProjectUpdate


class MilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Milestone
        fields = ("title", "description", "status", "due_date")


class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = ("number", "amount", "currency", "status", "issued_date", "due_date")


class ProjectUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectUpdate
        fields = ("title", "body", "created_at")


class ProjectSerializer(serializers.ModelSerializer):
    milestones = MilestoneSerializer(many=True, read_only=True)
    invoices = InvoiceSerializer(many=True, read_only=True)
    updates = ProjectUpdateSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = (
            "title", "description", "status", "progress",
            "start_date", "due_date", "milestones", "invoices", "updates",
        )
