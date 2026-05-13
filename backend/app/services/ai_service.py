from openai import OpenAI

from app.core.config import settings


class AIService:
    def __init__(self) -> None:
        self.client = OpenAI(api_key=settings.openai_api_key) if settings.openai_api_key else None

    def draft(self, prompt: str, context: str | None = None, output_type: str = "summary") -> str:
        if settings.ai_mock_mode:
            return (
                f"Mock {output_type} draft for review.\n\n"
                f"Task: {prompt}\n\n"
                f"Context used: {context or 'No context provided'}\n\n"
                "Set AI_MOCK_MODE=false and configure OPENAI_API_KEY to generate real AI output."
            )

        if not self.client:
            return "AI service is not configured. Add OPENAI_API_KEY to backend/.env."

        system = (
            "You are FlowOps AI, an assistant for legal and professional services teams. "
            "Draft clearly, preserve human review, and avoid presenting legal advice as final."
        )
        user_content = f"Output type: {output_type}\n\nContext:\n{context or 'No context provided'}\n\nTask:\n{prompt}"

        response = self.client.responses.create(
            model="gpt-4.1-mini",
            input=[
                {"role": "system", "content": system},
                {"role": "user", "content": user_content},
            ],
        )
        return response.output_text

    def extract_document_fields(self, text: str) -> dict[str, list[str]]:
        # Replace this with structured extraction once real OCR storage is connected.
        return {
            "names": [],
            "dates": [],
            "addresses": [],
            "case_numbers": [],
            "source_preview": [text[:500]],
        }


ai_service = AIService()
