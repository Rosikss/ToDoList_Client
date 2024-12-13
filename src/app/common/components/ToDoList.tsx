import React, { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import updateLocale from "dayjs/plugin/updateLocale";
import ToDoFilter from "@/app/common/components/ToDoFilter.tsx";
import TodoTable from "@/app/common/components/ToDoTable.tsx";
import TodoFormModal from "@/app/common/components/ToDoFormModal.tsx";
import { ToDo } from "@ToDo/todo.model.ts";
import { Button, Form, Modal } from "antd";
import { StoreContext } from "@stores/storeContext.tsx";

dayjs.extend(isBetween);
dayjs.extend(updateLocale);
dayjs.updateLocale("en", {
  weekStart: 1,
});

const TodoList: React.FC = observer(() => {
  const { todoStore } = useContext(StoreContext);
  const { statusStore } = useContext(StoreContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<ToDo | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [form] = Form.useForm();

  const filteredTodos = filterStatus
    ? todoStore.todos.filter((todo) => todo.statusName === filterStatus)
    : todoStore.todos;

  useEffect(() => {
    (async () => {
      await todoStore.loadTodos();
      await statusStore.loadStatuses();
    })();
  }, [todoStore, statusStore]);

  function resetForm() {
    form.resetFields();
    setEditingTodo(null);
  }

  function handleOpenForm(todo?: ToDo) {
    resetForm();
    if (todo) {
      setEditingTodo(todo);
      form.setFieldsValue({
        ...todo,
        rangeDates: [dayjs(todo.createdAt), dayjs(todo.dueDate)],
      });
    }
    setIsModalOpen(true);
  }

  function handleCloseForm() {
    resetForm();
    setIsModalOpen(false);
  }

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this todo?",
      onOk: async () => todoStore.removeTodo(id),
    });
  };

  function handleDeleteStatus(statusId: number) {
    Modal.confirm({
      title: "Are you sure you want to delete this status?",
      content: "This will also delete all related todos",
      onOk: async () => {
        await statusStore.removeStatus(statusId);
        todoStore.todos = todoStore.todos.filter(
          (todo) => todo.statusId != statusId,
        );
        form.setFieldValue("statusId", "");
        form.resetFields(["statusId"]);
      },
    });
  }

  return (
    <>
      <Button type="primary" onClick={() => handleOpenForm()}>
        Add ToDo
      </Button>
      <ToDoFilter
        statuses={statusStore.statuses}
        setFilterStatus={setFilterStatus}
      />
      <TodoTable
        todos={filteredTodos}
        statuses={statusStore.statuses}
        handleEdit={handleOpenForm}
        handleDelete={handleDelete}
      />
      <TodoFormModal
        isOpen={isModalOpen}
        onClose={handleCloseForm}
        editingTodo={editingTodo}
        statuses={statusStore.statuses}
        addTodo={todoStore.addTodo}
        onStatusDelete={handleDeleteStatus}
        editTodo={todoStore.editTodo}
        form={form}
      />
    </>
  );
});

export default TodoList;
