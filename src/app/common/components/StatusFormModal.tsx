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
import { statusStore } from "@stores/statusStore.ts";
import { StatusCreateDTO } from "@Status/status.model.ts";
import React, { useState } from "react";

type Color = Extract<
  GetProp<ColorPickerProps, "value">,
  string | { cleared: any }
>;
type Format = GetProp<ColorPickerProps, "format">;

interface TodoFormModalProps {
  isStatusModalOpen: boolean;
  setIsStatusModalOpen: (isStatusModalOpen: boolean) => void;
  statusForm: FormInstance;
}

const StatusFormModal: React.FC<TodoFormModalProps> = ({
  isStatusModalOpen,
  setIsStatusModalOpen,
  statusForm,
}) => {
  const { addStatus } = statusStore;
  const [colorHex, setColorHex] = useState<Color>("#1677ff");
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

    await addStatus(payload as StatusCreateDTO);
    statusForm.resetFields();
    setIsStatusModalOpen(false);
  }

  return (
    <>
      <Modal
        title="Add New Status"
        open={isStatusModalOpen}
        onCancel={() => {
          setIsStatusModalOpen(false);
          statusForm.resetFields();
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
