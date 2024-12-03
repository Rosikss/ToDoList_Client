import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { todoStore } from '../../stores/todoStore';
import { Table, Button, Modal, Form, Input, DatePicker, Select } from 'antd';
import { ToDo, ToDoCreateDTO, ToDoUpdateDTO } from '../../../models/ToDo/todo.model';

const { Option } = Select;

const TodoList: React.FC = observer(() => {
    const { todos, statuses, loadTodos, loadStatuses, addTodo, editTodo, removeTodo } = todoStore;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState<ToDo | null>(null);


    useEffect(() => {
        (async () => {
            await loadTodos();
            await loadStatuses();
        })();
    }, []);


    const handleSubmit = async (values: ToDoCreateDTO | ToDoUpdateDTO) => {
        if (editingTodo) {
            await editTodo(editingTodo.id, { ...values, id: editingTodo.id } as ToDoUpdateDTO);
        } else {
            await addTodo({
                ...values,
                statusId: values.statusId,
            } as ToDoCreateDTO);
        }
        setIsModalOpen(false);
        setEditingTodo(null);
        await loadTodos();
    };

    const handleDelete = (id: number) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this todo?',
            onOk: () => removeTodo(id),
        });
    };

    const columns = [
        { title: 'Title', dataIndex: 'title', key: 'title' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
        { title: 'Due Date', dataIndex: 'dueDate', key: 'dueDate' },
        { title: 'Start Date', dataIndex: 'createdAt', key: 'createdAt' },
        { title: 'Status', dataIndex: 'statusName', key: 'statusName' },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: ToDo) => (
                <>
                    <Button onClick={() => { setEditingTodo(record); setIsModalOpen(true); }}>Edit</Button>
                    <Button onClick={() => handleDelete(record.id)} danger>Delete</Button>
                </>
            ),
        },
    ];

    return (
        <>
            <Button type="primary" onClick={() => setIsModalOpen(true)}>Add ToDo</Button>
            <Table dataSource={todos} columns={columns} rowKey="id" pagination={false} />

            <Modal
                title={editingTodo ? 'Edit ToDo' : 'Create ToDo'}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form
                    onFinish={handleSubmit}
                    initialValues={editingTodo ? {
                        ...editingTodo,
                    } : {
                        statusId: '',
                    }}
                >
                    <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="createdAt" label="Start Date" rules={[{ required: true }]}>
                        <DatePicker />
                    </Form.Item>
                    <Form.Item name="dueDate" label="Due Date" rules={[{ required: true }]}>
                        <DatePicker />
                    </Form.Item>
                    <Form.Item name="statusId" label="Status" rules={[{ required: true }]}>
                        <Select>
                            {statuses.map(status => (
                                <Option key={status.id} value={status.id}>{status.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Submit</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
});

export default TodoList;
