from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class ClientCreate(BaseModel):
    name: str
    industry: str = "Legal"
    email: EmailStr | None = None
    phone: str | None = None


class ClientRead(ClientCreate):
    id: int
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
