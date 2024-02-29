from pydantic import BaseModel

class Assignment(BaseModel):
    id: int
    title: str
    course: str
    description: str
    dueDate: str

class AssignmentRequest(BaseModel):
    title: str
    course: str
    description: str
    dueDate: str