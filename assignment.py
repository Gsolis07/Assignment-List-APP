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

@assignment_router.get("/todos")
async def get_assignments() -> dict:
    json_compatible_item_data = jsonable_encoder(assignment_list)
    return JSONResponse(content=json_compatible_item_data)


@assignment_router.get("/assignmentss/{id}")
async def get_assignment_by_id(id: int = Path(..., title="default")) -> dict:
    for assignment in assignment_list:
        if assignment.id == id:
            return {"assignment": assignment}
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"The assignment with ID={id} is not found.",
    )
        
@assignment_router.get("/assignmentss/{id}")
async def get_assignment_by_course(course: str = Path(..., title="default")) -> dict:
    for assignment in assignment_list:
        if assignment.course == course:
            return {"assignment": assignment}
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"The assignment with course={course} is not found.",
    )


@assignment_router.put("/todos/{id}")
async def update_assignment(assignment: AssignmentRequest, id: int) -> dict:
    for x in assignment_list:
        if x.id == id:
            x.title = assignment.title
            x.description = assignment.description
            x.course = assignment.course
            x.dueDate = assignment.dueDate
            return {"message": "Assignment updated successfully"}

    return {"message": f"The Assignment with ID={id} is not found."}


@assignment_router.delete("/assignments/{id}")
async def delete_assignment(id: int) -> dict:
    for i in range(len(assignment_list)):
        assignment = assignment_list[i]
        if assignment.id == id:
            assignment_list.pop(i)
            return {"message": f"The Assignment with ID={id} has been deleted."}

    return {"message": f"The Assignment with ID={id} is not found."}