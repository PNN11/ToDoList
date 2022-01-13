const set_id = () => {
    let id = Number(localStorage.getItem("todo_number")) || 0;
    let next_id = id + 1;
    localStorage.setItem("todo_number", next_id);
    return id
}

const todoModel = {
    list: [],
    getTodo(id) {
      const task = this.list.find((task) => task.id === id);
      return task;
    },
    createTodo(someNewTitle, someNewDescription) {
      const newTask = {
        id: set_id(),
        title: someNewTitle,
        description: someNewDescription || "",
        completed: false,
      };
      this.list.push(newTask);
      this.addListToLocalStorage();
    },
    updateTodo(Id, newTask) {
        const newIndex = this.list.findIndex((task) => task.id === Id);
        Object.assign(this.list[newIndex], newTask);
        this.addListToLocalStorage();
    },
    deleteTodo(id) {
        this.list = this.list.filter((task) => task.id !== id);
        this.addListToLocalStorage();
    },
    addListToLocalStorage() {
      localStorage.setItem("list", JSON.stringify(this.list));
    }
  };
  todoModel.list = JSON.parse(localStorage.getItem("list")) || [];

const todoView = {
    todo_items: document.getElementById("todo_items"),

    initEvents(events) {
        const add_todo_field = document.getElementById("add_todo_field");
        const add_todo_description = document.getElementById("add_todo_description");
        const add_button = document.getElementById("add_button");
        const search_todo = document.getElementById("search_todo");
        const all_button = document.getElementById("all_button");
        const completed_button = document.getElementById("completed_button");
        const uncompleted_button = document.getElementById("uncompleted_button");
    
        add_button.onclick = () => {
            if(!add_todo_field.value) {
                alert("Title is required")
            }
            else {
                events.create_todo(add_todo_field.value, add_todo_description.value);
                add_todo_field.value = null;
                add_todo_description.value = null;
            }
        };

        search_todo.addEventListener("input", (e) => {
            events.sort_todo_by_title(e.target.value)
        });

        all_button.addEventListener("click", () => {
            events.sort_all();
            all_button.classList.add("button_active");
            completed_button.classList.remove("button_active");
            uncompleted_button.classList.remove("button_active");
        });

        completed_button.addEventListener("click", () => {
            events.sort_completed();
            completed_button.classList.add("button_active");
            all_button.classList.remove("button_active");
            uncompleted_button.classList.remove("button_active");
        });

        uncompleted_button.addEventListener("click", () => {
            events.sort_uncompleted();
            uncompleted_button.classList.add("button_active");
            all_button.classList.remove("button_active");
            completed_button.classList.remove("button_active");
        });
      },

    renderList(todolist, done_click, delete_click, edit_click) {
        this.todo_items.innerHTML = null;
        
        if(!todolist.length) {
            this.todo_items.innerHTML = "<h4>Nothing to do</h4>"
        }

        todolist.forEach((todoitem) => {
            this.todo_items.innerHTML += `
            <li class="todo_item">
                <div class="todo_item_info">
                    <h5 class="todotitle">${todoitem.title}</h5>
                    <p class="todo_description">${todoitem.description}</p>
                </div>
                <div class="todo_item_buttons">
                    <button class="donebutton tab" id="done_button_${todoitem.id}"></button>
                    <button class="editbutton tab" id="edit_button_${todoitem.id}"></button>
                    <button class="deletebutton tab" id="delete_button_${todoitem.id}"></button>
                </div>
            </li>
            `;
        });

        const done_buttons = document.querySelectorAll(".donebutton");
        done_buttons.forEach((button, index) => {
            if(!todolist[index].completed) {
                button.addEventListener("click", () => {
                    done_click(todolist[index])
                })
            }
            else {
                button.className = "done_todo";
                button.tabIndex = -1;
                button.textContent = "Done"
            }
        });

        const edit_buttons = document.querySelectorAll(".editbutton");
        edit_buttons.forEach((button, index) => {
            if(!todolist[index].completed) {
                button.addEventListener("click", () => {
                    this.renderModal(todolist[index], edit_click)
                })
            }
            else {
                button.style.display = "none"
            }
        })

        const delete_buttons = document.querySelectorAll(".deletebutton");
        delete_buttons.forEach((button, index) => {
            button.addEventListener("click", () => {
                delete_click(todolist[index].id)
            })
        })
    },

    renderModal(item, edit_click) {
        modal_container.innerHTML += `
        <div class="modal" style="display: block" tabindex="-1">
        <div class="modal_dialog">
            <div class="modal_content">
                <div class="modal_header">
                    <input type="text" class="add_todo_field" id="modal_title">
                </div>
                <div class="modal_body">
                    <input type="text" class="add_todo_description" id="modal_description">
                </div>
                <div class="modal_footer">
                    <button type="button" class="btn" id="modal_edit_button">Edit</button>
                    <button type="button" class="btn" id="modal_close_button">Close</button>
                </div>
            </div>
        </div>
    </div>
        `;
        const tab = document.querySelectorAll(".tab");
        tab.forEach((item) => {
            item.tabIndex = -1
        });
        const modal_title = document.getElementById("modal_title");
        const modal_description = document.getElementById("modal_description");
        modal_title.value = item.title;
        modal_description.value = item.description;
        const modal_edit_button = document.getElementById("modal_edit_button");
        const modal_close_button = document.getElementById("modal_close_button");
    
        modal_edit_button.addEventListener("click", () => {
            if(!modal_title.value) {
                alert("Title is required")
            }
            else {
                let newTask = {title: modal_title.value, description: modal_description.value};
                edit_click(item, newTask);
                modal_container.innerHTML = null
            }
        });
    
        modal_close_button.onclick = () => {
            modal_container.innerHTML = null;
            tab.forEach((item) => {
                item.tabIndex = 0
            })
        }
    }
};

