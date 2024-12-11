import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  FormInstance,
  Divider,
} from "antd";
import { ToDo, ToDoCreateDTO, ToDoUpdateDTO } from "@ToDo/todo.model.ts";
import disabledDate from "@utils/DisableDate";
import dayjs from "dayjs";
import { Status } from "@Status/status.model.ts";
import StatusFormModal from "@/app/common/components/StatusFormModal.tsx";

const { RangePicker } = DatePicker;

interface TodoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingTodo: ToDo | null;
  statuses: Status[];
  addTodo: (data: ToDoCreateDTO) => Promise<void>;
  editTodo: (id: number, data: ToDoUpdateDTO) => Promise<void>;
  reloadTodos: () => Promise<void>;
  form: FormInstance;
}

const TodoFormModal: React.FC<TodoFormModalProps> = ({
  isOpen,
  onClose,
  editingTodo,
  statuses,
  addTodo,
  editTodo,
  reloadTodos,
  form,
}) => {
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusForm] = Form.useForm();

  const handleSubmit = async (values: ToDoCreateDTO | ToDoUpdateDTO) => {
    const {
      rangeDates: [createdAt, dueDate],
    } = form.getFieldsValue(["rangeDates"]);

    const payload = {
      title: values.title,
      description: values.description,
      createdAt: dayjs(createdAt).format("YYYY-MM-DD"),
      dueDate: dayjs(dueDate).format("YYYY-MM-DD"),
      statusId: values.statusId,
    };

    if (editingTodo) {
      await editTodo(editingTodo.id, { ...payload, id: editingTodo.id });
    } else {
      await addTodo(payload as ToDoCreateDTO);
    }

    onClose();
    await reloadTodos();
  };

  return (
    <>
      <Modal
        title={editingTodo ? "Edit ToDo" : "Create ToDo"}
        open={isOpen}
        onCancel={onClose}
        footer={null}
      >
        <Form
          form={form}
          initialValues={{
            statusName: "",
          }}
          onFinish={handleSubmit}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="rangeDates"
            label="Date Range"
            rules={[
              { required: true, message: "Start and end dates are required" },
            ]}
          >
            <RangePicker
              disabledDate={disabledDate}
              minDate={dayjs("01.01.2024")}
            />
          </Form.Item>

          <Form.Item
            name="statusId"
            label="Status"
            rules={[{ required: true, message: "Please select a status" }]}
          >
            <Select
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <Divider style={{ margin: "8px 0" }} />
                  <Button
                    type="link"
                    onClick={() => setIsStatusModalOpen(true)}
                    block
                  >
                    + Add New Status
                  </Button>
                </>
              )}
            >
              {statuses.map((status) => (
                <Select.Option key={status.id} value={status.id}>
                  <span
                    style={{
                      color: status.color,
                    }}
                  >
                    {status.name}
                  </span>
                </Select.Option>
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
      <StatusFormModal
        setIsStatusModalOpen={setIsStatusModalOpen}
        isStatusModalOpen={isStatusModalOpen}
        statusForm={statusForm}
      />
    </>
  );
};

export default TodoFormModal;
