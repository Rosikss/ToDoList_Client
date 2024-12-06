import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { todoStore } from "@stores/todoStore.ts";
import { ToDo, ToDoCreateDTO, ToDoUpdateDTO } from "@ToDo/todo.model.ts";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Dropdown,
  MenuProps,
  Tag,
} from "antd";

import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";
const { Option } = Select;

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

  const menuItems = [
    { label: "All", key: "all" }, // Reset filter option
    ...statuses.map((status) => ({
      label: (
        <span style={{ color: applyColor(status.name) }}>{status.name}</span>
      ),
      key: status.name,
    })),
  ];

  const dropdownMenu: MenuProps = {
    items: menuItems,
    onClick: ({ key }) => handleFilterChange(key === "all" ? null : key),
  };

  const handleFilterChange = (status: string | null) => {
    setFilterStatus(status);
  };

  useEffect(() => {
    (async () => {
      await loadTodos();
      await loadStatuses();
    })();
  }, []);

  function resetForm() {
    form.resetFields();
    setEditingTodo(null);
  }

  function handleOpenForm() {
    resetForm();
    setIsModalOpen(true);
  }

  function handleCloseForm() {
    resetForm();
    setIsModalOpen(false);
  }

  function handleOpenFormEdit(record: ToDo) {
    setEditingTodo(record);
    form.setFieldsValue({
      ...record,
      createdAt: dayjs(record.createdAt),
      dueDate: dayjs(record.dueDate),
    });
    setIsModalOpen(true);
  }

  function applyColor(statusName: string) {
    if (statusName === "Done") {
      return "green";
    } else if (statusName === "In Progress") {
      return "blue";
    } else if (statusName === "Pending") {
      return "orange";
    }
    return "gray";
  }

  const handleSubmit = async (values: ToDoCreateDTO | ToDoUpdateDTO) => {
    if (editingTodo) {
      await editTodo(editingTodo.id, {
        ...values,
        id: editingTodo.id,
      } as ToDoUpdateDTO);
    } else {
      await addTodo({
        ...values,
        statusId: values.statusId,
      } as ToDoCreateDTO);
    }
    setIsModalOpen(false);
    setEditingTodo(null);
    console.log(editingTodo);
    await loadTodos();
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this todo?",
      onOk: () => removeTodo(id),
    });
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text: string) => <span>{text}</span>, // Prevents layout issues
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Start Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("DD-MM-YYYY"),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (date: string) => dayjs(date).format("DD-MM-YYYY"),
    },
    {
      title: "Status",
      dataIndex: "statusName",
      key: "statusName",
      render: (_: string, record: ToDo) => {
        return (
          <>
            <Tag color={applyColor(record.statusName)} key={record.statusName}>
              {record.statusName}
            </Tag>
          </>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: string, record: ToDo) => (
        <>
          <Button onClick={() => handleOpenFormEdit(record)}>Edit</Button>
          <Button onClick={() => handleDelete(record.id)} danger>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Button type="primary" onClick={handleOpenForm}>
        Add ToDo
      </Button>
      <Dropdown menu={dropdownMenu} placement="bottom">
        <Button>Filter by Status</Button>
      </Dropdown>
      <Table
        dataSource={filteredTodos}
        columns={columns}
        rowKey="id"
        pagination={false}
      />

      <Modal
        title={editingTodo ? "Edit ToDo" : "Create ToDo"}
        open={isModalOpen}
        onCancel={handleCloseForm}
        footer={null}
      >
        <Form
          onFinish={handleSubmit}
          initialValues={{
            statusId: "",
          }}
          form={form}
        >
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true }]}
          >
            <TextArea />
          </Form.Item>
          <Form.Item
            name="createdAt"
            label="Start Date"
            rules={[{ required: true }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="dueDate"
            label="Due Date"
            rules={[{ required: true }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="statusId"
            label="Status"
            rules={[{ required: true }]}
          >
            <Select>
              {statuses.map((status) => (
                <Option key={status.id} value={status.id}>
                  <span style={{ color: applyColor(status.name) }}>
                    {status.name}
                  </span>
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
});

export default TodoList;
