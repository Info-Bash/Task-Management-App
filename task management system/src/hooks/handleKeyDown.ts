
export const handleKeyDown = (formRef: React.RefObject<HTMLFormElement | null>, e: React.KeyboardEvent<HTMLFormElement>) => {
  if (e.key !== "Enter") return;

  const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

  if (e.key === 'Enter' && target.tagName === 'TEXTAREA') {
    return; // Do nothing, let the default "new line" happen
  }

  // Allow submit button to work normally
  if (
    target.tagName === "BUTTON" ||
    target.type === "submit"
  ) {
    return;
  }

  e.preventDefault();

  if (!formRef.current) return;
  const focusable = Array.from(
    formRef.current.querySelectorAll<HTMLElement>(
      'input:not([disabled]), select:not([disabled]), textarea:not([disabled])'
    )
  );

  const index = focusable.indexOf(target);

  if (index !== -1 && index < focusable.length - 1) {
    focusable[index + 1].focus();
  }
};