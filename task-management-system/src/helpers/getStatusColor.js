
const getStatusConfig = (status) => {
  switch (status) {
    case "completed":
      return { label: "Completed", color: "success", border: "border-success" };
    case "verified":
      return { label: "Verified", color: "info", border: "border-info" };
    default:
      return { label: "Pending", color: "secondary", border: "border-secondary" };
  }
};

export default getStatusConfig;