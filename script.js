const add_todo_field = document.getElementById("add_todo_field");
const add_todo_description = document.getElementById("add_todo_description")
const add_button = document.getElementById("add_button");
const search_todo = document.getElementById("search_todo");
const all_button = document.getElementById("all_button");
const completed_button = document.getElementById("completed_button");
const uncompleted_button = document.getElementById("uncompleted_button");
const todo_items = document.getElementById("todo_items");
const modal_container = document.getElementById("modal_container");



const set_id = () => {
    let id = Number(localStorage.getItem("todo_number")) || 0;
    let next_id = id + 1;
    localStorage.setItem("todo_number", next_id);
    return id
}

class Todo_Item {
    constructor(id, title, description, completed) {
        this.id = id,
        this.title = title,
        this.description = description,
        this.completed = completed || false
    }
    update(newtask) {
        Object.assign(this,newtask) 
    }

}

const local_list = JSON.parse(localStorage.getItem("list")) || [];

const todolist = local_list.map((item) => {
    return new Todo_Item(item.id, item.title, item.description, item.completed)
});

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
            list[index].update({"completed": true});
            localStorage.setItem("list",JSON.stringify(list));
            renderList(list)

        }
    });

    const edit_buttons = document.querySelectorAll(".editbutton");

    edit_buttons.forEach((button,index) => {
        if(list[index].completed) {
            button.style.display = "none"
        }
        button.onclick = () => {
            renderModal(list[index], list);
        }
    });

    const delete_buttons = document.querySelectorAll(".deletebutton");

    delete_buttons.forEach((button, index) => {
        button.onclick = () => {
            list.splice(index, 1);
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

all_button.addEventListener("click", () => {
    renderList(todolist);
})

completed_button.addEventListener("click", () => {
    let compl = todolist.filter((item) => item.completed === true);
    renderList(compl)
})

uncompleted_button.addEventListener("click", () => {
    let uncompl = todolist.filter((item) => item.completed === false);
    renderList(uncompl)
})

search_todo.addEventListener("input", (e) => {
    let search_value = e.target.value;
    let arr = todolist.filter((item) => item.title.toUpperCase().includes(search_value.toUpperCase()));
    renderList(arr);
})
