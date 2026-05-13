from datetime import datetime


def build_missing_document_reminder(client_name: str, document_name: str, due_at: datetime) -> dict[str, str]:
    return {
        "title": f"Request missing {document_name} from {client_name}",
        "channel": "email",
        "due_at": due_at.isoformat(),
        "status": "pending",
    }

