const add_todo_field = document.getElementById("add_todo_field");
const add_todo_description = document.getElementById("add_todo_description")
const add_button = document.getElementById("add_button");
const search_todo = document.getElementById("search_todo");
const all_button = document.getElementById("all_button");
const completed_button = document.getElementById("completed_button");
const uncompleted_button = document.getElementById("uncompleted_button");
const todo_items = document.getElementById("todo_items");

const todolist = JSON.parse(localStorage.getItem("list")) || [];

const set_id = () => {
    let id = Number(localStorage.getItem("todo_number")) || 0;
    let next_id = id + 1;
    localStorage.setItem("todo_number", next_id);
    return id
}

class Todo_Item {
    completed = false;
    constructor(id, title, description) {
        this.id = id,
        this.title = title,
        this.description = description
    }
    update(newtask) {
        Object.assign(this,newtask) 
    }

}

const renderModal = () => {
    
}
 
const renderList = (list) => {
    todo_items.innerHTML = null;
    if(!list.length) {
        todo_items.innerHTML = "<h4>Nothing to do</h4>"
    }
    list.forEach(item => {
        todo_items.innerHTML += `
        <li class="todo_item">
            <div class="todo_item_info">
                <h5 class="todotitle">${item.title}</h5>
                <p class="todo_description">${item.description}</p>
            </div>
            <div class="todo_item_buttons">
                <button class="donebutton" id="done_button"></button>
                <button class="editbutton" id="edit_button"></button>
                <button class="deletebutton" id="delete_button"></button>
            </div>
    </li>
        `
    });
    
    const done_buttons = document.querySelectorAll(".donebutton");

    done_buttons.forEach((button,index) => {
        if(list[index].completed === true) {
            button.className = "done_todo";
            button.textContent = "Done"
        }
        button.onclick = (e) => {
            e.target.className = "done_todo";
            e.target.textContent = "Done";
            list[index].completed = true;
            localStorage.setItem("list",JSON.stringify(list));
            renderList(list)

        }
    });

    const edit_buttons = document.querySelectorAll(".editbutton");

    edit_buttons.forEach((button,index) => {

    });

    const delete_buttons = document.querySelectorAll(".deletebutton");

    delete_buttons.forEach((button, index) => {
        button.onclick = () => {
            list.splice(list[index],1);
            localStorage.setItem("list", JSON.stringify(list));
            renderList(list)
        }
    })
}

const add_new_todo = () => {
    const new_todo = new Todo_Item(set_id(), add_todo_field.value, add_todo_description.value);
    todolist.push(new_todo);
    localStorage.setItem("list", JSON.stringify(todolist));
    renderList(todolist);
    add_todo_field.value = null;
    add_todo_description.value = null
}

add_button.addEventListener("click", add_new_todo);

renderList(todolist);
