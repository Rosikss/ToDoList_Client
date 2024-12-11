import React from "react";
import { Table, Button, Tag } from "antd";
import { ToDo } from "@ToDo/todo.model.ts";
import dayjs from "dayjs";
import { Status } from "@Status/status.model.ts";

interface TodoTableProps {
  todos: ToDo[];
  statuses: Status[];
  handleEdit: (todo: ToDo) => void;
  handleDelete: (id: number) => void;
}

const TodoTable: React.FC<TodoTableProps> = ({
  todos,
  statuses,
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
      render: (_: string, record: ToDo) => (
        <Tag
          color={statuses.find((status) => status.id == record.statusId)?.color}
        >
          {record.statusName}
        </Tag>
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
