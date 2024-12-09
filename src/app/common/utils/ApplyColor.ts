export default function applyColor(statusName: string) {
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
