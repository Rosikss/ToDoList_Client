import {
  Button,
  ColorPicker,
  ColorPickerProps,
  Form,
  FormInstance,
  GetProp,
  Input,
  Modal,
} from "antd";
import {
  Status,
  StatusCreateDTO,
  StatusUpdateDTO,
} from "@Status/status.model.ts";
import React, { useContext, useState } from "react";
import { StoreContext } from "@stores/storeContext.tsx";

type Color = Extract<
  GetProp<ColorPickerProps, "value">,
  string | { cleared: any }
>;
type Format = GetProp<ColorPickerProps, "format">;

interface TodoFormModalProps {
  isStatusModalOpen: boolean;
  setIsStatusModalOpen: (isStatusModalOpen: boolean) => void;
  statusForm: FormInstance;
  statusModel: Status | null;
  setStatusModel: (statusModel: Status | null) => void;
}

const StatusFormModal: React.FC<TodoFormModalProps> = ({
  isStatusModalOpen,
  setIsStatusModalOpen,
  statusForm,
  statusModel,
  setStatusModel,
}) => {
  const { statusStore, todoStore } = useContext(StoreContext);
  const [colorHex, setColorHex] = useState<Color>(
    statusModel?.color || "#1390be",
  );
  const [formatHex, setFormatHex] = useState<Format | undefined>("hex");
  const hexString = React.useMemo<string>(
    () => (typeof colorHex === "string" ? colorHex : colorHex?.toHexString()),
    [colorHex],
  );

  async function handleAddStatus(values: StatusCreateDTO) {
    const payload = {
      name: values.name,
      color: hexString,
    };

    if (statusModel) {
      await statusStore.editStatus(statusModel.id, {
        id: statusModel.id,
        ...payload,
      } as StatusUpdateDTO);
      todoStore.todos = todoStore.todos.map((todo) =>
        todo.statusId === statusModel.id
          ? {
              ...todo,
              statusName: payload.name,
              statusColor: payload.color,
            }
          : todo,
      );
    } else {
      await statusStore.addStatus(payload as StatusCreateDTO);
    }

    setStatusModel(null);
    statusForm.resetFields();
    setIsStatusModalOpen(false);
  }

  return (
    <>
      <Modal
        title={statusModel ? "Edit Status" : "Add Status"}
        open={isStatusModalOpen}
        onCancel={() => {
          setIsStatusModalOpen(false);
          statusForm.resetFields();
          setStatusModel(null);
        }}
        footer={null}
      >
        <Form form={statusForm} onFinish={handleAddStatus}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter a status name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="color"
            label="Color"
            rules={[{ required: true, message: "Please enter a status color" }]}
          >
            <ColorPicker
              format={formatHex}
              value={colorHex}
              onChange={setColorHex}
              onFormatChange={setFormatHex}
            ></ColorPicker>
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
};

export default StatusFormModal;
