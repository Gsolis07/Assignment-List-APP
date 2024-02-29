from fastapi import APIRouter, Path, HTTPException, status
from model import Assignment, AssignmentRequest
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

assignment_router = APIRouter()

assignment_list = []
max_id: int = 0

@assignment_router.post("/assignments", status_code=status.HTTP_201_CREATED)
async def add_assignment(assignment: AssignmentRequest) -> dict:
    global max_id
    max_id += 1

    newAssignment = Assignment(id=max_id, title=assignment.title, description=assignment.description, course=assignment.course, dueDate=assignment.dueDate)
    assignment_list.append(newAssignment)
    json_compatible_item_data = newAssignment.model_dump()
    return JSONResponse(json_compatible_item_data, status=status.HTTP_201_CREATED)

