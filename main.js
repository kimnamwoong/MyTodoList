const taskInput = document.querySelector(".task_input input");
let todos = JSON.parse(localStorage.getItem("todo-list"));
const taskBox = document.querySelector(".task-box");
const clearBtn = document.querySelector(".clear-btn");

let editTaskID;
let isEdited = false;		// 수정상태인지 확인하는 boolean variable

const filters = document.querySelectorAll(".filters span");

// sorting by status 
filters.forEach(btn => {
	btn.addEventListener('click',()=>{
		document.querySelector('span.active').classList.remove("active");
		btn.classList.add("active");
		showTodo(btn.id)

	});
});

// show todo 
function showTodo(filter){
	let li = "";
	if(todos){
			todos.forEach((todo,id)=>{
				let isCompleted = todo.status == "completed" ? "checked": "" ;
			
				if(filter==todo.status || filter=="all"){
								li+= `	<li class="task">
									<label for="${id}">
										<input type="checkbox" id="${id}" onclick="updateStatus(this)" ${isCompleted}>
										<p class="${isCompleted}">${todo.name}</p>
									</label>
									<div class="settings">
										<img src="icons/setting_icon.png" alt="setting" onclick="showMenu(this)">
										<ul class="task-menu">
											<li onclick="editTask(${id},'${todo.name}')"><img src="icons/icons8-edit-30.png" alt="edit">edit</li>
											<li onclick="deleteTask(${id})"><img src="icons/icons8-delete-30.png" alt="delete">delete</li>
										</ul>
									</div>
								</li>`;
				}
		});
	}
	taskBox.innerHTML = li || `<span>You don't have any ${filter} task</span>`;
}

showTodo("all");

// status update : pending,completed
function updateStatus(selectedTask){
	let taskName = selectedTask.parentElement.lastElementChild;
	if(selectedTask.checked){
		taskName.classList.add("checked");
		todos[selectedTask.id].status = "completed";
	} else{
		taskName.classList.remove("checked");
		todos[selectedTask.id].status = "pending";
	}
	localStorage.setItem("todo-list",JSON.stringify(todos));
}

// update task
function editTask(taskId,taskName){
	editTaskID = taskId;
	isEdited = true;
	taskInput.value = taskName;
	
}

// delete task 
function deleteTask(deleteId){
	todos.splice(deleteId,1);
	localStorage.setItem("todo-list",JSON.stringify(todos));
	showTodo("all");
}

// delete all task 
clearBtn.addEventListener("click",()=>{
	todos.splice(0,todos.length);
	localStorage.setItem("todo-list",JSON.stringify(todos));
	showTodo("all");
})


// show edit,delete button 
function showMenu(selectedTask){
	let taskMenu = selectedTask.parentElement.lastElementChild;
	taskMenu.classList.add("show");
	document.addEventListener("click",e =>{
		if(e.target.tagName != "IMG" || e.target!=selectedTask){
			taskMenu.classList.remove("show");
		}
	})
}

// input tag 이벤트 추가 : add todo 
taskInput.addEventListener("keyup",e=>{
	let userTask = taskInput.value;
	if(e.key=="Enter" && userTask!= ""){ // enter key 눌렀을때 and input value가 비어있지 않을경우 
		if(!isEdited){
			
			if(!todos){
				todos = [];		// localStorage가 비어있을 경우 empty array 
			}
			
			let taskInfo = {name:userTask,status:"pending"}		// 기본 status는 보류중 (pending) 로 설정 
			todos.push(taskInfo);
			
		} else {
			isEdited = false;
			todos[editTaskID].name = userTask;
		}
		taskInput.value = "";
		localStorage.setItem("todo-list",JSON.stringify(todos));
		showTodo("all");
	}	
	
});
