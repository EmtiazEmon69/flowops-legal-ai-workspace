from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, UploadFile
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.entities import Client, Document, Reminder
from app.schemas.ai import DraftRequest, DraftResponse, SearchRequest
from app.schemas.client import ClientCreate, ClientRead
from app.services.ai_service import ai_service

router = APIRouter()


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "FlowOps AI API"}


@router.get("/dashboard")
def dashboard(db: Session = Depends(get_db)) -> dict[str, int]:
    return {
        "active_clients": db.query(Client).count(),
        "documents_processed": db.query(Document).count(),
        "open_reminders": db.query(Reminder).filter(Reminder.status == "pending").count(),
        "drafts_generated": 0,
    }


@router.post("/clients", response_model=ClientRead)
def create_client(payload: ClientCreate, db: Session = Depends(get_db)) -> Client:
    client = Client(**payload.model_dump())
    db.add(client)
    db.commit()
    db.refresh(client)
    return client


@router.get("/clients", response_model=list[ClientRead])
def list_clients(db: Session = Depends(get_db)) -> list[Client]:
    return db.query(Client).order_by(Client.created_at.desc()).all()


@router.post("/documents/upload")
async def upload_document(client_id: int, file: UploadFile, db: Session = Depends(get_db)) -> dict[str, str | int]:
    document = Document(client_id=client_id, filename=file.filename or "uploaded-file", category="Pending AI review")
    db.add(document)
    db.commit()
    db.refresh(document)
    return {"document_id": document.id, "status": "queued", "filename": document.filename}


@router.post("/ai/draft", response_model=DraftResponse)
def draft(payload: DraftRequest) -> DraftResponse:
    return DraftResponse(
        output=ai_service.draft(
            prompt=payload.prompt,
            context=payload.context,
            output_type=payload.output_type,
        )
    )


@router.post("/ai/search")
def search(payload: SearchRequest) -> dict[str, object]:
    return {
        "query": payload.query,
        "results": [],
        "next_step": "Connect vector search after document embeddings are generated.",
    }


@router.post("/reminders/sample")
def create_sample_reminder(client_id: int, db: Session = Depends(get_db)) -> dict[str, int | str]:
    reminder = Reminder(
        client_id=client_id,
        title="Follow up for missing documents",
        channel="email",
        due_at=datetime.utcnow() + timedelta(days=3),
    )
    db.add(reminder)
    db.commit()
    db.refresh(reminder)
    return {"id": reminder.id, "status": reminder.status}
