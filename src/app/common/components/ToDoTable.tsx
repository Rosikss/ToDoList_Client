import React from "react";
import { Table, Button, Tag } from "antd";
import { ToDo } from "@ToDo/todo.model.ts";
import applyColor from "@utils/ApplyColor";
import dayjs from "dayjs";

interface TodoTableProps {
  todos: ToDo[];
  handleEdit: (todo: ToDo) => void;
  handleDelete: (id: number) => void;
}

const TodoTable: React.FC<TodoTableProps> = ({
  todos,
  handleEdit,
  handleDelete,
}) => {
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
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
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button onClick={() => handleDelete(record.id)} danger>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <Table
      dataSource={todos}
      columns={columns}
      rowKey="id"
      pagination={false}
    />
  );
};

export default TodoTable;
