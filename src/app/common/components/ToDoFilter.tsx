import React from "react";
import { Button, Dropdown, MenuProps } from "antd";
import { Status } from "@Status/status.model.ts";
import applyColor from "@utils/ApplyColor.ts";

interface FilterDropdownProps {
  statuses: { id: number; name: string }[];
  setFilterStatus: (status: string | null) => void;
}

const ToDoFilter: React.FC<FilterDropdownProps> = ({
  statuses,
  setFilterStatus,
}) => {
  const menuItems: MenuProps["items"] = [
    { label: "All", key: "all" },
    ...statuses.map((status: Status) => ({
      label: (
        <span style={{ color: applyColor(status.name) }}>{status.name}</span>
      ),
      key: status.name,
    })),
  ];

  const handleClick = ({ key }: { key: string }) => {
    setFilterStatus(key === "all" ? null : key);
  };

  return (
    <Dropdown
      menu={{ items: menuItems, onClick: handleClick }}
      placement="bottom"
    >
      <Button>Filter by Status</Button>
    </Dropdown>
  );
};

export default ToDoFilter;
