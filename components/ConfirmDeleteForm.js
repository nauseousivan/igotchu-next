"use client";

export default function ConfirmDeleteForm({ action, children, message = "Delete permanently?", className }) {
  return (
    <form
      action={action}
      className={className}
      onSubmit={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </form>
  );
}
