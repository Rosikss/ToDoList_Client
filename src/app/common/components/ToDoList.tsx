import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { todoStore } from "@stores/todoStore.ts";

import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import updateLocale from "dayjs/plugin/updateLocale";
import ToDoFilter from "@/app/common/components/ToDoFilter.tsx";
import TodoTable from "@/app/common/components/ToDoTable.tsx";
import TodoFormModal from "@/app/common/components/ToDoFormModal.tsx";
import { ToDo } from "@ToDo/todo.model.ts";
import { Button, Form, Modal } from "antd";

dayjs.extend(isBetween);
dayjs.extend(updateLocale);
dayjs.updateLocale("en", {
  weekStart: 1,
});

const TodoList: React.FC = observer(() => {
  const {
    todos,
    statuses,
    loadTodos,
    loadStatuses,
    addTodo,
    editTodo,
    removeTodo,
  } = todoStore;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<ToDo | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [form] = Form.useForm();

  const filteredTodos = filterStatus
    ? todos.filter((todo) => todo.statusName === filterStatus)
    : todos;

  useEffect(() => {
    (async () => {
      await loadTodos();
      await loadStatuses();
    })();
  }, [loadStatuses, loadTodos]);

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
      onOk: () => removeTodo(id),
    });
  };

  return (
    <>
      <Button type="primary" onClick={() => handleOpenForm()}>
        Add ToDo
      </Button>
      <ToDoFilter statuses={statuses} setFilterStatus={setFilterStatus} />
      <TodoTable
        todos={filteredTodos}
        handleEdit={handleOpenForm}
        handleDelete={handleDelete}
      />
      <TodoFormModal
        isOpen={isModalOpen}
        onClose={handleCloseForm}
        editingTodo={editingTodo}
        statuses={statuses}
        addTodo={addTodo}
        editTodo={editTodo}
        reloadTodos={loadTodos}
        form={form}
      />
    </>
  );
});

export default TodoList;
