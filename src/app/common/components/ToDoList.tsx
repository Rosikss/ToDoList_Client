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
import isBetween from "dayjs/plugin/isBetween";
import updateLocale from "dayjs/plugin/updateLocale";
import TextArea from "antd/es/input/TextArea";

dayjs.extend(isBetween);
dayjs.extend(updateLocale);
dayjs.updateLocale("en", {
  weekStart: 1,
});

const { Option } = Select;
const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";

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

  const startOfWeek = dayjs().startOf("week");
  const endOfWeek = dayjs().endOf("week");

  const filteredTodos = filterStatus
    ? todos.filter((todo) => todo.statusName === filterStatus)
    : todos;

  const menuItems = [
    { label: "All", key: "all" },
    ...statuses.map((status) => ({
      label: (
        <span style={{ color: applyColor(status.name) }}>{status.name}</span>
      ),
      key: status.name,
    })),
  ];

  const disabledDate = (current: dayjs.Dayjs | null) => {
    return current
      ? !current.isBetween(startOfWeek, endOfWeek, "day", "[]")
      : false;
  };

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

  function applyColor(statusName: string) {
    switch (statusName) {
      case "Done":
        return "green";
      case "In Progress":
        return "blue";
      case "Pending":
        return "orange";
      default:
        return "gray";
    }
  }

  const handleSubmit = async (values: ToDoCreateDTO | ToDoUpdateDTO) => {
    const {
      rangeDates: [createdAt, dueDate],
    } = form.getFieldsValue(["rangeDates"]);

    const data = {
      title: values.title,
      createdAt: dayjs(createdAt).format("YYYY-MM-DD"),
      dueDate: dayjs(dueDate).format("YYYY-MM-DD"),
      description: values.description,
      statusId: values.statusId,
    };

    if (editingTodo) {
      await editTodo(editingTodo.id, {
        ...data,
        id: editingTodo.id,
      } as ToDoUpdateDTO);
    } else {
      await addTodo({
        ...data,
      } as ToDoCreateDTO);
    }

    handleCloseForm();
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
      render: (text: string) => <span>{text}</span>,
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
      render: (statusName: string) => (
        <Tag color={applyColor(statusName)}>{statusName}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: string, record: ToDo) => (
        <>
          <Button onClick={() => handleOpenForm(record)}>Edit</Button>
          <Button onClick={() => handleDelete(record.id)} danger>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Button type="primary" onClick={() => handleOpenForm()}>
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
            statusName: "",
          }}
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <TextArea />
          </Form.Item>
          <Form.Item
            name="rangeDates"
            rules={[
              {
                required: true,
                message: "Start date or End date cannot be empty",
              },
            ]}
            label="Date Range"
          >
            <RangePicker disabledDate={disabledDate} format={dateFormat} />
          </Form.Item>
          <Form.Item
            name="statusName"
            label="Status"
            rules={[{ required: true, message: "Please enter status" }]}
          >
            <Select
              onSelect={(status: number) =>
                form.setFieldsValue({ statusId: status })
              }
            >
              {statuses.map((status) => (
                <Option key={status.id} value={status.id}>
                  <span style={{ color: applyColor(status.name) }}>
                    {status.name}
                  </span>
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="statusId" hidden={true}>
            <Input />
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
