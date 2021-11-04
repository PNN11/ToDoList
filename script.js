// const add_todo_field = document.getElementById("add_todo_field");
// const add_todo_description = document.getElementById("add_todo_description")
// const add_button = document.getElementById("add_button");
// const search_todo = document.getElementById("search_todo");
// const all_button = document.getElementById("all_button");
// const completed_button = document.getElementById("completed_button");
// const uncompleted_button = document.getElementById("uncompleted_button");
// const todo_items = document.getElementById("todo_items");
// const modal_container = document.getElementById("modal_container");



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

    initEvents(create_click) {
        const add_todo_field = document.getElementById("add_todo_field");
        const add_todo_description = document.getElementById("add_todo_description");
        const add_button = document.getElementById("add_button");
    
        add_button.onclick = () => {
          create_click(add_todo_field.value, add_todo_description.value);
          add_todo_field.value = null;
          add_todo_description.value = null;
        };
      },

    renderList(todolist, done_click, delete_click) {
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
                    <button class="donebutton" id="done_button_${todoitem.id}"></button>
                    <button class="editbutton" id="edit_button_${todoitem.id}"></button>
                    <button class="deletebutton" id="delete_button_${todoitem.id}"></button>
                </div>
            </li>
            `;
            const done_button = document.getElementById(`done_button_${todoitem.id}`);
            const edit_button = document.getElementById(`edit_button_${todoitem.id}`);
            const delete_button = document.getElementById(`delete_button_${todoitem.id}`);
            if(!todoitem.completed) {
                done_button.addEventListener("click", () => {
                    done_click(todoitem)
                } )
            }
            else {
                done_button.className = "done_todo";
                done_button.textContent = "Done",
                edit_button.style.display = "none"
            }
            delete_button.addEventListener("click", () => {
                delete_click(todoitem.id)
            })

        });
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

    create_click(title, description) {
        this.todoModel.createTodo(title, description),
        this.render()
    },

    render() {
        const done_todo = (prev_task) => {
            this.done_click(prev_task)
        };

        const delete_todo = (id) => {
            this.delete_click(id)
        };

        this.todoView.renderList(this.todoModel.list, done_todo, delete_todo)
    },

    init() {
        const createTodo = (title, description) => {
          this.create_click(title, description);
        };
    
    
        this.render();
        this.todoView.initEvents(createTodo);
    
      },
}

todoController.init()

const renderModal = (item,list) => {
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
    const modal_title = document.getElementById("modal_title");
    const modal_description = document.getElementById("modal_description");
    modal_title.value = item.title;
    modal_description.value = item.description;
    const modal_edit_button = document.getElementById("modal_edit_button");
    const modal_close_button = document.getElementById("modal_close_button");

    modal_edit_button.addEventListener("click", () => {
        item.update({"title": modal_title.value, "description": modal_description.value});
        localStorage.setItem("list",JSON.stringify(list));
        modal_container.innerHTML = null;
        renderList(list)
    });

    modal_close_button.onclick = () => {
        modal_container.innerHTML = null
    }
}