const todoController = {
    todoModel: todoModel,
    todoView: todoView,

    done_click(prev_task) {
        let updTask = {...prev_task, completed: true};
        this.todoModel.updateTodo(updTask.id, updTask);
        this.render()
    },

    delete_click(id) {
        this.todoModel.deleteTodo(id);
        this.render()
    },

    edit_click(task, new_task) {
        this.todoModel.updateTodo(task.id, new_task);
        this.render()
    },

    create_click(title, description) {
        this.todoModel.createTodo(title, description),
        this.render()
    },

    sort_completed_click() {
        let completed = this.todoModel.list.filter((item) => item.completed === true);
        this.render(completed)
        
    },

    sort_uncompleted_click() {
        let uncompleted = this.todoModel.list.filter((item) => item.completed === false);
        this.render(uncompleted)
        
    },

    sort_all_click() {
        this.render()
    },

    sort_todo_title(searchValue) {
        let searchList = this.todoModel.list.filter((item) => item.title.toUpperCase().includes(searchValue.toUpperCase()));
        this.render(searchList)
    },

    render(list = this.todoModel.list) {
        const done_todo = (prev_task) => {
            this.done_click(prev_task)
        };

        const delete_todo = (id) => {
            this.delete_click(id)
        };

        const edit_todo = (task, new_task) => {
            this.edit_click(task, new_task)
        }

        this.todoView.renderList(list, done_todo, delete_todo, edit_todo)
    },

    init() {
        const create_todo = (title, description) => {
          this.create_click(title, description);
        };

        const sort_all = () => {
            this.sort_all_click()
        };

        const sort_completed = () => {
            this.sort_completed_click()
        };

        const sort_uncompleted = () => {
            this.sort_uncompleted_click()
        };

        const sort_todo_by_title = (searchValue) => {
            this.sort_todo_title(searchValue)
        };

        const events = {
            create_todo: create_todo,
            sort_all: sort_all,
            sort_completed: sort_completed,
            sort_uncompleted: sort_uncompleted,
            sort_todo_by_title: sort_todo_by_title
        }
    
    
        this.render();
        this.todoView.initEvents(events);
    
      },
}

todoController.init()
