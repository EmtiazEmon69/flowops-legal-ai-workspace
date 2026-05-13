from pydantic import BaseModel


class DraftRequest(BaseModel):
    prompt: str
    context: str | None = None
    output_type: str = "summary"


class DraftResponse(BaseModel):
    output: str


class SearchRequest(BaseModel):
    query: str

